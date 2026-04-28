import { HttpClient } from '@angular/common/http';
import { computed, effect, Injectable, signal } from '@angular/core';
import { GameState } from '../../../models/game-state/game-state';
import { UiNotification } from '../../../models/game-state/ui-notification';
import { UiNotificationType } from '../../../enum/ui-notification-type';
import { GameResponseDto } from '../../../dto/game-response-dto';
import { GameStateMapperService } from '../gameStateMapper/game-state-mapper.service';
import { GameSummary } from '../../../models/game-summary/game-summary';
import { PlayerResponseDto } from '../../../dto/player-response-dto';
import { CurrentGameContext } from '../../../models/current-game-context/current-game-context';
import { GameContextDto } from '../../../dto/game-context-dto';
import { GameContextMapperService } from '../gameContextMapper/game-context-mapper.service';
import { GameLifecycleStatus } from '../../../enum/game-life-cycle-status';
import { GameSummaryDto } from '../../../dto/game-summary-dto';
import { GameSummaryMapperService } from '../gameSummaryMapper/game-summary-mapper.service';
import { CreatePlayerRequest } from '../../../models/player-request/create-player-request';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { UiModalType } from '../../../enum/ui-modal-type';
import { ActionType } from '../../../enum/action-type';
import { Faction } from '../../../enum/faction';
import { PhaseExecutionStatus } from '../../../enum/phase-execution-status';

@Injectable({
  providedIn: 'root'
})
export class GameStoreService {

  constructor( 
    private http : HttpClient,
    private authService : AuthService,
    private router : Router
  ) { }

  // URLs
  private influenceURL = 'http://localhost:8080/influence';
  private gameURL = 'http://localhost:8080/game/base';
  private playerURL = 'http://localhost:8080/player';
  private actionURL = 'http://localhost:8080/action';
  private sseURL = 'http://localhost:8080/notifications';
  private eventSource? : EventSource;
  private isRefreshing = false;

  // GameState (main signal)
  private readonly _gameState = signal<GameState | null>(null);
  
  // GameState derivations (selectors -> computed signals)
  readonly gameState = this._gameState.asReadonly();
  readonly game = computed(() => this.gameState()?.game);
  readonly phase = computed(() => this.gameState()?.phase);
  readonly phaseStatus = computed(() => this.gameState()?.phase.phaseStatus);
  readonly players = computed(() => this.gameState()?.players ?? {});
  readonly politicos = computed(() => this.gameState()?.politicos ?? {});
  readonly ministries = computed(() => this.gameState()?.ministries ?? {});
  readonly me = computed(() => this.gameState()?.me);
  readonly ui = computed(() => this.gameState()?.ui);

  // Selected Politico (complete entity)
  readonly selectedPolitico = computed(() => {
    const id = this.ui()?.selectedPoliticoID;
    if (!id)
      return null;
    return this.politicos()?.[id] ?? null;
  });
  // Selected Politico's Ministry
  readonly selectedPoliticoMinistry = computed(() => {
      const politico = this.selectedPolitico();
      if (!politico || !politico.ministryID)
          return null;
      return this.ministries()?.[politico.ministryID] ?? null;
  });

  // Utils
  readonly canAnnounceAction = computed(() => 
    this.me()?.canAnnounceAction ?? false
  );
  readonly canRespondAction = computed(() => 
    this.me()?.canRespondAction ?? false
  );
  readonly blockingStatus = computed(() => 
    this.phase()?.blockingStatus ?? 'NONE'
  );
  // Check if I have assigned influence on selected Politico (used to enable/disable declare button in UI)
  readonly hasAssignedInfluenceOnSelectedPolitico = computed(() => {
      const politico = this.selectedPolitico();
      const me = this.me();
      if (!politico || !me)
          return false;
      return me.assignedInfluences?.[politico.id] !== undefined
          || me.playerID === politico.controllerPlayerID;
  });

  // List of existing (or available) Games
  private readonly _availableGames = signal<GameSummary[]>([]);
  readonly availableGames = this._availableGames.asReadonly();

  // Current Game context (used in Lobby and Influence Assignment, contains less info than full GameState)
  private _currentGameContext = signal<CurrentGameContext | null>(null);
  readonly currentGameContext = computed(() => this._currentGameContext());
  readonly lobbyPlayers = computed( () => this.currentGameContext()?.players ?? [] );
  readonly lifeCycleStatus = computed( () => 
    this.gameState()?.game?.lifeCycleStatus ?? 
    this.currentGameContext()?.lifeCycleStatus
  );

  // InfluenceAssignment context (used in Influence Assignment component, contains only info relevant to that phase)
  readonly influenceAssignmentContext = computed(() => {
    const state = this.gameState();
    
    if (!state)
        return null;
    
    if (state.game.currentTurn !== 0)
        return null;

    return {
        politicos : Object.values(state.politicos),
        assigned : state.me?.assignedInfluences ?? {},
        players : Object.values(state.players),
        myPlayerID : state.me?.playerID
    };
  });

  /* Ready Players' selectors */
  readonly readyPlayers = computed(() => {
    
    const players = this.gameState()?.players;
    
    if(players !== undefined) {
      return Object.entries(players).filter(([k, p]) => p.ready);
    } else {
      return [];
    }
  });
  readonly iAmReady = computed(() => {
    const me = this.me();
    if (!me)
        return false;
    return this.readyPlayers().some(
      ([id, _]) => Number(id) === me.playerID
    );
  });
  readonly allPlayersReady = computed(() => {
    return this.readyPlayers().length === Object.values(this.players()).length
  });
  readonly canMarkReady = computed(() => 
    this.phaseStatus() === PhaseExecutionStatus.WAITING_TO_BEGIN && !this.iAmReady()
  );

  // Check if I have confirmed influence assignment (assigned 10 influences and marked ready)
  readonly hasConfirmedInfluenceAssignment = computed(() => {
    const state = this.gameState();
    const me = state?.me;
    const readyplayers = this.readyPlayers();

    if (!state || !me )
        return false;

    const assignedCount = Object.keys(me.assignedInfluences ?? {}).length;
    const isReady = Object.keys(readyplayers).some( k => k === me.playerID.toString() );
    
    return assignedCount === 10 && isReady;
  });

  // Check if influence assignment phase is finished (all players ready with 10 assigned influences)
  readonly influenceAssignmentFinished = computed(() => {
    const state = this.gameState();
    
    if (!state) 
        return false;

    if (state.game.currentTurn !== 0)
        return false;

    return Object.values(state.players).every(p => p.ready);
  });

  // Influences declared by Players on every Politico
  declaredInfluencesByPolitico = computed(() => {

    const state = this.gameState();
    if (!state)
        return {};

    const result : Record<number, { playerID : number, value : number }[]> = {};

    for (const politicoID of Object.keys(state.politicos)) {
      const list : { playerID : number, value : number}[] = [];

      for (const player of Object.values(state.players)) {
        const declared = player.declaredInfluences?.[Number(politicoID)];

        if (declared && declared > 0) {
          list.push({ playerID : player.id, value : declared });
        }
      }

      if (list.length > 0) {
        result[Number(politicoID)] = list;
      }
    }

    return result;
  });

  /* Player Color Map (derived from player's faction) */
  readonly playerColorMap = computed(() => {
    const players = this.gameState()?.players;
    let colorMap = new Map<number, string>();

    for (const playerID in players) {
      const player = players[Number(playerID)];
      let color = '';
      for (let [key, value] of Object.entries(Faction)) {
        if (key === player.factionColor) {
          color = value;
        }
      }
      if (player.factionColor !== undefined) {
        colorMap.set(player.id, color);
      }
    }

    return colorMap;
  });

  // Check if I can confirm phase execution (used to enable/disable button in UI)
  readonly canConfirmPhase = computed(() => 
    this.phaseStatus() === PhaseExecutionStatus.OPEN_FOR_ACTIONS
    && !this.iAmReady()
  );

  readonly politicosControlledByMe = computed(() => {
    return Object.values(
      this.politicos()).filter(p => p.controllerPlayerID === this.me()?.playerID
    );
  });
  
  /** SSE **/
  // Init SSE (handshake)
  private initSSE(gameID : number) {

    console.log('initSSE called with gameID =', gameID);

    this.http
        .post(
          this.sseURL + "/handshake",
          {},
          { 
            withCredentials : true,
            headers : { Authorization : `Bearer ${this.authService.getToken()}` }
          }
        )
        .subscribe({
          next : () => { this.connectToSse(gameID); },
          error : err => { console.error('SSE handshake failed.', err); }
        });
  }
  // SSE connection
  private connectToSse(gameID : number) : void {
    
    console.log('connectToSse called');

    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = new EventSource(
      this.sseURL + `/game/${gameID}/events`,
      { withCredentials : true }
    );

    this.eventSource.addEventListener('GAME_UPDATE', e => 
      this.handleGameUpdate(e)
    );

    this.eventSource.addEventListener('GAME_MESSAGE', e => 
      this.handleGameMessage(e)
    );
    
    this.eventSource.addEventListener('PRIVATE_MESSAGE', e => 
      this.handleGameMessage(e)
    );

    this.eventSource.onopen = () => {
      console.log('SSE connected');
    };

    this.eventSource.onerror = err => {
      console.error('SSE error', err);
    };
  }
  /* SSE Event Handlers */
  private handleGameUpdate(event : MessageEvent) : void {

    console.log('GAME_UPDATE received', event.data);
    
    const payload = JSON.parse(event.data);
    const serverCounter = payload.updateCounter;

    const currentState = this.gameState();

    if (!currentState)
        return;

    const localCounter = currentState.game.updateCounter;

    if (serverCounter <= localCounter)
        return;

    if (this.isRefreshing)
        return;

    this.isRefreshing = true;

    const gameID = currentState.game.id;

    if (!gameID)
        return;

    this.http.get<GameResponseDto>(this.gameURL + '/state/' + gameID)
             .subscribe({
                next : dto => {
                  const newState = GameStateMapperService.fromDTO(dto);
                  this._gameState.set(newState);
                  this.isRefreshing = false;
                },
                error : err => {
                  console.error("Failed to refresh game after GAME_UPDATE", err);
                  this.isRefreshing = false;
                }
             });
  }
  private handleGameMessage(event : MessageEvent) : void {

    console.log('GAME_MESSAGE received', event.data);

    const message = event.data;

    const notification : UiNotification = {
      id : Date.now().toString(),
      type : UiNotificationType.INFO,
      message : message,
      ttl : 4000
    };

    this._gameState.update(state => {
      
      if (!state)
          return state;

      return {
        ...state,
        ui : {
          ...state.ui,
          notifications : [
            ...state.ui.notifications,
            notification
          ]
        }
      };
    });

    if (notification.ttl) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.ttl);
    }
  }
  private removeNotification(id : string) : void {
    this._gameState.update(state => {
        if (!state)
           return state;
        return {
            ...state,
            ui : {
              ...state.ui,
              notifications : state.ui.notifications.filter(n => n.id !== id)
            }
        };
    });
  }

  /* Game List methods */
  // Create new Game
  createGame( maxPlayers : number ) {
      return this.http.post<GameResponseDto>(
        this.gameURL + `/new/max_players/${maxPlayers}`,
        {}
      );
  }
  // Create Player in an existing Game
  joinGame( gameID : number, payload: CreatePlayerRequest ) {
    // Call create Player endpoint.
    return this.http.post<PlayerResponseDto>(this.playerURL + `/game/${gameID}/single`, payload);
  }
  // Load games list
  loadAvailableGames() {
      this.http.get<GameSummaryDto[]>(this.gameURL + "/summary_list")
               .subscribe({
                  next : dtos => this._availableGames.set(
                      dtos.map(GameSummaryMapperService.fromDTO)
                  ),
                  error : err => {
                    console.error("Failed to load games.", err);
                    this._availableGames.set([]);
                  }
                });
  }

  /* LOBBY methods */
  // Load Game context
  loadGameContext(gameID : number) {
    this.http
      .get<GameContextDto>(this.gameURL + `/context/${gameID}`)
      .subscribe({
         next : dto => {
           const context = GameContextMapperService.fromDTO(dto);
           this._currentGameContext.set(context);
         },
         error : err => {
           console.error("Failed to load Game context.", err);
           this._currentGameContext.set(null);
         }
      });
  }
  // Toggle Player ready
  toggleReady(gameID : number) {
    return this.http.post(this.gameURL + `/${gameID}/lobby/toggle-ready`, {});
  }
  // Begin Influence Assignment
  beginInfluenceAssignment(gameID : number) {
    return this.http.post(this.gameURL + `/${gameID}/begin-influence-assignment`, {});
  }

  /* INFLUENCE_ASSIGNMENT methods */
  // Assign influence on a Politico (REST)
  assignInfluence(politicoID : number, value : number | null) {

    const playerID = this.me()?.playerID;
    if (!playerID)
        return;

    this.http.post(
      this.influenceURL + '/assigned',
      {
        points : value,
        playerId : this.me()?.playerID,
        gamePoliticoId : politicoID
      }
    ).subscribe({
      next : () => {
        this._gameState.update(state => {
          
          if (!state)
              return state;

          const current = {...state?.me.assignedInfluences};
          if (value === null) {
            delete current[politicoID];
          } else {
            current[politicoID] = value;
          }

          return {
            ...state,
            me : {
              ...state.me,
              assignedInfluences : current
            }
          };
        });
      },
      error : err => {
        console.error("Failed to assign influence.", err);
      }
    });
  }
  // Confirm assignments
  confirmInfluenceAssignment() {

    const gameID = this.game()?.id;
    if (!gameID)
        return;

    this.http.post(
      this.gameURL + `/${this.game()?.id}/confirm-influence-assignment`,
      {}
    ).subscribe({
      next : () => {
        console.log("Influence assignment confirmed.\n");
      },
      error : err => {
        console.error("Failed to confirm influence assignment.", err);
      }
    });
  }

  /* Redirect according to Game state */
  routeAfterGameLoad(gameID : number) {
    
    const state = this.gameState();
    if (!state || !state.me)
        return;

    // Turn 0 -> Influence Assignment
    if (state.game.currentTurn === 0) {

        // If not yet started -> redirect to Lobby (not Ready)
        if (state.game.startedAt === null) {
            this.router.navigate([`game/${gameID}/lobby`]);
            return;
        }
        // If not yet finished with influence assignment
        if (!this.hasConfirmedInfluenceAssignment()) {
            this.router.navigate([`/game/${gameID}/influence-assignment`]);
            return;
        }
        // Already finished and confirmed -> redirect to Lobby
        this.router.navigate([`game/${gameID}/lobby`]);
        return;
    }

    // Turn 1+
    this.router.navigate([`game/${gameID}`]);
  }
  
  /* Game methods */
  // Initial game load (REST)
  loadGame(gameID : number) : void {

    this.http.get<GameResponseDto>(this.gameURL + '/state/' + gameID)
             .subscribe({
                next : dto => {
                  const gameState = GameStateMapperService.fromDTO(dto);
                  this._gameState.set(gameState);
                  console.log(this.gameState());
                  this.initSSE(gameID);
                  this.routeAfterGameLoad(gameID);
                },
                error : err => {
                  console.error('Failed to load Game', err);
                  this._gameState.set(null);
                }
             });
  }
  // Start current Game (turn 1) (REST)
  startGame(gameID : number) : void {
    this.http
      .post<GameResponseDto>(this.gameURL + `/start/${gameID}`, {})
      .subscribe({
          next : dto => {
            const gameState = GameStateMapperService.fromDTO(dto);
            this._gameState.set(gameState);
            this._currentGameContext.update(context => {
                if (!context) 
                    return context;
                return {
                  ...context,
                  lifeCycleStatus : GameLifecycleStatus.RUNNING,
                  gameState
                };
            });

            this.initSSE(gameID);
          }
      });
  }
  // Select Politico
  selectPolitico(politicoID : number) : void {
    this._gameState.update(state => {
      
      if (!state) return state;

      const current = state.ui.selectedPoliticoID;
      const next = current === politicoID ? null : politicoID;

      return {
        ...state,
        ui : {
          ...state.ui,
          selectedPoliticoID : next
        }
      };
    });
  }
  // Mark Player ready
  markPlayerReady(gameID : number) {
    return this.http.post(this.gameURL + `/${gameID}/playerReady`, {});
  }
  // Begin current phase
  beginPhase(gameID : number) {
    return this.http.post(this.gameURL + `/begin_phase/${gameID}`, {});
  }


  /* Modals */
  openDeclareInfluenceModal(politicoID : number) {
    const type = ActionType.DECLARE_INFLUENCE;
    this._gameState.update(state => {
      if (!state)
          return state;
      return {
        ...state,
        ui : {
          ...state.ui,
          modal : {
            type : UiModalType.ACTION_CONFIRM,
            payload : { "politicoID" : politicoID, 
                        "actionType" : type }
          }
        }
      };
    });
  }

  openHospitalModal(politicoID : number) {
    const type = ActionType.SEND_HOSPITAL;
    this._gameState.update(state => {
      if (!state)
          return state;
      return {
        ...state,
        ui : {
          ...state.ui,
          modal : {
            type : UiModalType.ACTION_CONFIRM,
            payload : { "politicoID" : politicoID, 
                        "actionType" : type }
          }
        }
      };
    });
  }

  openPurgeModal(politicoID : number) {
    const type = ActionType.PURGE_ATTEMPT;
    this._gameState.update(state => {
      if (!state)
          return state;
      return {
        ...state,
        ui : {
          ...state.ui,
          modal : {
            type : UiModalType.ACTION_CONFIRM,
            payload : { "accusingMinisterID" : politicoID,
                        "actionType" : type }
          }
        }
      };
    });
  }

  openExileEscapeModal(politicoID : number) {
    const type = ActionType.EXILE_ESCAPE;
    this._gameState.update( state => {
      if(!state)
        return state;
      return {
        ...state,
        ui : {
          ...state.ui,
          modal : {
            type : UiModalType.ACTION_CONFIRM,
            payload : {
              "politicoID" : politicoID,
              "actionType" : type
            }
          }
        }
      };
    });
  }

  openCancelModal(actionID : number) {
    const actionType = null;
    this._gameState.update(state => {
      if (!state)
          return state;

      return {
        ...state,
        ui : {
          ...state.ui,
          modal : {
            type : UiModalType.ACTION_CONFIRM,
            payload : { "actionID" : actionID, 
                        "actionType" : actionType }
          }
        }
      };
    });
  }

  closeModal() : void {
    
    this._gameState.update(state => {
      
      if (!state)
          return state;

      return {
        ...state,
        ui : {
          ...state.ui,
          modal : {
            type : null,
            payload : undefined
          }
        }
      };
    });
  }


  /* Action methods */
  // Declare influence (REST)
  declareInfluence(value : number) {

    const state = this.gameState();

    if (!state)
        return;

    const politicoID = state.ui.modal.payload.politicoID;
    const gameID = state.game.id;

    this.http.post(
      this.actionURL + '/announce', 
      {
        "gameID" : gameID,
        "type" : ActionType.DECLARE_INFLUENCE,
        "targetGamePoliticoID" : politicoID,
        "influencePoints" : value
      }
    ).subscribe({
      next : () => {
        this.closeModal();
      },
      error : err => {
        console.error("Declare influence failed.", err);
      }
    });
  }
  // Announce action (REST)
  announceAction(action : any) {
    this.http.post(this.actionURL + '/announce', action)
             .subscribe({
               next : () => {
                 this.closeModal();
               },
               error : err => {
                 console.error("Action announcement failed.", err);
               }
             });
  }
  // Cancel action (REST)
  cancelAction(actionID : number, gameID : number) {
    this.http.post(this.actionURL + `/cancel/${gameID}/${actionID}`, {})
             .subscribe({
               next : () => {
                 this.closeModal();
               },
               error : err => {
                 console.error("Failed to cancel action: " + actionID, err);
               }
             });
  }

  /* Phase methods */
  resolveAwaitingAction(gameID : number) {
    return this.http.post(this.gameURL + '/resolve_awaiting/' + gameID, {});
  }
  confirmPhaseExecution(gameID : number) {
    return this.http.post(this.gameURL + '/confirm_phase_exec/' + gameID, {});
  }
  nextPhase(gameID : number) {
    return this.http.post(this.gameURL + '/next_phase/' + gameID, {});
  }

  // Clean on Game quit.
  clearGame() : void {
    this.eventSource?.close();
    this.eventSource = undefined;
    this._gameState.set(null);
  }
  clearCurrentGameContext() {
    this._currentGameContext.set(null);
  }

}

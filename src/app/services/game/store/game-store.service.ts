import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
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

@Injectable({
  providedIn: 'root'
})
export class GameStoreService {

  constructor( private http : HttpClient ) { }

  // URLs
  private gameURL = 'http://localhost:8080/game/base';
  private playerURL = 'http://localhost:8080/player';
  private actionURL = 'http://localhost:8080/action';
  private sseURL = 'http://localhost:8080/notifications';
  private eventSource? : EventSource;

  // GameState (main signal)
  private readonly _gameState = signal<GameState | null>(null);
  
  // GameState derivations (selectors -> computed signals)
  readonly gameState = this._gameState.asReadonly();
  readonly game = computed(() => this.gameState()?.game);
  readonly phase = computed(() => this.gameState()?.phase);
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
  readonly blockingStatus = computed(() => 
    this.phase()?.blockingStatus ?? 'NONE'
  );
  // Is selected Politico mine?
  readonly selectedPoliticoIsMine = computed(() => {
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

  // Current Game context
  private _currentGameContext = signal<CurrentGameContext | null>(null);
  readonly currentGameContext = computed(() => this._currentGameContext());
  readonly lobbyPlayers = computed( () => this.currentGameContext()?.players ?? [] );
  readonly lifeCycleStatus = computed( () => this.currentGameContext()?.lifeCycleStatus );

  /** SSE **/
  // SSE connection
  private connectToSse(gameID : number) : void {
    
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

    this.eventSource.onerror = err => {
      console.error('SSE error', err);
    };
  }
  /* SSE Event Handlers */
  private handleGameUpdate(event : MessageEvent) : void {
    
    const payload = JSON.parse(event.data);

    this._gameState.update(state => {
      if (!state) 
        return state;

      return {
        ...state,
        game : {
          ...state.game,
          updateCounter : payload.updateCounter
        }
      };
    });
  }
  private handleGameMessage(event : MessageEvent) : void {

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
           this._gameState.set(null);  // No game loaded yet
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
  

  /* Game methods */
  // Initial game load (REST)
  loadGame(gameID : number) : void {

    console.log('loadGame called with gameID = ', gameID);

    this.http.get<GameResponseDto>(this.gameURL + '/state/' + gameID)
             .subscribe({
                next : dto => {
                  console.log('Raw DTO received from backend:', dto);
                  const gameState = GameStateMapperService.fromDTO(dto);
                  console.log('Mapped GameState: ', gameState);
                  this._gameState.set(gameState);
                  this.connectToSse(gameID);
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

            this.connectToSse(gameID);
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

  /* Action methods */
  // Announce action (REST)
  announceAction(action : any) {
    return this.http.post(this.actionURL + '/announce', action);
  }
  // Cancel action (REST)
  cancelAction(action : any) {
    return this.http.post(this.actionURL + '/cancel', action);
  }


  /* Phase methods */
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

import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { GameState } from '../../../models/game-state/game-state';
import { UiNotification } from '../../../models/game-state/ui-notification';
import { UiNotificationType } from '../../../enum/ui-notification-type';

@Injectable({
  providedIn: 'root'
})
export class GameStoreService {

  constructor( private http : HttpClient ) { }

  // URLs
  private gameURL = 'http://localhost:8080/game/base';
  private sseURL = 'http://localhost:8080/notifications';
  private actionURL = 'http://localhost:8080/action';
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

  // Utils
  readonly canAnnounceAction = computed(() => 
    this.me()?.canAnnounceAction ?? false
  );
  readonly blockingStatus = computed(() => 
    this.phase()?.blockingStatus ?? 'NONE'
  );


  /* Main methods */

  // Initial game load (REST)
  loadGame(gameID : number) : void {
    this.http.get<GameState>(this.gameURL + '/state/' + gameID)
             .subscribe({
                next : state => {
                  this._gameState.set(state);
                  this.connectToSse(gameID);
                },
                error : err => {
                  console.error('Failed to load Game', err);
                  this._gameState.set(null);
                }
             });
  }

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


  /* Facade methods */

  // Action methods
  announceAction(action : any) {
    return this.http.post(this.actionURL + '/announce', action);
  }

  cancelAction(action : any) {
    return this.http.post(this.actionURL + '/cancel', action);
  }


  // Phase methods

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

}

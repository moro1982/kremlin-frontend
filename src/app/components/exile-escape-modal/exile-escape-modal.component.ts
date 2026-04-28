import { Component, computed } from '@angular/core';
import { GameStoreService } from '../../services/game/store/game-store.service';
import { ActionType } from '../../enum/action-type';

@Component({
  selector: 'app-exile-escape-modal',
  standalone: true,
  templateUrl: './exile-escape-modal.component.html',
  styleUrl: './exile-escape-modal.component.scss'
})
export class ExileEscapeModalComponent {

  constructor(private gameStore : GameStoreService) { }

  ActionType = ActionType;
  targetPoliticoID = computed( () => this.gameStore.gameState()?.ui.modal.payload.politicoID);

  confirmExile() {
    const state = this.gameStore.gameState();
    if (!state) {
      return;
    }
    const politicoID = state.ui.modal.payload.politicoID;
    const gameID = state.game.id;
    this.gameStore.announceAction(
      {
        "gameID" : gameID,
        "type" : ActionType.EXILE_ESCAPE,
        "targetGamePoliticoID" : politicoID
      }
    );
  }
  close() {
    this.gameStore.closeModal();
  }
  
}

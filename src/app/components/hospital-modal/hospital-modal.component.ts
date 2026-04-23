import { Component, computed } from '@angular/core';
import { GameStoreService } from '../../services/game/store/game-store.service';
import { ActionType } from '../../enum/action-type';

@Component({
  selector: 'app-hospital-modal',
  standalone: true,
  templateUrl: './hospital-modal.component.html',
  styleUrl: './hospital-modal.component.scss'
})
export class HospitalModalComponent {
  
  constructor(private gameStore : GameStoreService) { }

  ActionType = ActionType;
  targetPoliticoID = computed( () => this.gameStore.gameState()?.ui.modal.payload.politicoID );

  sendToHospital() {
    const state = this.gameStore.gameState();

    if (!state)
        return;

    const politicoID = state.ui.modal.payload.politicoID;
    const gameID = state.game.id;

    this.gameStore.announceAction(
      {
        "gameID" : gameID,
        "type" : ActionType.SEND_HOSPITAL,
        "targetGamePoliticoID" : politicoID
      }
    );
  }

  close() {
    this.gameStore.closeModal();
  }
}

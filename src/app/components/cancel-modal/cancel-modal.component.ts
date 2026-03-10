import { Component } from '@angular/core';
import { GameStoreService } from '../../services/game/store/game-store.service';
import { ActionInstanceDto } from '../../dto/action-instance-dto';

@Component({
  selector: 'app-cancel-modal',
  standalone: true,
  imports: [],
  templateUrl: './cancel-modal.component.html',
  styleUrl: './cancel-modal.component.scss'
})
export class CancelModalComponent {
  constructor(private gameStore: GameStoreService) { }

  cancelAction() {
    const gameState = this.gameStore.gameState();

    if (!gameState)
        return;

    const gameID = gameState.game.id;
    const selectedActionID = gameState.ui.modal.payload.actionID;
    const action = 
        gameState.phase.announcedActions.find(action => action.id === selectedActionID);
    if (!action)
        return;

    this.gameStore.cancelAction(action.id, gameID);
  }

  close() {
    this.gameStore.closeModal();
  }
}

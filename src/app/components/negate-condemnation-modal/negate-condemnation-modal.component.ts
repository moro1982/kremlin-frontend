import { Component, computed } from '@angular/core';
import { GameStoreService } from '../../services/game/store/game-store.service';
import { ActionType } from '../../enum/action-type';

@Component({
  selector: 'app-negate-condemnation-modal',
  standalone : true,
  imports: [],
  templateUrl: './negate-condemnation-modal.component.html',
  styleUrl: './negate-condemnation-modal.component.scss'
})
export class NegateCondemnationModalComponent {

  constructor(private gameStore : GameStoreService) { }

  politicos = computed(() => this.gameStore.gameState()?.politicos);
  negatorMinisterID = computed(() => {
    return this.gameStore.gameState()?.ui.modal.payload.negatorMinisterID ?? null;
  });
  negatorMinister = computed(() => {
    const politicos = this.politicos();
    const ministerID = this.negatorMinisterID();
    if (politicos && ministerID !== null) {
      return this.politicos()?.[ministerID];
    }
    return null;
  });
  targetedMinisterID = computed(() => {
    return this.gameStore.gameState()?.phase?.awaitingAction?.targetPoliticoID;
  });
  targetedMinister = computed(() => this.politicos()?.[this.targetedMinisterID() ?? -1]);

  // Selected target for investigation
  value = "";

  negateCondemnation() {
    const state = this.gameStore.gameState();
    if(!state)
        return;
    const gameID = state.game.id;
    const action = {
      "gameID" : gameID,
      "type" : ActionType.NEGATE_CONDEMNATION,
      "actingGamePoliticoID" : this.negatorMinisterID(),
      "targetGamePoliticoID" : this.targetedMinisterID()
    };
    this.gameStore.announceAction(action);
  }

  close() {
    this.gameStore.closeModal();
  }

}

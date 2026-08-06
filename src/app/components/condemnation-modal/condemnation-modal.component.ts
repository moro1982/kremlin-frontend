import { NgFor } from '@angular/common';
import { Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameStoreService } from '../../services/game/store/game-store.service';
import { MinistryType } from '../../enum/ministry-type';
import { GamePoliticoStatus } from '../../enum/game-politico-status';
import { ActionType } from '../../enum/action-type';

@Component({
  selector: 'app-condemnation-modal',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './condemnation-modal.component.html',
  styleUrl: './condemnation-modal.component.scss'
})
export class CondemnationModalComponent {

  constructor(private gameStore : GameStoreService) { }
  Number = Number;

  politicos = computed(() => this.gameStore.gameState()?.politicos);
  accusingMinisterID = computed(() => {
    return this.gameStore.gameState()?.ui.modal.payload.accusingMinisterID ?? null;
  });
  accusingMinister = computed(() => {
    const politicos = this.politicos();
    const ministerID = this.accusingMinisterID();
    if (politicos && ministerID !== null) {
      return this.politicos()?.[ministerID];
    }
    return null;
  });
  possibleTargets = computed( () => {
    const politicos = this.politicos();
    const ministries = this.gameStore.gameState()?.ministries;
    const possibleTargets = Object.values(ministries ?? {})
                                  .filter( m => m.name === MinistryType.CANDIDATE );
    return Object.values(politicos ?? {})
                 .filter( p => p.ministryID !== null &&
                               possibleTargets.some( m => m.id === p.ministryID )
                 )
                 .filter( p => p.status === GamePoliticoStatus.ACTIVE ||
                               p.status === GamePoliticoStatus.AT_HOSPITAL
                 );
  });

  // Selected target for investigation
  value = "";

  condemnCandidate() {
    const state = this.gameStore.gameState();
    if(!state)
        return;
    const gameID = state.game.id;
    const action = {
      "gameID" : gameID,
      "type" : ActionType.CONDEMNATION,
      "actingGamePoliticoID" : this.accusingMinisterID(),
      "targetGamePoliticoID" : this.value ? Number(this.value) : null
    };  
    this.gameStore.announceAction(action);
  }
  
  close() {
    this.gameStore.closeModal();
  }
}

import { Component, computed } from '@angular/core';
import { GameStoreService } from '../../services/game/store/game-store.service';
import { MinistryType } from '../../enum/ministry-type';
import { GamePoliticoStatus } from '../../enum/game-politico-status';
import { ActionType } from '../../enum/action-type';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-investigation-modal',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './investigation-modal.component.html',
  styleUrl: './investigation-modal.component.scss'
})
export class InvestigationModalComponent {
  
  constructor(private gameStore : GameStoreService){ }
  
  Number = Number;
  
  politicos = computed(() => this.gameStore.gameState()?.politicos);
  accusingMinisterID = computed(() => {
    return this.gameStore.gameState()?.ui.modal.payload.accusingMinisterID ?? null;
  });
  acussingMinister = computed(() => {
    const politicos = this.politicos();
    const ministerID = this.accusingMinisterID();
    if (politicos && ministerID !== null) {
      return this.politicos()?.[ministerID];
    }
    return null;
  });

  // Politicos that can be investigated
  possibleTargets = computed(() => {
    const politicos = this.politicos();
    const ministries = this.gameStore.gameState()?.ministries;
    const accuserID = this.accusingMinisterID();
    const possibleTargets = Object.values(ministries ?? {})
                                  .filter( m => m.name !== MinistryType.PEOPLE && 
                                                m.name !== MinistryType.CANDIDATE )
                                  .filter( m => m.ministerID !== accuserID );
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

  beginInvestigation() {
    const state = this.gameStore.gameState();
    if(!state)
        return;
    const gameID = state.game.id;
    const action = {
      "gameID" : gameID,
      "type" : ActionType.BEGIN_INVESTIGATION,
      "actingGamePoliticoID" : this.accusingMinisterID(),
      "targetGamePoliticoID" : this.value ? Number(this.value) : null
    };

    /**************** DEBUG ******************/
    console.log("Announcing action: ", action);
    /*****************************************/

    this.gameStore.announceAction( action );
  }

  close() {
    this.gameStore.closeModal();
  }
}

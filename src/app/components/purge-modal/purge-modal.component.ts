import { Component, computed } from '@angular/core';
import { GameStoreService } from '../../services/game/store/game-store.service';
import { MinistryType } from '../../enum/ministry-type';
import { GamePoliticoStatus } from '../../enum/game-politico-status';
import { NgFor } from '@angular/common';
import { ActionType } from '../../enum/action-type';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-purge-modal',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './purge-modal.component.html',
  styleUrl: './purge-modal.component.scss'
})
export class PurgeModalComponent {
    
  constructor(private gameStore : GameStoreService) { }

  politicos = computed(() => this.gameStore.gameState()?.politicos);
  accusingMinisterID = computed( () => {
    return this.gameStore.gameState()?.ui.modal.payload.accusingMinisterID ?? null;
  } );
  accusingMinister = computed( () => {
    const politicos = this.politicos();
    const ministerID = this.accusingMinisterID();
    if ( politicos && ministerID !== null) {
      return politicos[ministerID];
    }
    return null;
  });
  // Politicos that can be purged
  possibleTargets = computed(() => {
    const politicos = this.politicos();
    const ministries = this.gameStore.gameState()?.ministries;
    const accuserID = this.accusingMinisterID();
    const possibleTargets = Object.values(ministries ?? {})
                                  .filter( m => m.name !== MinistryType.PEOPLE )
                                  .filter( m => m.ministerID !== accuserID );
    return Object.values(politicos ?? {})
                 .filter( p => p.ministryID !== null && 
                          possibleTargets.some( m => m.id === p.ministryID )
                 )
                 .filter( p => p.status === GamePoliticoStatus.ACTIVE ||
                               p.status === GamePoliticoStatus.AT_HOSPITAL
                 );
  });
  value = "";

  confirmPurge() {

    const state = this.gameStore.gameState();

    if (!state)
        return;

    const gameID = state.game.id;

    const action = {
      "gameID" : gameID,
      "type" : ActionType.PURGE_ATTEMPT,
      "actingGamePoliticoID" : this.accusingMinisterID(),
      "targetGamePoliticoID" : this.value ? Number(this.value) : null
    };

    console.log("Announcing action: ", action);
    
    this.gameStore.announceAction( action );
  }

  close() {
    this.gameStore.closeModal();
  }
}

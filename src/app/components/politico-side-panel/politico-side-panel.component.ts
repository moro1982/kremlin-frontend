
import { Component, computed } from '@angular/core';
import { GameStoreService } from '../../services/game/store/game-store.service';
import { NgIf } from '@angular/common';
import { PhaseExecutionStatus } from '../../enum/phase-execution-status';

@Component({
  selector: 'app-politico-side-panel',
  standalone: true,
  imports: [NgIf],
  templateUrl: './politico-side-panel.component.html',
  styleUrl: './politico-side-panel.component.scss'
})
export class PoliticoSidePanelComponent {

    constructor(public readonly gameStore : GameStoreService) { }

    selectedPolitico = computed( () => this.gameStore.selectedPolitico() );
    
    influenceAssignedOnSelectedPolitico = computed( () => {
      const politicoID = this.selectedPolitico()?.id;
      if (politicoID !== undefined) {
        return this.gameStore.me()?.assignedInfluences[politicoID];
      } else {
        return null;
      }
    } );

    canDeclareInfluence = computed(() => {
      if (this.gameStore.phaseStatus() !== PhaseExecutionStatus.OPEN_FOR_ACTIONS) {
        return false;
      }
      if (!this.selectedPolitico()) {
          return false;
      }
      if (!this.gameStore.hasAssignedInfluenceOnSelectedPolitico()) {
          return false;
      }
      return true;
    });

    openDeclareInfluenceModal() {
      const selectedPoliticoID = this.selectedPolitico()?.id;
      if (selectedPoliticoID) {
        this.gameStore.openDeclareInfluenceModal(selectedPoliticoID);
      }
    }

}

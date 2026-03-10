
import { Component, computed } from '@angular/core';
import { GameStoreService } from '../../services/game/store/game-store.service';
import { NgIf } from '@angular/common';
import { PhaseExecutionStatus } from '../../enum/phase-execution-status';
import { ActionType } from '../../enum/action-type';
import { GamePoliticoStatus } from '../../enum/game-politico-status';

@Component({
  selector: 'app-politico-side-panel',
  standalone: true,
  imports: [NgIf],
  templateUrl: './politico-side-panel.component.html',
  styleUrl: './politico-side-panel.component.scss'
})
export class PoliticoSidePanelComponent {

    constructor(public readonly gameStore : GameStoreService) { }

    Number = Number;
    ActionType = ActionType;
    players = computed(() => {
      return this.gameStore.gameState()?.players ?? [];
    });
    selectedPolitico = computed( () => this.gameStore.selectedPolitico() );
    myPlayerID = computed( () => this.gameStore.me()?.playerID );
    
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

    canAnnounceAction(actionType : ActionType) : boolean {
      const allowedActions = this.gameStore.phase()?.possibleActionsByPhase ?? [];
      const controllerID = this.selectedPolitico()?.controllerPlayerID ?? null;

      if (this.gameStore.phaseStatus() !== PhaseExecutionStatus.OPEN_FOR_ACTIONS) {
          return false;
      }
      if (!this.selectedPolitico()) {
          return false;
      }
      if (!allowedActions.includes(actionType)) {
          return false;
      }

      switch(actionType) {
        case ActionType.DECLARE_INFLUENCE:
          if (!this.gameStore.hasAssignedInfluenceOnSelectedPolitico()) {
              return false;
          }
          return true;
        case ActionType.SEND_HOSPITAL:
          if (controllerID !== this.gameStore.me()?.playerID) {
              return false;
          }
          if (this.selectedPolitico()?.status !== GamePoliticoStatus.ACTIVE) {
              return false;
          }
          return true;
        case ActionType.EXIT_HOSPITAL:
          if (controllerID !== this.gameStore.me()?.playerID) {
              return false;
          }
          if (this.selectedPolitico()?.status !== GamePoliticoStatus.ACTIVE) {
              return false;
          }
          return true;
        case ActionType.PURGE_ATTEMPT:
          break;
        case ActionType.EXILE_ESCAPE:
          break;
        case ActionType.EXILE_RETURN:
          break;
        case ActionType.BEGIN_INVESTIGATION:
          break;
        case ActionType.REMOVE_INVESTIGATION:
          break;
        case ActionType.OPEN_TRIAL:
          break;
        case ActionType.CAST_TRIAL_VOTE:
          break;
        case ActionType.CONDEMNATION:
          break;
        case ActionType.NEGATE_CONDEMNATION:
          break;
      }
      return false;
    }

    openDeclareInfluenceModal() {
      const selectedPoliticoID = this.selectedPolitico()?.id;
      if (selectedPoliticoID) {
        this.gameStore.openDeclareInfluenceModal(selectedPoliticoID);
      }
    }

    openHospitalModal() {
      const selectedPoliticoID = this.selectedPolitico()?.id;
      if (selectedPoliticoID) {
        this.gameStore.openHospitalModal(selectedPoliticoID);
      }
    }

}

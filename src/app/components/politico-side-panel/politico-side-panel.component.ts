
import { Component, computed } from '@angular/core';
import { GameStoreService } from '../../services/game/store/game-store.service';
import { NgIf, NgForOf } from '@angular/common';
import { PhaseExecutionStatus } from '../../enum/phase-execution-status';
import { ActionType } from '../../enum/action-type';
import { GamePoliticoStatus } from '../../enum/game-politico-status';
import { MinistryType } from '../../enum/ministry-type';

@Component({
  selector: 'app-politico-side-panel',
  standalone: true,
  imports: [NgIf, NgForOf],
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
    ministries = computed(() => {
      return this.gameStore.gameState()?.ministries ?? [];
    });
    selectedPolitico = computed( () => this.gameStore.selectedPolitico() );
    selectedPoliticoMinistry = computed( () => {
      const politico = this.selectedPolitico();
      const ministries = this.ministries();
      if (!politico || politico.ministryID === null) {
        return null;
      }
      return ministries[politico.ministryID] ?? null;
    });
    myPlayerID = computed( () => this.gameStore.me()?.playerID );
    
    rawAuthorizedMinistryAndActions = computed(() => {
      const raw = this.gameStore.gameState()?.phase?.authorizedMinistryAndActions;

      if (!raw)
          return new Map<MinistryType, Set<ActionType>>();
      
      return new Map(
        Object.entries(raw).map(([ministry, actions]) => [
          ministry as MinistryType,
          new Set(actions as ActionType[])
        ])
      );
    });
    authorizedMinistryAndActions = computed(() => {
      const map = this.rawAuthorizedMinistryAndActions();
      const iterator = map.entries().next();
      return iterator.done ? null : {
          ministry : iterator.value[0],
          actions : iterator.value[1]
      };
    });
    
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
          if (controllerID !== this.gameStore.me()?.playerID) {
              return false;
          }
          if (this.selectedPolitico()?.ministryID === null) {
              return false;
          }

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

    openPurgeModal() {
      
    }

}

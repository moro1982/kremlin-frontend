import { Component, computed } from '@angular/core';
import { GameStoreService } from '../../services/game/store/game-store.service';
import { PolitburoPyramidComponent } from "../politburo-pyramid/politburo-pyramid.component";
import { PoliticoSidePanelComponent } from "../politico-side-panel/politico-side-panel.component";
import { NgFor, NgIf } from '@angular/common';
import { GameHeaderComponent } from "../game-header/game-header.component";
import { DeclareInfluenceModalComponent } from "../declare-influence-modal/declare-influence-modal.component";
import { UiModalType } from '../../enum/ui-modal-type';
import { PhaseControlComponent } from "../phase-control/phase-control.component";
import { HospitalModalComponent } from "../hospital-modal/hospital-modal.component";
import { ActionType } from '../../enum/action-type';
import { PhaseExecutionStatus } from '../../enum/phase-execution-status';
import { CancelModalComponent } from '../cancel-modal/cancel-modal.component';
import { PurgeModalComponent } from "../purge-modal/purge-modal.component";
import { ExileEscapeModalComponent } from "../exile-escape-modal/exile-escape-modal.component";
import { InvestigationModalComponent } from "../investigation-modal/investigation-modal.component";
import { CondemnationModalComponent } from "../condemnation-modal/condemnation-modal.component";
import { NegateCondemnationModalComponent } from "../negate-condemnation-modal/negate-condemnation-modal.component";

@Component({
  selector: 'app-board',
  standalone : true,
  imports: [
    NgIf,
    NgFor,
    PolitburoPyramidComponent,
    PoliticoSidePanelComponent,
    GameHeaderComponent,
    DeclareInfluenceModalComponent,
    PhaseControlComponent,
    HospitalModalComponent,
    CancelModalComponent,
    PurgeModalComponent,
    ExileEscapeModalComponent,
    InvestigationModalComponent,
    CondemnationModalComponent,
    NegateCondemnationModalComponent
],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

  constructor(public readonly gameStore : GameStoreService) { }

  UiModalType = UiModalType;
  ActionType = ActionType;
  Number = Number;

  gameState = computed(() => this.gameStore.gameState());

  politicos = computed(() => {
    return this.gameState()?.politicos ?? [];
  });
  players = computed(() => {
    return this.gameState()?.players ?? [];
  });

  myAssignedInfluences = computed(() => {
    const assignedInfluences = this.gameState()?.me.assignedInfluences ?? [];
    return Object.entries(assignedInfluences);
  });
  announcedActions = computed(() => {
    const actions = this.gameState()?.phase.announcedActions ?? [];
    return actions;
  });
  
  modalType = computed(() => {
    return this.gameStore.ui()?.modal?.type
  });
  modalPayload = computed(() => {
    return this.gameStore.ui()?.modal?.payload
  });

  onPoliticoSelected(politicoID : number) : void {
    this.gameStore.selectPolitico(politicoID);
  }
  onReadyClicked() {
    const gameID = this.gameStore.game()?.id;
    if (!gameID)
        return;
    this.gameStore.markPlayerReady(gameID).subscribe();
  }
  onBeginPhaseClicked() {
    const gameID = this.gameStore.game()?.id;
    if (!gameID)
        return;
    this.gameStore.beginPhase(gameID).subscribe();
  }
  onResolveAwaitingActionClicked() {
    const gameID = this.gameStore.game()?.id;
    if (!gameID)
        return;
    this.gameStore.resolveAwaitingAction(gameID).subscribe();
  }
  onResolveActionsClicked() {
    const gameID = this.gameStore.game()?.id;
    if (!gameID)
        return;
    this.gameStore.confirmPhaseExecution(gameID).subscribe();
  }

  // Should be in a future ActionComponent or similar.
  canCancelAction(actionID : number) : boolean {
    if (this.gameStore.phaseStatus() !== PhaseExecutionStatus.OPEN_FOR_ACTIONS) {
      return false;
    }
    if (this.announcedActions().length === 0) {
      return false;
    }
    const found = this.announcedActions()
                      .find( announcedAction => announcedAction.id === actionID );
    if (!found) return false;
    switch(found.type) {
      case ActionType.SEND_HOSPITAL:
        const controlledByMe = 
          this.gameStore.politicosControlledByMe()
                        .filter(p => p.id === found.targetPoliticoID);
        if (controlledByMe.length === 0) {
          return false;
        }
        break;
        // Different action types might have different cancellation rules 
        // (** to be implemented **)
      default:
        break;
    }
    return true;
  }

  openCancelActionModal(actionID : number) : void {
    this.gameStore.openCancelModal(actionID);
  }

}

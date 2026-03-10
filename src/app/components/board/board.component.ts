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
    HospitalModalComponent
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

  onResolveActionsClicked() {
    const gameID = this.gameStore.game()?.id;
    if (!gameID)
        return;
    this.gameStore.confirmPhaseExecution(gameID).subscribe();
  }

}

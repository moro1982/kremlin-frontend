import { Component } from '@angular/core';
import { GameStoreService } from '../../services/game/store/game-store.service';
import { PolitburoPyramidComponent } from "../politburo-pyramid/politburo-pyramid.component";
import { PoliticoSidePanelComponent } from "../politico-side-panel/politico-side-panel.component";
import { NgIf } from '@angular/common';
import { GameHeaderComponent } from "../game-header/game-header.component";
import { DeclareInfluenceModalComponent } from "../declare-influence-modal/declare-influence-modal.component";
import { UiModalType } from '../../enum/ui-modal-type';

@Component({
  selector: 'app-board',
  standalone : true,
  imports: [
    NgIf,
    PolitburoPyramidComponent,
    PoliticoSidePanelComponent,
    GameHeaderComponent,
    DeclareInfluenceModalComponent
],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

  constructor(public readonly gameStore : GameStoreService) { }

  UiModalType = UiModalType;

  onPoliticoSelected(politicoID : number) : void {
    this.gameStore.selectPolitico(politicoID);
  }

}

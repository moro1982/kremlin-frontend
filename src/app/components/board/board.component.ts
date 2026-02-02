import { Component } from '@angular/core';
import { GameStoreService } from '../../services/game/store/game-store.service';
import { PolitburoPyramidComponent } from "../politburo-pyramid/politburo-pyramid.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone : true,
  imports: [PolitburoPyramidComponent, NgIf],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

  constructor(public readonly gameStore : GameStoreService) { }

  onPoliticoSelected(politicoID : number) : void {
    this.gameStore.selectPolitico(politicoID);
  }

}

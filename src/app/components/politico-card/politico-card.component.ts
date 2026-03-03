import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GamePoliticoState } from '../../models/game-state/game-politico-state';
import { NgIf, NgForOf } from '@angular/common';
import { GameStoreService } from '../../services/game/store/game-store.service';

@Component({
  selector: 'app-politico-card',
  standalone : true,
  imports: [NgIf, NgForOf],
  templateUrl: './politico-card.component.html',
  styleUrl: './politico-card.component.scss'
})
export class PoliticoCardComponent {

    @Input() politico! : GamePoliticoState;
    @Input() declaredInfluences : { playerID : number, value : number }[] = [];
    @Input() playerColorMap! : Map<number, string>;;
    @Input() selected = false;

    @Output() selectedChange = new EventEmitter<number>();

    onClick() : void {
      this.selectedChange.emit(this.politico.id);
    }

    getPlayerColor(player_id : number | undefined) : string {
      
      if (player_id !== undefined) {
        const color = this.playerColorMap.get(player_id);
        if (color !== undefined) {
          return color;
        }
      }
      
      return '#666';
    }

}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GamePoliticoState } from '../../models/game-state/game-politico-state';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-politico-card',
  standalone : true,
  imports: [NgIf],
  templateUrl: './politico-card.component.html',
  styleUrl: './politico-card.component.scss'
})
export class PoliticoCardComponent {

    @Input() politico! : GamePoliticoState;
    @Input() selected = false;

    @Output() selectedChange = new EventEmitter<number>();

    onClick() : void {
      this.selectedChange.emit(this.politico.id);
    }

}

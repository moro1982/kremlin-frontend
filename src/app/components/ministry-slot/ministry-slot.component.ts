import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameMinistryState } from '../../models/game-state/game-ministry-state';
import { GamePoliticoState } from '../../models/game-state/game-politico-state';
import { PoliticoCardComponent } from "../politico-card/politico-card.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ministry-slot',
  standalone : true,
  imports: [PoliticoCardComponent, NgIf],
  templateUrl: './ministry-slot.component.html',
  styleUrl: './ministry-slot.component.scss'
})
export class MinistrySlotComponent {
    @Input() ministry!: GameMinistryState | undefined;
    @Input() politico!: GamePoliticoState | null;
    @Input() selectedPoliticoID!: number | null;

    @Output() politicoSelected = new EventEmitter<number>();

    onPoliticoSelected(politicoID : number) : void {
      this.politicoSelected.emit(politicoID);
    }
}

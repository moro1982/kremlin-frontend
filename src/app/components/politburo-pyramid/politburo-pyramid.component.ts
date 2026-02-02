import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameMinistryState } from '../../models/game-state/game-ministry-state';
import { GamePoliticoState } from '../../models/game-state/game-politico-state';
import { MinistrySlotComponent } from "../ministry-slot/ministry-slot.component";
import { MinistryType } from '../../enum/ministry-type';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-politburo-pyramid',
  standalone : true,
  imports: [MinistrySlotComponent, NgForOf],
  templateUrl: './politburo-pyramid.component.html',
  styleUrl: './politburo-pyramid.component.scss'
})
export class PolitburoPyramidComponent {

  @Input() ministries! : Record<number, GameMinistryState>;
  @Input() politicos! : Record<number, GamePoliticoState>;
  @Input() selectedPoliticoID! : number | null;

  @Output() politicoSelected = new EventEmitter<number>();

  topLvl : MinistryType[] = [
    MinistryType.PARTY_CHIEF
  ];
  firstLvl : MinistryType[] = [
    MinistryType.KGB_HERO,
    MinistryType.FOREIGN,
    MinistryType.DEFENSE
  ];
  secondLvl : MinistryType[] = [
    MinistryType.IDEOLOGY,
    MinistryType.INDUSTRY,
    MinistryType.ECONOMY,
    MinistryType.SPORTS
  ];
  candidates : MinistryType[] = [
    MinistryType.CANDIDATE,
    MinistryType.CANDIDATE,
    MinistryType.CANDIDATE,
    MinistryType.CANDIDATE,
    MinistryType.CANDIDATE
  ];
  people : MinistryType[] = [
    MinistryType.PEOPLE,
    MinistryType.PEOPLE,
    MinistryType.PEOPLE,
    MinistryType.PEOPLE
  ];

  onPoliticoSelected(politicoID : number) : void {
    this.politicoSelected.emit(politicoID);
  }

  getMinistry(type : MinistryType) : GameMinistryState | undefined {
    return Object.values(this.ministries).find(m => m.name === type);
  }

  getPoliticoForMinistry(type : MinistryType) : GamePoliticoState | null {
    const ministry = this.getMinistry(type);

    if (!ministry?.ministerID) return null;

    return this.politicos[ministry.ministerID] ?? null;
  }
}

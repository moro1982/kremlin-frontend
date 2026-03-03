import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
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
  @Input() playerColorMap! : Map<number, string>;
  @Input() declaredInfluencesByPolitico : Record<number, { playerID : number, value : number }[]> = {};
  @Input() selectedPoliticoID! : number | null;
  
  @Output() politicoSelected = new EventEmitter<number>();

  topLvl : GameMinistryState[] = [];
  firstLvl : GameMinistryState[] = [];
  secondLvl : GameMinistryState[] = [];
  candidateLvl : GameMinistryState[] = [];
  peopleLvl : GameMinistryState[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ministries'] && this.ministries) {
      this.buildLevels();
    }
  }

  private buildLevels(): void {

    const all = Object.values(this.ministries);

    this.topLvl = all.filter(m => m.name === MinistryType.PARTY_CHIEF);

    this.firstLvl = all.filter(m =>
      [MinistryType.KGB_HERO, MinistryType.FOREIGN, MinistryType.DEFENSE]
        .includes(m.name)
    );

    this.secondLvl = all.filter(m =>
      [MinistryType.IDEOLOGY, MinistryType.INDUSTRY, MinistryType.ECONOMY, MinistryType.SPORTS]
        .includes(m.name)
    );

    this.candidateLvl = all.filter(m => m.name === MinistryType.CANDIDATE);

    this.peopleLvl = all.filter(m => m.name === MinistryType.PEOPLE);
  }

  getPoliticoForMinistry(ministry : GameMinistryState) : GamePoliticoState | null {

    if (!ministry.ministerID) return null;

    return this.politicos[ministry.ministerID] ?? null;
  }

  getDeclaredInfluencesByMinister(ministry : GameMinistryState) 
      : { playerID : number, value : number }[]
  {
    const minister = this.getPoliticoForMinistry(ministry);
    if (minister != null) {
      const declaredInfluences = this.declaredInfluencesByPolitico[minister.id];
      return declaredInfluences;
    }

    return [];
  }

  onPoliticoSelected(politicoID : number) : void {
    this.politicoSelected.emit(politicoID);
  }
}

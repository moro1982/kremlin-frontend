
import { Component, OnInit } from '@angular/core';
import { AssignControlComponent } from '../assign-control/assign-control.component';
import { MinistryControlComponent } from '../ministry-control/ministry-control.component';

@Component({
  selector: 'app-controles',
  standalone: true,
  imports: [
    AssignControlComponent,
    MinistryControlComponent
  ],
  templateUrl: './controles.component.html',
  styleUrl: './controles.component.scss'
})
export class ControlesComponent {
  // players : Player[] = [];
  // ministerios : Ministry[] = [];
  // politicos : Politico[] = [];
  // politicosAssigned : Politico[] = [];

  // possibleValues : number[] = [];
  // playerAssign : Player = new Player;
  // politicoAssign : Politico = new Politico;
  // politicoDeclare : Politico = new Politico;
  // assignValue! : number;
  // assignRequest : InfluenceRequest = new InfluenceRequest;
  // assignConfirmation : InfluenceAssigned = new InfluenceAssigned;
  // declareRequest : InfluenceRequest = new InfluenceRequest;
  // declareConfirmation : InfluenceDeclared = new InfluenceDeclared;
  
  // ministerioObjetivo : Ministry = new Ministry;
  // ministerioOcupado : Ministry = new Ministry;
  // ministerioVaciado : Ministry = new Ministry;
  // ministroAsignado : Politico = new Politico;
  // ministroEliminado : Politico = new Politico;

  constructor(
    // private ministryService : MinistryService,
    // private politicoService : PoliticoService,
    // private playerService : PlayerService
  ){}

}

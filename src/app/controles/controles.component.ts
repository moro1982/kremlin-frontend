import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ministry } from '../models/ministry';
import { Politico } from '../models/politico';
import { MinistryService } from '../services/ministry.service';
import { PoliticoService } from '../services/politico.service';
import { InfluenceService } from '../services/influence.service';
import { PlayerService } from '../services/player.service';
import { Player } from '../models/player';
import { InfluenceAssigned } from '../models/influence-assigned';
import { InfluenceRequest } from '../models/influence-request';

@Component({
  selector: 'app-controles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './controles.component.html',
  styleUrl: './controles.component.scss'
})
export class ControlesComponent implements OnInit {
  players : Player[] = [];
  ministerios : Ministry[] = [];
  politicos : Politico[] = [];

  possibleValues : number[] = [];
  playerAssign : Player = new Player;
  politicoAssign : Politico = new Politico;
  assignValue! : number;
  assignRequest : InfluenceRequest = new InfluenceRequest;
  assignConfirmation : InfluenceAssigned = new InfluenceAssigned;
  
  ministerioObjetivo : Ministry = new Ministry;
  ministerioOcupado : Ministry = new Ministry;
  ministerioVaciado : Ministry = new Ministry;
  ministroAsignado : Politico = new Politico;
  ministroEliminado : Politico = new Politico;

  constructor(
    private ministryService : MinistryService,
    private politicoService : PoliticoService,
    private influenceService : InfluenceService,
    private playerService : PlayerService
  ){}

  ngOnInit(): void {
      this.ministryService.getMinisterios().subscribe( mins => {
        this.ministerios = mins;
      });
      this.politicoService.getPoliticos().subscribe( pols => {
        this.politicos = pols;
      });
      this.playerService.getAllPlayers().subscribe( players => {
        this.players = players;
      });
  }

  /* Métodos de Ministerios */

  assignMinister() {
    this.ministryService
      .assignMinister(this.ministerioObjetivo.id, this.ministroAsignado.id)
      .subscribe( min => {
        this.ministerioOcupado = min;
      });
  }

  removeMinister() {
    this.politicoService
      .getPoliticoByID(this.ministerioObjetivo.ministerId)
      .subscribe( pol => {
        this.ministroEliminado = pol;
      });
    this.ministryService
      .removeMinister(this.ministerioObjetivo.id)
      .subscribe( min => {
        this.ministerioVaciado = min;
      });
  }


  /* Métodos de Influencia */

  getPossibleValues(player : Player) {
    this.influenceService.getPossibleValues(player.id).subscribe( values => {
      this.possibleValues = values;
    });
    this.possibleValues.forEach(element => {
      console.log(element);
    });
  }

  assignInfluence() {
    this.assignRequest.playerId = this.playerAssign.id;
    this.assignRequest.politicoId = this.politicoAssign.id;
    this.assignRequest.points = this.assignValue;
    console.log(this.assignRequest);
    this.influenceService
          .assignInfluence(this.assignRequest)
          .subscribe( res => {
            this.assignConfirmation = res;
            console.log(this.assignConfirmation);
          });
  }

}

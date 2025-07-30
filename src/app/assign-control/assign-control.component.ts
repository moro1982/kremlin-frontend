import { Component, OnInit } from '@angular/core';
import { Player } from '../models/player';
import { CommonModule } from '@angular/common';
import { Politico } from '../models/politico';
import { InfluenceAssigned } from '../models/influence-assigned';
import { InfluenceRequest } from '../models/influence-request';
import { InfluenceService } from '../services/influence.service';
import { PlayerService } from '../services/player.service';
import { PoliticoService } from '../services/politico.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoliticoUtilsService } from '../services/politico-utils.service';

@Component({
  selector: 'app-assign-control',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './assign-control.component.html',
  styleUrl: './assign-control.component.scss'
})
export class AssignControlComponent implements OnInit {
  players : Player[] = [];
  politicos : Politico[] = [];
  possibleValues : number[] = [];
  playerAssign : Player = new Player;
  assignedPolIDs : number[] = [];
  assignedPolitico : Politico = new Politico;
  freePoliticos : Politico[] = [];
  assignedValue! : number;
  assignedRequest : InfluenceRequest = new InfluenceRequest;
  assignedSingle : InfluenceAssigned = new InfluenceAssigned;
  assignedMany : InfluenceAssigned[] = [];

  constructor(
    private playerService : PlayerService,
    private politicoService : PoliticoService,
    private influenceService : InfluenceService,
    private politicoUtils : PoliticoUtilsService
  ){}

  ngOnInit(): void {
      this.politicoService.getPoliticos().subscribe( pols => {
        this.politicos = pols;
      });
      this.playerService.getAllPlayers().subscribe( players => {
        this.players = players;
      });
  }

  // Se activa al seleccionar Jugador (en el prototipo).
  // Trae los valores que restan por asignar al Jugador y una tabla de Asignaciones del mismo.
  // Más adelante, buscaremos que se active cada vez que un Usuario con sesión activa
    // y Jugador elegido acceda al panel de asignación (para garantizar que esta información
    // sólo sea visible para dicho Jugador)
  getPlayerStatus(player : Player) {
    this.getPoliticosFreeForAssign(player);
    this.getPossibleAssignValues(player);
  }

  getPossibleAssignValues(player : Player) {
    this.influenceService.getPossibleAssignValues(player.id).subscribe( values => {
      this.possibleValues = values;
    });
  }

  getPoliticosFreeForAssign(player : Player) : void {
    this.influenceService
          .getAssignedByPlayer(player.id)
          .subscribe(res => {
              this.assignedMany = res;
              if (this.assignedMany.length == 0) {
                this.freePoliticos = this.politicos;
              } else {
                this.assignedPolIDs = this.assignedMany.map(assigned => assigned.politicoId);
                this.freePoliticos = this.politicos.filter(politico => !(this.assignedPolIDs.includes(politico.id)));
              }
            }
          );
  }

  assignInfluence() : void {
    this.assignedRequest.playerId = this.playerAssign.id;
    this.assignedRequest.politicoId = this.assignedPolitico.id;
    this.assignedRequest.points = this.assignedValue;
    this.influenceService
          .assignInfluence(this.assignedRequest)
          .subscribe( res => {
            this.assignedSingle = res;
          });
  }

  getPoliticoNameByID(id : number) : string {
    return this.politicoUtils.getPoliticoNameByID(id, this.politicos);
  }

}

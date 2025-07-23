import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfluenceService } from '../services/influence.service';
import { InfluenceDeclared } from '../models/influence-declared';
import { InfluenceAssigned } from '../models/influence-assigned';
import { Player } from '../models/player';
import { Politico } from '../models/politico';
import { InfluenceRequest } from '../models/influence-request';
import { PoliticoService } from '../services/politico.service';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-declare-control',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './declare-control.component.html',
  styleUrl: './declare-control.component.scss'
})
export class DeclareControlComponent {
  
  players: Player[] = [];
  playerDeclare: Player = new Player;
  politicos : Politico[] = [];
  assignedPolIDs : number[] = [];
  politicosAssigned : Politico[] = [];
  assignedByPlayer : InfluenceAssigned[] = [];
  possibleValues: number[] = [];
  declaredPolitico: Politico = new Politico;
  declaredValue!: number;
  declaredMany: InfluenceDeclared[] = [];
  declaredSingle: InfluenceDeclared = new InfluenceDeclared;
  declareRequest : InfluenceRequest = new InfluenceRequest;

  constructor(
    private playerService : PlayerService,
    private politicoService : PoliticoService,
    private influenceService : InfluenceService
  ){}

  ngOnInit(): void {
      this.politicoService.getPoliticos().subscribe( pols => {
        this.politicos = pols;
      });
      this.playerService.getAllPlayers().subscribe( players => {
        this.players = players;
      });
  }

  getAssignedByPlayer(player : Player) : void {
      this.influenceService
        .getAssignedByPlayer(player.id)
        .subscribe(res => {
          this.assignedByPlayer = res;
          this.assignedPolIDs = this.assignedByPlayer.map(assigned => assigned.politicoId);
          this.politicosAssigned = this.politicos.filter(politico => this.assignedPolIDs.includes(politico.id));
        });
  }

  getPossibleDeclareValues() : void {
    this.declareRequest.playerId = this.playerDeclare.id;
    this.declareRequest.politicoId = this.declaredPolitico.id;
    console.log(this.declareRequest);
    this.influenceService.getPossibleDeclareValues(this.declareRequest)
                         .subscribe(values => {
                            this.possibleValues = values;
                            console.log(this.possibleValues);
                         });
  }

  getDeclaredByPlayer(player : Player) : void {
    this.influenceService
          .getDeclaredByPlayer(player.id)
          .subscribe( res => {
            this.declaredMany = res;
          });
  }
  
  // Get Player data (Politicos assigned by Player)
  getPlayerStatus(player : Player) {
    // Get Player's Assigned
    this.getAssignedByPlayer(player);
    // Get Player's Declared
    this.getDeclaredByPlayer(player);
  }

  getPoliticoStatus(declaredPolitico : Politico) {
    this.getPossibleDeclareValues();
  }
  
  declareInfluence() : void {
    this.declareRequest.playerId = this.playerDeclare.id;
    this.declareRequest.politicoId = this.declaredPolitico.id;
    this.declareRequest.points = this.declaredValue;
    this.influenceService
          .declareInfluence(this.declareRequest)
          .subscribe( res => {
            this.declaredSingle = res;
          });
  }

}

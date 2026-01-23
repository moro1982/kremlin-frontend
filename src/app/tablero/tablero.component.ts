
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ministry } from '../models/ministry';
import { Politico } from '../models/politico';
import { Player } from '../models/player';
import { MinistryService } from '../services/ministry/ministry.service';
import { PoliticoService } from '../services/politico/politico.service';
import { PlayerService } from '../services/player/player.service';
import { ControlPoliticoService } from '../services/control_politico/control-politico.service';
import { MinistryStatus } from '../models/ministry-status';
import { firstValueFrom, forkJoin } from 'rxjs';

@Component({
  selector: 'app-tablero',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './tablero.component.html',
  styleUrl: './tablero.component.scss'
})
export class TableroComponent implements OnInit {
  ministerios : Ministry[] = [];
  politicos : Politico[] = [];
  jugadores : Player[] = [];
  initialMinisterIDs : number[] = [];
  statusList : MinistryStatus[] = [];
  allMinistryStatus : ( { ministry : Ministry } 
                      & { minister : Politico | null }
                      & { controller : Player | null }
                      )[] = [];
  posiciones = [
                'min1', 'min2', 'min3', 'min4', 'min5', 'min6',
                'min7', 'min8', 'min9', 'min10', 'min11', 'min12',
                'min13', 'min14', 'min15', 'min16', 'min17'
               ];

  constructor(
    private ministryService : MinistryService, 
    private politicoService : PoliticoService,
    private playerService : PlayerService,
    private controlService : ControlPoliticoService
  ){}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData() : void {
    forkJoin({
      mins : this.ministryService.getMinistries(),
      pols : this.politicoService.getPoliticos(),
      players : this.playerService.getAllPlayers(),
      allStatus : this.controlService.getAllMinistryStatus()
    })
    .subscribe( ({mins, pols, players, allStatus}) => {
      this.ministerios = mins;
      this.politicos = pols;
      this.jugadores = players;
      this.statusList = allStatus;

      this.allMinistryStatus = this.statusList.map( status => {
        const ministry = this.ministerios.find(m => m.id === status.ministryID)!;
        const minister = this.politicos.find(p => p.id === status.ministerID) || null;
        const controller = this.jugadores.find(j => j.id === status.controllerID) || null;
        
        return { ministry, minister, controller };
      });
    });
  }

  initialMinisterAssign() : void {
    this.ministryService.assignRandomMinisters().subscribe( ministries => {
      this.ministerios = ministries;
      console.log("Ministerios actualizados:\n", ministries);
    });
  }
  
  // getMinistries() {
  //   this.ministryService.getMinistries().subscribe( mins => {
  //     this.ministerios = mins;
  //   });
  // }

  // getPoliticos() {
  //   this.politicoService.getPoliticos().subscribe( pols => {
  //     this.politicos = pols;
  //   });
  // }

  // getPlayers() {
  //   this.playerService.getAllPlayers().subscribe( players => {
  //     this.jugadores = players;
  //   })
  // }

  // getAllMinistryStatus() {
  //   this.controlService.getAllMinistryStatus().subscribe( allStatus => {
  //     this.statusList = allStatus;
  //     this.allMinistryStatus = this.statusList.map( status => {
  //       const ministry = this.ministerios.find( m => m.id === status.ministryID )!;
  //       const minister = this.politicos.find( p => p.id === status.ministerID ) || null;
  //       const controller = this.jugadores.find( j => j.id === status.controllerID) || null;
  
  //       return {
  //         ministry,
  //         minister,
  //         controller
  //       };
  //     });
  //   });
  // }

}

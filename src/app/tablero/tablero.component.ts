
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ministry } from '../models/ministry';
import { MinistryService } from '../services/ministry.service';
import { Politico } from '../models/politico';
import { PoliticoService } from '../services/politico.service';
import { ControlPoliticoService } from '../services/control-politico.service';

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
  initialMinisterIDs : number[] = [];
  ministeriosConMinistro : (Ministry & { ministro: Politico })[] = [];
  posiciones = [
                'min1', 'min2', 'min3', 'min4', 'min5', 'min6',
                'min7', 'min8', 'min9', 'min10', 'min11', 'min12',
                'min13', 'min14', 'min15', 'min16', 'min17'
               ];

  constructor(
    private ministryService : MinistryService, 
    private politicoService : PoliticoService,
    private controlService : ControlPoliticoService
  ){}

  ngOnInit(): void {
    this.getMinistries();
    this.getPoliticos();
    this.getMinisteriosConMinistro();
  }
  
  getMinistries() {
    this.ministryService.getMinistries().subscribe( mins => {
      this.ministerios = mins;
    });
  }

  getPoliticos() {
    this.politicoService.getPoliticos().subscribe( pols => {
      this.politicos = pols;
    });
  }

  initialMinisterAssign() : void {
    this.ministryService.assignRandomMinisters().subscribe( ministries => {
      this.ministerios = ministries;
      console.log("Ministerios actualizados:\n", ministries);
    });
  }

  getMinisteriosConMinistro() {
    this.ministeriosConMinistro = this.ministerios.map( min => ({
      ...min,
      ministro : this.politicos.find(p => p.id === min.ministerId)!
    }));
  }

}

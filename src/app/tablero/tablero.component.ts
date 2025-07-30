
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ministry } from '../models/ministry';
import { MinistryService } from '../services/ministry.service';
import { Politico } from '../models/politico';
import { PoliticoService } from '../services/politico.service';

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
  ministeriosConMinistro: (Ministry & { ministro: Politico })[] = [];
  posiciones = [
                'min1', 'min2', 'min3', 'min4', 'min5', 'min6',
                'min7', 'min8', 'min9', 'min10', 'min11', 'min12',
                'min13', 'min14', 'min15', 'min16', 'min17'
               ];

  constructor(
    private ministryService : MinistryService, 
    private politicoService : PoliticoService
  ){}

  ngOnInit(): void {
    this.getMinisterios();
    this.getPoliticos();
    this.getMinisteriosConMinistro();
  }
  
  getMinisterios() {
    this.ministryService.getMinisterios().subscribe( mins => {
      this.ministerios = mins;
    });
  }

  getPoliticos() {
    this.politicoService.getPoliticos().subscribe( pols => {
      this.politicos = pols;
    });
  }

  getMinisteriosConMinistro() {
    this.ministeriosConMinistro = this.ministerios.map( min => ({
      ...min,
      ministro : this.politicos.find(p => p.id === min.ministerId)!
    }));
  }

}

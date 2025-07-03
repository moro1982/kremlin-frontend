import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ministry } from '../models/ministry';
import { Politico } from '../models/politico';
import { MinistryService } from '../services/ministry.service';
import { PoliticoService } from '../services/politico.service';
import { InfluenceService } from '../services/influence.service';

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
  ministerios : Ministry[] = [];
  politicos : Politico[] = [];
  politicoAsignar : Politico = new Politico;
  assignValue! : number;
  possibleValues : number[] = [];
  ministerioObjetivo : Ministry = new Ministry;
  ministerioOcupado : Ministry = new Ministry;
  ministerioVaciado : Ministry = new Ministry;
  ministroAsignado : Politico = new Politico;
  ministroEliminado : Politico = new Politico;

  constructor(
    private ministryService : MinistryService,
    private politicoService : PoliticoService,
    private influenceService : InfluenceService
  ){}

  ngOnInit(): void {
      this.ministryService.getMinisterios().subscribe( mins => {
        this.ministerios = mins;
      });
      this.politicoService.getPoliticos().subscribe( pols => {
        this.politicos = pols;
      });
  }

  asignarMinistro() {
    this.ministryService
      .asignarMinistro(this.ministerioObjetivo.id, this.ministroAsignado.id)
      .subscribe( min => {
        this.ministerioOcupado = min;
      });
  }

  quitarMinistro() {
    this.politicoService
      .getPoliticoByID(this.ministerioObjetivo.ministerId)
      .subscribe( pol => {
        this.ministroEliminado = pol;
      });
    this.ministryService
      .quitarMinistro(this.ministerioObjetivo.id)
      .subscribe( min => {
        this.ministerioVaciado = min;
      });
  }

  /* Métodos de Influencia */


}

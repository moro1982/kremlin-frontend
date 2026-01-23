import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Ministry } from '../models/ministry';
import { MinistryService } from '../services/ministry/ministry.service';
import { PoliticoService } from '../services/politico/politico.service';
import { FormsModule } from '@angular/forms';
import { Politico } from '../models/politico';

@Component({
  selector : 'app-ministry-control',
  standalone : true,
  imports : [
    CommonModule,
    FormsModule
  ],
  templateUrl : './ministry-control.component.html',
  styleUrl : './ministry-control.component.scss'
})
export class MinistryControlComponent implements OnInit {
  politicos : Politico[] = [];
  ministerios : Ministry[] = [];
  ministerioObjetivo : Ministry = new Ministry;
  ministerioOcupado : Ministry = new Ministry;
  ministerioVaciado : Ministry = new Ministry;
  ministroAsignado : Politico = new Politico;
  ministroEliminado : Politico = new Politico;

  constructor(
    private ministryService : MinistryService,
    private politicoService : PoliticoService
  ){};

  ngOnInit(): void {
    this.ministryService.getMinistries().subscribe( mins => {
      this.ministerios = mins;
    });
    this.politicoService.getPoliticos().subscribe( pols => {
      this.politicos = pols;
    });
  }

  loadMinistries() : void {
    this.ministryService.loadMinistries().subscribe(mins => {
      console.log(mins);
    })
  }

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

}

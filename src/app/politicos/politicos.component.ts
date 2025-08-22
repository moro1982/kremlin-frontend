
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Politico } from '../models/politico';
import { PoliticoService } from '../services/politico/politico.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-politicos',
  standalone: true,
  imports: [ 
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './politicos.component.html',
  styleUrl: './politicos.component.scss'
})
export class PoliticosComponent {
  politico : Politico = new Politico;
  politicos : Politico[] = [];
  idPolitico : FormControl<number> = new FormControl;
  datosPolitico : FormGroup = new FormGroup({
    // id: new FormControl<number | null>(null),)
    name: new FormControl<string>('', [Validators.required]),
    alias: new FormControl<string>('', [Validators.required]),
    age: new FormControl<number>(0, [Validators.required])
  });

  constructor(private politicoService : PoliticoService) {}

  getPoliticos() {
    this.politicoService.getPoliticos().subscribe( data => {
      this.politicos = data;
    });
  }

  getPoliticoByID() {
    this.politicoService.getPoliticoByID(this.idPolitico.value).subscribe( data => {
      this.politico = data;
    })
  }

  createSinglePolitico() : void {
    const nuevoPolitico : Politico = this.datosPolitico.getRawValue();
    this.politicoService.createSinglePolitico(nuevoPolitico).subscribe({
      next : res => console.log("Guardado con éxito: ", res),
      error : err => console.log("Error al guardar: ", err)
    });
  }

  loadPoliticos() : void {
    this.politicoService.loadPoliticos().subscribe(loaded => {
      console.log(loaded);
    });
  }

}

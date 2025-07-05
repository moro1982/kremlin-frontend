import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  
  players: any;
  playerDeclare: any;
  politicos: any;
  possibleValues: any;
  declaredPolitico: any;
  declaredValue: any;
  declaredMany: any;

  constructor(){}
  
  getPlayerStatus($event: Event) {
    throw new Error('Method not implemented.');
  }
  
  declareInfluence() {
    throw new Error('Method not implemented.');
  }

}

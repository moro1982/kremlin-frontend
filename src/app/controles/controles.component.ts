
import { Component, OnInit } from '@angular/core';
import { AssignControlComponent } from '../assign-control/assign-control.component';
import { MinistryControlComponent } from '../ministry-control/ministry-control.component';

@Component({
  selector: 'app-controles',
  standalone: true,
  imports: [
    AssignControlComponent,
    MinistryControlComponent
  ],
  templateUrl: './controles.component.html',
  styleUrl: './controles.component.scss'
})
export class ControlesComponent {

  constructor(){}

}

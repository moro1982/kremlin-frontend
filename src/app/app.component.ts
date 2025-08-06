import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PoliticosComponent } from './politicos/politicos.component';
import { ControlesComponent } from './controles/controles.component';
import { TableroComponent } from './tablero/tablero.component';
import { PlayerComponent } from "./player/player.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PoliticosComponent,
    ControlesComponent,
    TableroComponent,
    PlayerComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Kremlin';
}

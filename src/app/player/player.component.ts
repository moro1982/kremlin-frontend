import { Component, OnInit } from '@angular/core';
import { Player } from '../models/player';
import { PlayerRequest } from '../models/player-request';
import { PlayerService } from '../services/player.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent implements OnInit {
  datosPlayer : FormGroup = new FormGroup({
    name : new FormControl<string>('', [Validators.required]),
    faction : new FormControl<string>('', [Validators.required])
  });
  factions : string[] = [];

  constructor( private playerService : PlayerService ) {}

  ngOnInit(): void {
      this.getAllFactions();
  }

  createSinglePlayer() : void {
    const newPlayer : Player = this.datosPlayer.getRawValue();
    this.playerService.createSinglePlayer(newPlayer).subscribe(res => {
      console.log(res);
    });
  }

  getAllFactions() : void {
    this.playerService.getAllFactions().subscribe( res => {
      this.factions = res;
    })
  }

}

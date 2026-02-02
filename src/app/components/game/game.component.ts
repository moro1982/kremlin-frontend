import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game/game';
import { GameService } from '../../services/game/game.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {

  games : Game[] = [];

  constructor( private gameService : GameService ) { }

  ngOnInit(): void {
    this.getAllGames();
  }

  getAllGames() : void {
    this.gameService.getAllGames().subscribe( res => { 
      this.games = res;
    });
  }

  createNewGame() : void {
    this.gameService.createNewGame().subscribe( res => {
        this.getAllGames();
    });
  }

}

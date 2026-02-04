import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game/game';
import { GameService } from '../../services/game/game.service';
import { Router } from '@angular/router';
import { GameStoreService } from '../../services/game/store/game-store.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {

  games : Game[] = [];

  constructor( 
    private gameService : GameService,
    private gameStore : GameStoreService,
    private router : Router
  ) { }

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

  loadGame(gameID : number) : void {
     this.gameStore.loadGame(gameID);
  }

  openGame(gameID : number) : void {
    this.router.navigate(['/game', gameID]);
  }

}

import { NgForOf, NgIf } from '@angular/common';
import { Component, computed, effect, OnInit } from '@angular/core';
import { GameStoreService } from '../../services/game/store/game-store.service';
import { GameListItemComponent } from '../game-list-item/game-list-item.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-list',
  standalone : true,
  imports: [NgForOf, GameListItemComponent, NgIf, FormsModule],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss'
})
export class GameListComponent implements OnInit {

  constructor( 
    public readonly gameStore : GameStoreService,
    private router : Router
  )
  {
    // effect(() => {
    //     const state = this.gameStore.gameState();
    //     if (!state)
    //         return;

    //     this.gameStore.routeAfterGameLoad(state.game.id);
    // });
  }

  maxPlayers : number = 6;

  games = computed(() => this.gameStore.availableGames());

  ngOnInit(): void {
    this.gameStore.loadAvailableGames();
  }

  join(gameID : number) {
    this.router.navigate([`/game/${gameID}/join`]);
  }

  onResume(gameID : number) {
    this.gameStore.loadGame(gameID);
  }

  onCreate() {
    if (this.maxPlayers < 3 || this.maxPlayers > 6) {
      alert('The game must have 3 to 6 players.');
      return;
    }

    this.gameStore.createGame(this.maxPlayers)
                  .subscribe(() => {
                    this.gameStore.loadAvailableGames();
                  });
  }

  open(gameID : number) {
    this.router.navigate(['/game', gameID]);
  }

}

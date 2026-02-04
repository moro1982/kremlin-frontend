import { Component, OnInit } from '@angular/core';
import { BoardComponent } from '../board/board.component';
import { ActivatedRoute } from '@angular/router';
import { GameStoreService } from '../../services/game/store/game-store.service';

@Component({
  selector: 'app-game-page',
  standalone : true,
  imports: [BoardComponent],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss'
})
export class GamePageComponent implements OnInit {
  
  constructor(
    private route : ActivatedRoute,
    private gameStore : GameStoreService
  ) { }

  ngOnInit(): void {
    const gameID = Number(this.route.snapshot.paramMap.get('gameID'));
    if (gameID) {
      this.gameStore.loadGame(gameID);
    }
  }
}

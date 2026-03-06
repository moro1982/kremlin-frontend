import { Component, computed } from '@angular/core';
import { GameStoreService } from '../../services/game/store/game-store.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-game-header',
  standalone : true,
  imports: [NgIf],
  templateUrl: './game-header.component.html',
  styleUrl: './game-header.component.scss'
})
export class GameHeaderComponent {

  constructor(private readonly gameStore : GameStoreService) { }

  game = computed( () => this.gameStore.gameState()?.game );
  turn = computed( () => this.game()?.currentTurn );
  phase = computed( () => this.game()?.currentPhase );
  players = computed( () => this.gameStore.players() );
  myPlayerName = computed( () => {
    for (const [id, p] of Object.entries(this.players())) {
      if ( this.gameStore.me()?.playerID === Number(id) ) {
        return p.name;
      }
    }
    return null;
  });
  lifeCycleStatus = computed(() => this.gameStore.lifeCycleStatus());

}

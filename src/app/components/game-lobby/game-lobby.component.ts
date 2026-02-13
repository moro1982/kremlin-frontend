import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameStoreService } from '../../services/game/store/game-store.service';
import { NgFor, NgIf } from '@angular/common';
import { CurrentGameContext } from '../../models/current-game-context/current-game-context';
import { GameLifecycleStatus } from '../../enum/game-life-cycle-status';

@Component({
  selector: 'app-game-lobby',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './game-lobby.component.html',
  styleUrl: './game-lobby.component.scss'
})
export class GameLobbyComponent implements OnInit {

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private gameStore = inject(GameStoreService);

    gameID! : number;
    gameContext = this.gameStore.currentGameContext;
    gameLifecycleStatus = GameLifecycleStatus;

    ngOnInit(): void {
      this.gameID = Number(this.route.snapshot.paramMap.get('gameID'));
      if (!this.gameContext()) {
        this.gameStore.loadGameContext(this.gameID);
      }
    }

    toggleReady() {
      this.gameStore.toggleReady(this.gameID)
                    .subscribe({
                      next : () => this.gameStore.loadGameContext(this.gameID),
                      error : err => console.error("Toggle Ready failed.", err)
                    });
    }

    beginInfluenceAssignment() {
      this.gameStore
            .beginInfluenceAssignment(this.gameID)
            .subscribe({
              next : () => {
                // Backend -> startedAt != null
                // lifeCycleStatus -> INFLUENCE_ASSIGNMENT
                this.gameStore.loadGame(this.gameID);
                this.router.navigate([`/game/${this.gameID}/influence-assignment`]);
              },
              error : err => console.error("Begin influence assignment has failed.", err)
            });
    }

    leaveLobby() {
      this.gameStore.clearGame();
      this.gameStore.clearCurrentGameContext();
      this.gameStore.loadAvailableGames();
      this.router.navigate(['/game-list']);
    }

    canStart(context : CurrentGameContext) : boolean {
      return (
        context.lifeCycleStatus === this.gameLifecycleStatus.LOBBY &&
        context.players.length === context.maxPlayers &&
        context.players.every(p => p.ready)
      );
    }

}

import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameStoreService } from '../../services/game/store/game-store.service';
import { Faction } from '../../enum/faction';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-join',
  standalone: true,
  imports: [NgFor,FormsModule],
  templateUrl: './game-join.component.html',
  styleUrl: './game-join.component.scss'
})
export class GameJoinComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gameStore = inject(GameStoreService);

  gameID! : number;

  name : string = '';

  faction! : Faction;

  factions = Object.keys(Faction);

  ngOnInit(): void {
    this.gameID = Number(this.route.snapshot.paramMap.get('gameID'));
  }

  canSubmit() : boolean {
    return !!this.name && !!this.faction;
  }

  submit() {
    const payload = {
      name : this.name,
      faction : this.faction,
      gameID : this.gameID
    };

    this.gameStore.joinGame(this.gameID, payload)
                  .subscribe({
                    next : () => {
                      this.router.navigate([`/game/${this.gameID}/lobby`]);
                    },
                    error : err => console.error("Join Game failed.", err)
                  });
  }

  cancel() {
    this.router.navigate(['/game-list']);
  }

}

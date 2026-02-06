import { DatePipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameSummary } from '../../models/game-summary/game-summary';

@Component({
  selector: 'app-game-list-item',
  standalone : true,
  imports: [NgIf, DatePipe],
  templateUrl: './game-list-item.component.html',
  styleUrl: './game-list-item.component.scss'
})
export class GameListItemComponent {

  @Input({ required : true })
  game! : GameSummary;
  
  @Output()
  join = new EventEmitter<number>();

  @Output()
  resume = new EventEmitter<number>();

  onJoin() {
    this.join.emit(this.game.id);
  }

  onResume() {
    this.resume.emit(this.game.id);
  }

}

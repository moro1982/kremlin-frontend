import { Component } from '@angular/core';
import { GameStoreService } from '../../services/game/store/game-store.service';

@Component({
  selector: 'app-purge-modal',
  standalone: true,
  imports: [],
  templateUrl: './purge-modal.component.html',
  styleUrl: './purge-modal.component.scss'
})
export class PurgeModalComponent {
    
  constructor(private gameStore : GameStoreService) { }

  confirm() {

  }

  close() {
    
  }
}

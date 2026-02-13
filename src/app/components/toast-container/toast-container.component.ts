import { NgClass, NgFor } from '@angular/common';
import { Component, computed } from '@angular/core';
import { GameStoreService } from '../../services/game/store/game-store.service';

@Component({
  selector: 'app-toast-container',
  standalone : true,
  imports: [NgFor, NgClass],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss'
})
export class ToastContainerComponent {

    constructor(private gameStore : GameStoreService) { }

    notifications = computed(() => 
      this.gameStore.gameState()?.ui.notifications ?? []
    );

}

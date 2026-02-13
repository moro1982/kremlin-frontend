import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameStoreService } from '../../services/game/store/game-store.service';

@Component({
  selector: 'app-declare-influence-modal',
  standalone : true,
  imports: [FormsModule],
  templateUrl: './declare-influence-modal.component.html',
  styleUrl: './declare-influence-modal.component.scss'
})
export class DeclareInfluenceModalComponent {

  constructor(private gameStore : GameStoreService) { }

  value = 1;

  confirm() {
    this.gameStore.declareInfluence(this.value);
  }

  close() {
    this.gameStore.closeModal();
  }
}

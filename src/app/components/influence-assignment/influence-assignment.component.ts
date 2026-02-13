import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { GameStoreService } from '../../services/game/store/game-store.service';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-influence-assignment',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './influence-assignment.component.html',
  styleUrl: './influence-assignment.component.scss'
})
export class InfluenceAssignmentComponent implements OnInit {
    
    private store = inject(GameStoreService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    constructor(
      // public readonly store : GameStoreService,
      // private router : Router
    ) {
      effect(() => {
        const finished = this.store.influenceAssignmentFinished();
        const gameID = this.store.game()?.id;
        
        if (!finished || !gameID) 
            return;
        
        this.router.navigate(['/game', gameID]);
      });
    }

    ngOnInit(): void {
      const gameID = Number(this.route.snapshot.paramMap.get('gameID'));
      if (gameID) {
        this.store.loadGame(gameID);
      }
    }

    context = this.store.influenceAssignmentContext;
    assigned = computed( () => this.context()?.assigned ?? {} );
    
    usedValues = computed( () => Object.values(this.assigned()) );
    remainingValues = computed( () => 
      [1,2,3,4,5,6,7,8,9,10].filter( v => !this.usedValues().includes(v) )
    );

    isComplete = computed( () => Object.keys(this.assigned()).length === 10 );
    
    Object = Object;


    assignInfluence(politicoID : number, value : number) {
      this.store.assignInfluence(politicoID, value);
    }
    
    unassignInfluence(politicoID : number) {
      this.store.assignInfluence(politicoID, null);
    }

    confirmInfluenceAssignment() {
      if (!this.isComplete())
          return;
      this.store.confirmInfluenceAssignment();
    }
}

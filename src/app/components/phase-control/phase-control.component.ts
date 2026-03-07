import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common'
import { PhaseExecutionStatus } from '../../enum/phase-execution-status';
import { PlayerState } from '../../models/game-state/player-state';


@Component({
  selector: 'app-phase-control',
  imports: [NgIf],
  templateUrl: './phase-control.component.html',
  styleUrl: './phase-control.component.scss'
})
export class PhaseControlComponent {

  PhaseExecutionStatus = PhaseExecutionStatus;

  @Input() gameID? : number;
  @Input() phaseStatus? : PhaseExecutionStatus;
  @Input() players! : Record<number, PlayerState>;
  @Input() readyPlayers : [string, PlayerState][] = [];
  @Input() iAmReady! : boolean;
  @Input() allPlayersReady! : boolean;

  @Output() readyClicked = new EventEmitter<void>();
  @Output() beginPhaseClicked = new EventEmitter<void>();
  @Output() resolveActionsClicked = new EventEmitter<void>();

  readyCount = computed( () => this.readyPlayers.length ?? 0);
  totalPlayers = computed( () => Object.entries(this.players).length );

  isWaitingToBegin() : boolean {
    return this.phaseStatus === PhaseExecutionStatus.WAITING_TO_BEGIN;
  }

  isOpenForActions() : boolean {
    return this.phaseStatus === PhaseExecutionStatus.OPEN_FOR_ACTIONS;
  }

  isResolving() : boolean {
    return this.phaseStatus === PhaseExecutionStatus.RESOLVING_ACTIONS;
  }

  canBeginPhase() : boolean {
    return this.allPlayersReady && this.isWaitingToBegin();
  }

  canResolveActions() : boolean {
    return this.allPlayersReady && this.isOpenForActions(); 
  }

  onReadyClick() {
    this.readyClicked.emit();
  }
  onBeginPhaseClick() {
    this.beginPhaseClicked.emit();
  }
  onResolveActionsClick() {
    this.resolveActionsClicked.emit();
  }

}

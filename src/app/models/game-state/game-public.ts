import { GameLifecycleStatus } from "../../enum/game-life-cycle-status";
import { PhaseExecutionStatus } from "../../enum/phase-execution-status";
import { PhaseType } from "../../enum/phase-type";

export interface GamePublic {
    id : number;
    createdAt: Date;
    startedAt: Date | null;
    currentTurn : number;
    currentPhase : PhaseType | null;
    finished : boolean;
    lifeCycleStatus : GameLifecycleStatus;
    version : number;
    updateCounter : number;
}

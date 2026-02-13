import { PhaseType } from "../../enum/phase-type";

export interface GamePublic {
    id : number;
    createdAt: Date;
    startedAt: Date | null;
    version : number;
    updateCounter : number;
    finished : boolean;
    currentTurn : number;
    currentPhase : PhaseType | null;
}

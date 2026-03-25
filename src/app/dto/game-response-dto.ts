import { ActionBlockingStatus } from "../enum/action-blocking-status";
import { ActionType } from "../enum/action-type";
import { GameLifecycleStatus } from "../enum/game-life-cycle-status";
import { MinistryType } from "../enum/ministry-type";
import { PhaseExecutionStatus } from "../enum/phase-execution-status";
import { PhaseType } from "../enum/phase-type";
import { ActionInstanceDto } from "./action-instance-dto";
import { GameMinistryResponseDto } from "./game-ministry-response-dto";
import { GamePoliticoResponseDto } from "./game-politico-response-dto";
import { PlayerResponseDto } from "./player-response-dto";
import { TrialResponseDto } from "./trial-response-dto";

export interface GameResponseDto {
    id: number;
    createdAt : string;
    startedAt: string;
    currentTurn: number;
    currentPhase: PhaseType;
    phaseStatus : PhaseExecutionStatus;
    finished: boolean;
    lifeCycleStatus: GameLifecycleStatus;
    
    version: number;
    updateCounter : number;
    
    players: PlayerResponseDto[];
    gamePoliticos: GamePoliticoResponseDto[];
    gameMinistries: GameMinistryResponseDto[];
    readyPlayers : number[];
    
    blockingStatus: ActionBlockingStatus;
    currentAwaitingAction?: ActionInstanceDto;
    announcedActions : ActionInstanceDto[];
    possibleActionsByPhase : ActionType[];
    authorizedMinistry: Map<ActionType, MinistryType>;

    trial : TrialResponseDto;

    myPlayerID : number;
}

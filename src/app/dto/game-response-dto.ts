import { ActionBlockingStatus } from "../enum/action-blocking-status";
import { PhaseType } from "../enum/phase-type";
import { ActionInstanceDto } from "./action-instance-dto";
import { GameMinistryResponseDto } from "./game-ministry-response-dto";
import { GamePoliticoResponseDto } from "./game-politico-response-dto";
import { PlayerResponseDto } from "./player-response-dto";
import { TrialResponseDto } from "./trial-response-dto";

export interface GameResponseDto {
    id: number;
    createdAt : string;
    currentTurn: number;
    currentPhase: PhaseType;
    finished: boolean;
    
    version: number;
    updateCounter : number;
    
    players: PlayerResponseDto[];
    gamePoliticos: GamePoliticoResponseDto[];
    gameMinistries: GameMinistryResponseDto[];
    readyPlayers : number[];
    
    blockingStatus: ActionBlockingStatus;
    currentAwaitingAction?: ActionInstanceDto;
    announcedActions : ActionInstanceDto[];

    trial : TrialResponseDto;

    myPlayerID : number;
}

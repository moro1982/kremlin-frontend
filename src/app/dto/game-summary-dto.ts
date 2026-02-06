import { GameLifecycleStatus } from "../enum/game-life-cycle-status";

export interface GameSummaryDto {
    id : number;

    lifeCycleStatus : GameLifecycleStatus;

    playerCount : number;
    maxPlayers : number;

    iAmParticipant : boolean;
    joinable : boolean;
    resumable : boolean;

    createdAt : Date;
    startedAt : Date;
}

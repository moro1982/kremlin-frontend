import { GameLifecycleStatus } from "../../enum/game-life-cycle-status";

export interface GameSummary {

    id : number;

    // Game's global status
    lifeCycleStatus : GameLifecycleStatus;

    // Players
    playerCount : number;
    maxPlayers : number;

    // Relation to current user
    iAmParticipant : boolean;
    joinable : boolean;     // can I join this Game?
    resumable : boolean;    // can I resume? (I already participate)

    // Metadata (for UI)
    createdAt : Date;
    startedAt : Date;

}

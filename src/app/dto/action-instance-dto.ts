import { ActionStatus } from "../enum/action-status";
import { ActionType } from "../enum/action-type";
import { PhaseType } from "../enum/phase-type";
import { TrialVoteValue } from "../enum/trial-vote-value";

export interface ActionInstanceDto {
    id : number;
    gameID : number;
    actorID : number;
    type : ActionType;
    status : ActionStatus;
    createdAt : string;
    turn : number;
    phase : PhaseType;
    priority : number;
    resolved : boolean;
    targetGamePoliticoID : number;
    influencePoints : number;
    trialID : number;
    trialVoteValue : TrialVoteValue;
    targetGameMinistryID : number;
    actingGamePoliticoID : number;
}

import { TrialVoteValue } from "../enum/trial-vote-value";

export interface TrialVoteDto {
    voterGamePoliticoID : number;
    vote : TrialVoteValue;
    cancelled : boolean;
}

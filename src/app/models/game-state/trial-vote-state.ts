import { TrialVoteValue } from "../../enum/trial-vote-value";

export interface TrialVoteState {
    vote : TrialVoteValue;
    cancelled : boolean;
}

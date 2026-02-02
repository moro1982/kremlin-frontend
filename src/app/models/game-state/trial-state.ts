import { TrialResult } from "../../enum/trial-result";
import { TrialStatus } from "../../enum/trial-status";
import { TrialVoteState } from "./trial-vote-state";

export interface TrialState {
    id : number;
    status : TrialStatus;
    result : TrialResult | null;

    accusedGamePoliticoID : number;
    prosecutorGamePoliticoID : number;

    votes : Record<number, TrialVoteState>; // gamePoliticoID -> vote
    allVotesCast : boolean;
}

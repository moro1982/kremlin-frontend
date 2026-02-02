import { TrialResult } from "../enum/trial-result";
import { TrialStatus } from "../enum/trial-status";
import { TrialVoteDto } from "./trial-vote-dto";

export interface TrialResponseDto {
    id : number;
    status : TrialStatus;
    result : TrialResult;
    accusedGamePoliticoID : number;
    prosecutorGamePoliticoID : number;
    turn : number;
    votes : TrialVoteDto[];
    allVotesCast : boolean;
}

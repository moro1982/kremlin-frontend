import { GamePoliticoStatus } from "../../enum/game-politico-status";
import { MinistryType } from "../../enum/ministry-type";
import { InvestigationState } from "./investigation-state";

export interface GamePoliticoState {
    id : number;
    name : string;
    alias : string;
    advantage : MinistryType;
    disadvantage : MinistryType;
    age : number;
    damage : number;
    status : GamePoliticoStatus;
    ministryID : number | null;
    controllerPlayerID? : number;
    investigations : InvestigationState;
}

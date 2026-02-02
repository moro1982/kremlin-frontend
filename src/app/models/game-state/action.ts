import { ActionStatus } from "../../enum/action-status";
import { ActionType } from "../../enum/action-type";

export interface Action {
    id : number;
    type : ActionType;
    status : ActionStatus;
    actorPlayerID : number;
    targetPoliticoID? : number;
    actingPoliticoID? : number;
}

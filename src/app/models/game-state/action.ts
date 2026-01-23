import { ActionStatus } from "../../enums/action-status";
import { ActionType } from "../../enums/action-type";

export interface Action {
    id : number;
    type : ActionType;
    status : ActionStatus;
    actorPlayerID : number;
    targetPoliticoID? : number;
}

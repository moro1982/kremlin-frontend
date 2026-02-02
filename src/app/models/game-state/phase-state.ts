import { ActionBlockingStatus } from "../../enum/action-blocking-status";
import { Action } from "./action";

export interface PhaseState {
    blockingStatus : ActionBlockingStatus;
    awaitingAction : Action | null;
    announcedActions : Action[];
}

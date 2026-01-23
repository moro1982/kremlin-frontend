import { ActionBlockingStatus } from "../../enums/action-blocking-status";

export interface PhaseState {
    blockingStatus : ActionBlockingStatus;
    awaitingAction : number | null;
}

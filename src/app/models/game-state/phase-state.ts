import { ActionBlockingStatus } from "../../enum/action-blocking-status";
import { ActionType } from "../../enum/action-type";
import { PhaseExecutionStatus } from "../../enum/phase-execution-status";
import { Action } from "./action";

export interface PhaseState {
    phaseStatus : PhaseExecutionStatus;
    blockingStatus : ActionBlockingStatus;
    awaitingAction : Action | null;
    announcedActions : Action[];
    possibleActionsByPhase : ActionType[];
}

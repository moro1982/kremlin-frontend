import { ActionBlockingStatus } from "../../enum/action-blocking-status";
import { GameLifecycleStatus } from "../../enum/game-life-cycle-status";
import { PhaseExecutionStatus } from "../../enum/phase-execution-status";
import { GameState } from "./game-state";

export const initialGameState : GameState = {
    game : {
        id : 0,
        createdAt : new Date(0),
        startedAt : new Date(0),
        currentTurn : 0,
        currentPhase : null,
        finished : false,
        lifeCycleStatus : GameLifecycleStatus.NONE,
        version : 0,
        updateCounter : 0,
    },
    
    phase : {
        phaseStatus : PhaseExecutionStatus.NONE,
        blockingStatus : ActionBlockingStatus.NONE,
        awaitingAction : null,
        announcedActions : [],
        possibleActionsByPhase : [],
        authorizedMinistryAndActions : null
    },

    players : {},
    politicos : {},
    ministries : {},
    
    me : {
        playerID : 0,
        faction : '',
        assignedInfluences : {},
        canAnnounceAction : false,
        canRespondAction : false
    },

    ui : {
        loading : false,
        modal : {
            type : null,
            payload : undefined
        },
        notifications : [],
        selectedPoliticoID : null,
        selectedMinistryID : null,
        selectedActionType : null
    },

    trial : undefined,
    lastUpdateReason : undefined
};

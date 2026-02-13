import { ActionBlockingStatus } from "../../enum/action-blocking-status";
import { GameState } from "./game-state";

export const initialGameState : GameState = {
    game : {
        id : 0,
        createdAt : new Date(0),
        startedAt : new Date(0),
        version : 0,
        updateCounter : 0,
        finished : false,
        currentTurn : 0,
        currentPhase : null
    },
    
    phase : {
        blockingStatus : ActionBlockingStatus.NONE,
        awaitingAction : null,
        announcedActions : []
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

import { Action } from "./action";
import { GamePublic } from "./game-public";
import { MyPlayerState } from "./my-player-state";
import { PhaseState } from "./phase-state";

export interface GameState {

    game : GamePublic;
    phase : PhaseState;
    actions : {
        awaiting? : Action;
        lastResolved? : Action;
    };
    me : MyPlayerState;
    
}

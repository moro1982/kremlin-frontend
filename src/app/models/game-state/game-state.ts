
import { GameMinistryState } from "./game-ministry-state";
import { GamePoliticoState } from "./game-politico-state";
import { GamePublic } from "./game-public";
import { GameUiState } from "./game-ui-state";
import { MyPlayerState } from "./my-player-state";
import { PhaseState } from "./phase-state";
import { PlayerState } from "./player-state";
import { TrialState } from "./trial-state";

export interface GameState {
    
    game : GamePublic;
    phase : PhaseState;

    players : Record<number, PlayerState>;
    politicos: Record<number, GamePoliticoState>;
    ministries: Record<number, GameMinistryState>;

    me : MyPlayerState;

    ui: GameUiState;    // <-- frontend only

    /* TrialState */
    trial? : TrialState;

    // Metadata
    lastUpdateReason?: string;
}

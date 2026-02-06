import { LobbyPlayerDto } from "../../dto/lobby-player-dto";
import { GameLifecycleStatus } from "../../enum/game-life-cycle-status";
import { GameStatus } from "../../enum/game-status";
import { GameState } from "../game-state/game-state";

export interface CurrentGameContext {
    
    gameID : number;

    lifeCycleStatus : GameLifecycleStatus;
    status : GameStatus;

    maxPlayers : number;

    players : LobbyPlayerDto[];

    gameState?: GameState;
}

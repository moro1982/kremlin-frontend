import { GameLifecycleStatus } from "../enum/game-life-cycle-status";
import { GameStatus } from "../enum/game-status";
import { LobbyPlayerDto } from "./lobby-player-dto";

export interface GameContextDto {
    gameID : number;
    lifeCycleStatus : GameLifecycleStatus;
    status : GameStatus;
    maxPlayers : number;
    players : LobbyPlayerDto[];
}

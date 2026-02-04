import { GamePoliticoStatus } from "../enum/game-politico-status";
import { PoliticoResponseDto } from "./politico-response-dto";

export interface GamePoliticoResponseDto {
    id : number;
    politicoDTO : PoliticoResponseDto;
    gameID : number;
    gameMinistryID : number;
    currentAge : number;
    damage : number;
    investigationCount : number;
    investigationCountAtPhaseStart : number;
    immuneToInvestigationsUntilTurn : number;
    status : GamePoliticoStatus;
    controllerPlayerID : number;
}

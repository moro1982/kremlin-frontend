import { Faction } from "../enum/faction";

export interface PlayerResponseDto {
    id : number;
    name : string;
    faction : Faction;
    userID : number;
    gameID : number;
    ready : boolean;
    assignedInfluences : Record<number, number>;
    declaredInfluences : Record<number, number>;
    controlledPoliticosIDs : number[];
}

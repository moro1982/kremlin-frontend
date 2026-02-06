import { Faction } from "../enum/faction";

export interface LobbyPlayerDto {
    playerID : number;
    userID : number;

    name : string;
    faction? : Faction;

    ready : boolean;
}

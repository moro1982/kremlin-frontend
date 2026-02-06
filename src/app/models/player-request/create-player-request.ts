import { Faction } from "../../enum/faction";

export interface CreatePlayerRequest {
    name: string;
    faction: Faction;
    gameID : number;
}

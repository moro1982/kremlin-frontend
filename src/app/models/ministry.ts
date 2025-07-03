
import { Action } from "./action";
import { Politico } from "./politico";

export class Ministry {
    
    id! : number;
    name! : string;
    isVacant! : boolean;
    purgeNr! : number;
    ministerId! : number;
    actions! : Set<number>;

    constructor(){}

}

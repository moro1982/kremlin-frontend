
import { Ministry } from "./ministry";

export class Action {
    
    id? : number;
    name! : string;
    description! : string;
    ministerios! : Set<number>;

    constructor(){}

}

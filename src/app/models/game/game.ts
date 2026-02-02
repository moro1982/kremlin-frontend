import { ActionBlockingStatus } from "../../enum/action-blocking-status";

export class Game {
    id! : number;
    createdAt! : Date;
    turn! : number;
    phase! : number;
    finished! : boolean;
    version! : number;
    updateCounter! : number;
    blockingStatus! : ActionBlockingStatus;
    players : number[] = [];
    politicos : number[] = [];
    readyPlayers : number[] = [];
    awaitingAction? : number;
}

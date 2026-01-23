
export class Player {
    id! : number;
    name! : string;
    faction! : string;
    assigned! : Set<number>;
    declared! : Set<number>;
}

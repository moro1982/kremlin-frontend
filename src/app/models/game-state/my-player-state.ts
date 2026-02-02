
export interface MyPlayerState {
    
    playerID : number;
    faction : string;

    // Private information
    assignedInfluences : Record<number, number>; // politicoID -> value

    // Flags for UI
    canAnnounceAction : boolean;
    canRespondAction : boolean;
}

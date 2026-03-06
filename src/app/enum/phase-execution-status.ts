export enum PhaseExecutionStatus {
    NONE = 'NONE',                              // Game not started yet.
    WAITING_TO_BEGIN = 'WAITING_TO_BEGIN',      // Awaiting players to mark "ready".
    OPEN_FOR_ACTIONS = 'OPEN_FOR_ACTIONS',      // Awaiting players to declare actions and mark "ready".
    RESOLVING_ACTIONS = 'RESOLVING_ACTIONS',    // Resolving pending actions.
    FINISHED = 'FINISHED'                       // Phase ended.
}

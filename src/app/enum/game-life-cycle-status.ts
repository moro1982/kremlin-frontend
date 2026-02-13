export enum GameLifecycleStatus {
  NONE = 'NONE',                                      // No game loaded
  LOBBY = 'LOBBY',                                    // Game created, awaiting players
  INFLUENCE_ASSIGNMENT = 'INFLUENCE_ASSIGNMENT',      // Turn 0
  RUNNING = 'RUNNING',                                // Turn 1+
  FINISHED = 'FINISHED'                               // Game finished
}

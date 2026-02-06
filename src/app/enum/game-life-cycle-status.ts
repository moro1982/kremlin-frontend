export enum GameLifecycleStatus {
  NONE,                     // No game loaded
  LOBBY,                    // Game created, awaiting players
  INFLUENCE_ASSIGNMENT,     // Turn 0
  RUNNING,                  // Turn 1+
  FINISHED                  // Game finished
}

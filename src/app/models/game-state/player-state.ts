export interface PlayerState {
  
  id : number;        // -> playerID
  userID : number;    // -> userID
  name : string;

  ready : boolean;

  factionColor? : string;

  // PUBLIC
  declaredInfluences : Record<number, number>;

  // SECRET (only shows values if isMe === true)
  assignedInfluences? : Record<number, number>;

  controlledPoliticos : number[]; // GamePolitico IDs

  // if id === game.me.playerID
  isMe : boolean;
}

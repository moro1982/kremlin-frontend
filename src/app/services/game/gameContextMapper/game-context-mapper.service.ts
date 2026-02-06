import { Injectable } from '@angular/core';
import { GameContextDto } from '../../../dto/game-context-dto';
import { CurrentGameContext } from '../../../models/current-game-context/current-game-context';

@Injectable({
  providedIn: 'root'
})
export class GameContextMapperService {

  static fromDTO(dto : GameContextDto) : CurrentGameContext {
    return {
      gameID : dto.gameID,
      lifeCycleStatus : dto.lifeCycleStatus,
      status : dto.status,
      maxPlayers : dto.maxPlayers,
      players : dto.players.map( p => ({
        playerID : p.playerID,
        userID : p.userID,
        name : p.name,
        faction : p.faction,
        ready : p.ready
      })),
      gameState : undefined
    };
  }
}

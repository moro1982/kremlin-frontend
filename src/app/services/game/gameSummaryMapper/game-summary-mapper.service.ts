import { Injectable } from '@angular/core';
import { GameSummaryDto } from '../../../dto/game-summary-dto';
import { GameSummary } from '../../../models/game-summary/game-summary';

@Injectable({
  providedIn: 'root'
})
export class GameSummaryMapperService {

  static fromDTO(dto : GameSummaryDto) : GameSummary {
    return {
      id : dto.id,
      lifeCycleStatus : dto.lifeCycleStatus,
      playerCount : dto.playerCount,
      maxPlayers : dto.maxPlayers,
      iAmParticipant : dto.iAmParticipant,
      joinable : dto.joinable,
      resumable : dto.resumable,
      createdAt : dto.createdAt,
      startedAt : dto.startedAt
    };
  }

}

import { Injectable } from '@angular/core';
import { GameState } from '../../../models/game-state/game-state';
import { GameResponseDto } from '../../../dto/game-response-dto';
import { ActionInstanceDto } from '../../../dto/action-instance-dto';
import { Action } from '../../../models/game-state/action';
import { PlayerResponseDto } from '../../../dto/player-response-dto';
import { PlayerState } from '../../../models/game-state/player-state';
import { PhaseState } from '../../../models/game-state/phase-state';
import { MyPlayerState } from '../../../models/game-state/my-player-state';
import { GamePoliticoResponseDto } from '../../../dto/game-politico-response-dto';
import { GamePoliticoState } from '../../../models/game-state/game-politico-state';
import { InvestigationState } from '../../../models/game-state/investigation-state';
import { GameMinistryResponseDto } from '../../../dto/game-ministry-response-dto';
import { GameMinistryState } from '../../../models/game-state/game-ministry-state';
import { ActionBlockingStatus } from '../../../enum/action-blocking-status';
import { GameUiState } from '../../../models/game-state/game-ui-state';
import { TrialResponseDto } from '../../../dto/trial-response-dto';
import { TrialState } from '../../../models/game-state/trial-state';
import { PhaseExecutionStatus } from '../../../enum/phase-execution-status';

@Injectable({
  providedIn: 'root'
})
export class GameStateMapperService {
  
  constructor() { }

  static fromDTO( dto : GameResponseDto ) : GameState {

    const players = GameStateMapperService.mapPlayers(dto.players, dto.myPlayerID);
    
    const phase : PhaseState = {
      phaseStatus : dto.phaseStatus,
      blockingStatus : dto.blockingStatus,
      awaitingAction : dto.awaitingAction
        ? GameStateMapperService.mapAction(dto.awaitingAction)
        : null,
      announcedActions : dto.announcedActions.map(GameStateMapperService.mapAction),
      possibleActionsByPhase : dto.possibleActionsByPhase,
      authorizedMinistryAndActions : dto.authorizedMinistryAndActions
    };

    return {
      game : {
        id : dto.id,
        createdAt : new Date(dto.createdAt),
        startedAt : dto.startedAt ? new Date(dto.startedAt) : null,
        currentTurn : dto.currentTurn,
        currentPhase : dto.currentPhase,
        finished : dto.finished,
        lifeCycleStatus : dto.lifeCycleStatus,
        version : dto.version,
        updateCounter : dto.updateCounter
      },
      phase,
      players,
      politicos : GameStateMapperService.mapGamePoliticos(dto.gamePoliticos),
      ministries : GameStateMapperService.mapGameMinistries(dto.gameMinistries),
      me : GameStateMapperService.mapMyPlayer(
        { players, myPlayerID : dto.myPlayerID, phase }
      ),
      ui : GameStateMapperService.initialUiState(),
      lastUpdateReason : undefined,
      trial: dto.trial ? GameStateMapperService.mapTrial(dto.trial) : undefined
    };
  }

  private static mapAction( actionDTO : ActionInstanceDto ): Action {
    return {
      id : actionDTO.id,
      type : actionDTO.type,
      status : actionDTO.status,
      actorPlayerID : actionDTO.actorID,
      targetPoliticoID : actionDTO.targetGamePoliticoID ?? undefined,
      actingPoliticoID : actionDTO.actingGamePoliticoID ?? undefined
    };
  }

  private static mapPlayers( 
    players : PlayerResponseDto[], myPlayerID : number
  ) : Record<number, PlayerState>
  {
    return Object.fromEntries(
      players.map( p => [
        p.id,
        {
          id : p.id,
          userID : p.userID,
          name : p.name,
          ready : p.ready,
          factionColor : p.faction,
          isMe : p.id === myPlayerID,
          declaredInfluences : p.declaredInfluences,
          assignedInfluences : p.id === myPlayerID ? p.assignedInfluences : undefined,
          controlledPoliticos : p.controlledPoliticosIDs
        }
      ])
    );
  }

  private static mapMyPlayer(
    state : {
      players : Record<number, PlayerState>;
      myPlayerID : number;
      phase : PhaseState;
    }
  ) : MyPlayerState {

    const me = state.players[state.myPlayerID];
    if (!me) {
      throw new Error("MyPlayer not found in players map.");
    }

    return {
      playerID : me.id,
      faction : me.factionColor ?? 'UNKNOWN',
      assignedInfluences : me.assignedInfluences ?? {},
      canAnnounceAction : GameStateMapperService.canAnnounceAction(state),
      canRespondAction : GameStateMapperService.canRespondAction(state)
    };
  }

  private static canAnnounceAction(
    state: {
      phase: PhaseState;
      players: Record<number, PlayerState>;
      myPlayerID: number;
    }
  ): boolean
  {
    const me = state.players[state.myPlayerID];

    if (!me) return false;

    if (state.phase.blockingStatus !== ActionBlockingStatus.NONE) return false;

    if (state.phase.phaseStatus !== PhaseExecutionStatus.OPEN_FOR_ACTIONS) return false;

    if (me.ready) return false; // WARNING!!! See if it affects trials, investigations, etc.

    return true;
  }

  private static canRespondAction(
    state: {
      phase: PhaseState;
      players: Record<number, PlayerState>;
      myPlayerID: number;
    }
  ) : boolean
  {
    const me = state.players[state.myPlayerID];

    if (!me) return false;

    const phaseStatus : PhaseExecutionStatus = state.phase.phaseStatus;
    if (phaseStatus !== PhaseExecutionStatus.OPEN_FOR_ACTIONS) return false;

    const awaitingAction : Action | null = state.phase.awaitingAction;
    if (awaitingAction === null) return false;

    const targetPoliticoID : number | undefined = awaitingAction.targetPoliticoID;
    if (targetPoliticoID === undefined) return false;

    const targetIsMine : boolean = me.controlledPoliticos.includes(targetPoliticoID);
    if ( !targetIsMine ) return false;
    
    return true;
  }

  private static mapGamePoliticos(
    gamePoliticos : GamePoliticoResponseDto[]
  ) : Record<number, GamePoliticoState>
  {
    return Object.fromEntries(
      gamePoliticos.map( gp => [
        gp.id,
        {
          id : gp.id,
          name : gp.politicoDTO.name,
          alias : gp.politicoDTO.alias,
          advantage : gp.politicoDTO.advantage,
          disadvantage : gp.politicoDTO.disadvantage,
          age : gp.currentAge,
          damage : gp.damage,
          status : gp.status,
          ministryID : gp.gameMinistryID ?? null,
          controllerPlayerID : gp.controllerPlayerID,
          investigations : GameStateMapperService.mapInvestigationState(gp)
        }
      ])
    );
  }

  private static mapInvestigationState(
    gamePolitico : GamePoliticoResponseDto
  ) : InvestigationState {
    return {
      count : gamePolitico.investigationCount,
      countAtPhaseStart : gamePolitico.investigationCountAtPhaseStart,
      immuneUntilTurn : gamePolitico.immuneToInvestigationsUntilTurn
    };
  }

  private static mapGameMinistries(
    gameMins : GameMinistryResponseDto[]
  ) : Record<number, GameMinistryState>
  {
    return Object.fromEntries(
      gameMins.map( gm => [
        gm.id,
        {
          id : gm.id,
          name : gm.ministryDTO.name,
          purgeNr : gm.ministryDTO.purgeNr,
          ministerID : gm.ministerID ?? undefined,
          isVacant : gm.isVacant
        }
      ])
    );
  }

  private static initialUiState() : GameUiState {
    return {
      loading : false,

      modal : {
        type : null,
        payload : null
      },

      notifications : [],

      selectedPoliticoID : null,
      selectedMinistryID : null,
      selectedActionType : null
    };
  }

  private static mapTrial( dto : TrialResponseDto ) : TrialState {
    return {
      id : dto.id,
      status : dto.status,
      result : dto.result ?? null,

      accusedGamePoliticoID : dto.accusedGamePoliticoID,
      prosecutorGamePoliticoID : dto.prosecutorGamePoliticoID,

      votes : Object.fromEntries(
        dto.votes.map( v => [
          v.voterGamePoliticoID,
          {
            vote : v.vote,
            cancelled : v.cancelled
          }
        ])
      ),

      allVotesCast : dto.allVotesCast
    };
  }

}

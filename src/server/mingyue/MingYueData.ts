import {SerializedMingYueData} from './SerializedMingYueData';
import {IGame} from '../IGame';

export interface MingYueData {
  lunaChain?: {
    lastProjectCardMegacreditCost?: number;
    totalGain: number;
    projectCardCount: number;
  };
  worldLineVoyager?: {
    isOneActionThisRound: boolean;
  };
  trisynInstitute?: {
    lastSetCount: number;
  };
  asteroidMaterialResearchCenter?: {
    counterGeneration: number;
    refreshCounter: {[cardName: string]: number};
  };
  abnormalTitan?: {
    draw: number;
    discard: number;
    nothing: number;
  };
}

export namespace MingYueData {
  export function serialize(data: MingYueData | undefined): SerializedMingYueData | undefined {
    if (data === undefined) return undefined;
    return {
      ...(data.lunaChain !== undefined && {
        lunaChain: {
          lastProjectCardMegacreditCost: data.lunaChain.lastProjectCardMegacreditCost,
          totalGain: data.lunaChain.totalGain,
          projectCardCount: data.lunaChain.projectCardCount,
        },
      }),
      ...(data.worldLineVoyager !== undefined && {
        worldLineVoyager: {
          isOneActionThisRound: data.worldLineVoyager.isOneActionThisRound,
        },
      }),
      ...(data.trisynInstitute !== undefined && {
        trisynInstitute: {
          lastSetCount: data.trisynInstitute.lastSetCount,
        },
      }),
      ...(data.asteroidMaterialResearchCenter !== undefined && {
        asteroidMaterialResearchCenter: {
          counterGeneration: data.asteroidMaterialResearchCenter.counterGeneration,
          refreshCounter: data.asteroidMaterialResearchCenter.refreshCounter,
        },
      }),
      ...(data.abnormalTitan !== undefined && {
        abnormalTitan: {
          draw: data.abnormalTitan.draw,
          discard: data.abnormalTitan.discard,
          nothing: data.abnormalTitan.nothing,
        },
      }),
    };
  }

  export function deserialize(data: SerializedMingYueData): MingYueData {
    return {
      lunaChain: data.lunaChain ?
        {
          lastProjectCardMegacreditCost: data.lunaChain.lastProjectCardMegacreditCost ?? undefined,
          totalGain: data.lunaChain.totalGain ?? 0,
          projectCardCount: data.lunaChain.projectCardCount ?? 0,
        } : undefined,
      worldLineVoyager: data.worldLineVoyager ?
        {
          isOneActionThisRound: data.worldLineVoyager.isOneActionThisRound ?? false,
        } : undefined,
      trisynInstitute: data.trisynInstitute ?
        {
          lastSetCount: data.trisynInstitute.lastSetCount ?? 0,
        } : undefined,
      asteroidMaterialResearchCenter: data.asteroidMaterialResearchCenter ?
        {
          counterGeneration: data.asteroidMaterialResearchCenter.counterGeneration ?? -1,
          refreshCounter: data.asteroidMaterialResearchCenter.refreshCounter ?? {},
        } : undefined,
      abnormalTitan: data.abnormalTitan ?
        {
          draw: data.abnormalTitan.draw ?? 0,
          discard: data.abnormalTitan.discard ?? 0,
          nothing: data.abnormalTitan.nothing ?? 0,
        } : undefined,
    };
  }
}

export function getLunaChainData(game: IGame) {
  game.mingyueData ??= {};
  game.mingyueData.lunaChain ??= {
    totalGain: 0,
    projectCardCount: 0,
    lastProjectCardMegacreditCost: undefined,
  };
  return game.mingyueData.lunaChain;
}

export function getWorldLineVoyagerData(game: IGame) {
  game.mingyueData ??= {};
  game.mingyueData.worldLineVoyager ??= {
    isOneActionThisRound: false,
  };
  return game.mingyueData.worldLineVoyager;
}

export function getTrisynInstituteData(game: IGame) {
  game.mingyueData ??= {};
  game.mingyueData.trisynInstitute ??= {
    lastSetCount: 0,
  };
  return game.mingyueData.trisynInstitute;
}

export function getAsteroidMaterialResearchCenterData(game: IGame) {
  game.mingyueData ??= {};
  game.mingyueData.asteroidMaterialResearchCenter ??= {
    counterGeneration: -1,
    refreshCounter: {},
  };
  return game.mingyueData.asteroidMaterialResearchCenter;
}

export function getAbnormalTitanData(game: IGame) {
  game.mingyueData ??= {};
  game.mingyueData.abnormalTitan ??= {
    draw: 0,
    discard: 0,
    nothing: 0,
  };
  return game.mingyueData.abnormalTitan;
}

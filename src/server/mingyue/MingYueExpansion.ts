import {MingYueData} from './MingYueData';

export class MingYueExpansion {
  private constructor() {}

  public static initialize(): MingYueData {
    return {
      lunaChain: {
        lastProjectCardMegacreditCost: undefined,
        totalGain: 0,
        projectCardCount: 0,
      },
      worldLineVoyager: {
        // 初始为 β 世界线（3 次行动）
        isOneActionThisRound: false,
      },
      trisynInstitute: {
        lastSetCount: 0,
      },
      asteroidMaterialResearchCenter: {
        refreshCounter: {},
      },
      abnormalTitan: {
        draw: 0,
        discard: 0,
        nothing: 0,
      },
    };
  }
}

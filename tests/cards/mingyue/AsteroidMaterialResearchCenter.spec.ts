import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {testGame, runAllActions, fakeCard} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {IGame} from '../../../src/server/IGame';
import {CardName} from '../../../src/common/cards/CardName';
import {ProjectDeck} from '../../../src/server/cards/Deck';

import {AsteroidDeflectionSystem} from '../../../src/server/cards/promo/AsteroidDeflectionSystem';
import {AsteroidMaterialResearchCenter} from '../../../src/server/cards/mingyue/AsteroidMaterialResearchCenter';
import {AsteroidRights} from '../../../src/server/cards/promo/AsteroidRights';
import {CometAiming} from '../../../src/server/cards/promo/CometAiming';
import {AsteroidHollowing} from '../../../src/server/cards/promo/AsteroidHollowing';
import {DirectedImpactors} from '../../../src/server/cards/promo/DirectedImpactors';
import {IcyImpactors} from '../../../src/server/cards/promo/IcyImpactors';
import {RotatorImpacts} from '../../../src/server/cards/venusNext/RotatorImpacts';

/**
 * 蓝卡联合研究中心测试（表驱动）
 * - prepare：测试前准备
 * - execute：执行动作
 * - verify：测试后结果检验
 *
 * 注意事项：
 * - 蓝卡行动不要直接调用 card.action(player)
 * - 使用 player.playActionCard().cb([card]) 执行动作
 * - playActionCard 内部会调用 card.action(player) 并将卡名加入 player.actionsThisGeneration
 * - actionsThisGeneration 用于标记本轮已使用过该卡的行动
 */

type BlueCardTestCase = {
  name: string;
  card: any;
  cardName: CardName;
  consumes?: {
    resource: 'titanium' | 'megaCredits'; // 消耗的资源类型
    amount: number; // 消耗的数量
  };
  resourceIncrement?: number; // 陨石资源增加数量，默认为 1
  useDeckCheck?: boolean; // 是否需要丢弃牌堆检查（如 AsteroidDeflectionSystem）
};

// 测试用例列表
const testCases: BlueCardTestCase[] = [
  {
    name: 'AsteroidDeflectionSystem',
    card: AsteroidDeflectionSystem,
    cardName: CardName.ASTEROID_DEFLECTION_SYSTEM,
    useDeckCheck: true,
  },
  {
    name: 'AsteroidRights',
    card: AsteroidRights,
    cardName: CardName.ASTEROID_RIGHTS,
    consumes: {resource: 'megaCredits', amount: 1},
  },
  {
    name: 'CometAiming',
    card: CometAiming,
    cardName: CardName.COMET_AIMING,
    consumes: {resource: 'titanium', amount: 1},
  },
  {
    name: 'AsteroidHollowing',
    card: AsteroidHollowing,
    cardName: CardName.ASTEROID_HOLLOWING,
    consumes: {resource: 'titanium', amount: 1},
  },
  {
    name: 'DirectedImpactors',
    card: DirectedImpactors,
    cardName: CardName.DIRECTED_IMPACTORS,
    consumes: {resource: 'megaCredits', amount: 6},
  },
  {
    name: 'IcyImpactors',
    card: IcyImpactors,
    cardName: CardName.ICY_IMPACTORS,
    consumes: {resource: 'megaCredits', amount: 10},
    resourceIncrement: 2, // 特殊蓝卡一次获得 2 个陨石资源
  },
  {
    name: 'RotatorImpacts',
    card: RotatorImpacts,
    cardName: CardName.ROTATOR_IMPACTS,
    consumes: {resource: 'megaCredits', amount: 6},
  },
];

describe('AsteroidMaterialResearchCenter + Blue Cards', () => {
  let center: AsteroidMaterialResearchCenter;
  let game: IGame;
  let player: TestPlayer;
  let player2: TestPlayer;
  let projectDeck: ProjectDeck;

  const spaceTag = fakeCard({
    name: 'space' as CardName,
    tags: [Tag.SPACE],
  });

  beforeEach(() => {
    // 初始化研究中心和两名玩家
    center = new AsteroidMaterialResearchCenter();
    [game, player, player2] = testGame(2);
  });

  /**
   * 测试前准备：
   * - 放置蓝卡和研究中心（可选）
   * - 初始化资源数量
   * - 设置资源消耗
   * - 校验卡牌是否可行动
   */
  const prepare = (
    card: any,
    hasResearchCenter: boolean,
    consumes?: {resource: 'titanium' | 'megaCredits'; amount: number},
  ) => {
    player.playedCards = hasResearchCenter ? [center, card] : [card];
    player2.playedCards = [];
    card.resourceCount = 0;

    if (consumes) player[consumes.resource] = consumes.amount;

    expect(card.canAct(player)).to.be.true;
    expect(player.actionsThisGeneration.has(card.constructor.name)).to.be.false;
  };

  /**
   * 执行动作：
   * - 对于需要丢弃牌堆检查的卡牌，循环直到满足条件
   * - 其他卡牌直接执行
   * - 处理延迟动作队列
   */
  const execute = (card: any, useDeckCheck = false) => {
    if (useDeckCheck) {
      projectDeck = game.projectDeck;
      projectDeck.drawPile = [spaceTag];
      player.playActionCard().cb([card]);
    } else {
      player.playActionCard().cb([card]);
    }
    runAllActions(game);
  };

  /**
   * 测试后结果检验：
   * - 校验陨石资源数量是否正确
   * - 校验消耗资源是否为 0
   * - 校验 actionsThisGeneration 是否正确刷新
   */
  const verify = (
    card: any,
    tc: BlueCardTestCase,
    expectRefreshed: boolean = true,
  ) => {
    const increment = tc.resourceIncrement ?? 1;
    expect(card.resourceCount).to.eq(increment);

    if (tc.consumes) expect(player[tc.consumes.resource]).to.eq(0);

    expect(player.actionsThisGeneration.has(tc.cardName)).to.eq(!expectRefreshed);
  };

  // 遍历每张蓝卡，分别测试有/无研究中心两种情况
  testCases.forEach((tc) => {
    describe(tc.name, () => {
      it('should refresh action with research center', () => {
        const card = new (tc.card as { new(): any })();
        prepare(card, true, tc.consumes);
        execute(card, tc.useDeckCheck);
        verify(card, tc, true);
      });

      it('should NOT refresh action without research center', () => {
        const card = new (tc.card as { new(): any })();
        prepare(card, false, tc.consumes);
        execute(card, tc.useDeckCheck);
        verify(card, tc, false);
      });
    });
  });
});

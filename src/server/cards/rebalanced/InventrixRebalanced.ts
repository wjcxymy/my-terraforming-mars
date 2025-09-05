import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Inventrix} from '../corporation/Inventrix';
import {IPlayer} from '../../../server/IPlayer';
import {ICard} from '../ICard';
import {Resource} from '../../../common/Resource';
import {Size} from '../../../common/cards/render/Size';
import {GlobalParameter} from '../../../common/GlobalParameter';

const GLOBAL_REQUIREMENT_MODIFIER = 3;

// --- 辅助对象 ---
// 这些辅助对象内聚在此文件中，用于解析卡牌的需求描述对象。

const stepValues = {
  venus: 2,
  oxygen: 1,
  temperature: 2,
  oceans: 1,
};

// 用于从需求对象中识别出全局参数的键
const paramKeys = ['temperature', 'oxygen', 'oceans', 'venus'] as const;
type ParamKey = typeof paramKeys[number];

// 用于将字符串键映射到游戏引擎的 GlobalParameter 枚举，
// 以便调用核心的 getGlobalParameterRequirementBonus 方法。
const globalParameterMap: Record<ParamKey, GlobalParameter> = {
  temperature: GlobalParameter.TEMPERATURE,
  oxygen: GlobalParameter.OXYGEN,
  oceans: GlobalParameter.OCEANS,
  venus: GlobalParameter.VENUS,
};

export class InventrixRebalanced extends Inventrix {
  /**
   * 一个临时标记，用于追踪上一次出牌时，全球参数加成是否为必要条件。
   * 该状态由 `prePlayCardCheck` 设置，并由 `onCardPlayed` 读取和重置。
   */
  private _bonusWasEssentialInLastPlay: boolean = false;

  constructor() {
    super({
      name: CardName.INVENTRIX_REBALANCED,
      globalParameterRequirementBonus: {steps: GLOBAL_REQUIREMENT_MODIFIER},

      metadata: {
        cardNumber: 'RB-CORP-10',
        description: 'As your first action in the game, draw 3 cards. Start with 45 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(45).nbsp.cards(3);
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect('Your temperature, oxygen, ocean, and Venus requirements are +3 or -3 steps, your choice in each case.', (eb) => {
              eb.plate('Global requirements').startEffect.text('+/- 3');
            });
            ce.effect('When you use the global requirement modifier to play a card, gain 3 M€.', (eb) => {
              eb.cards(1).plate('Global requirements').asterix().startEffect.megacredits(3);
            });
          });
        }),
      },
    });
  }

  /**
   * 辅助方法，直接从游戏状态中获取全球参数的原始值。
   * @param paramKey 标识全局参数的键。
   * @param player 玩家上下文。
   * @returns 参数的当前数值。
   */
  private getRawGlobalValue(paramKey: ParamKey, player: IPlayer): number {
    switch (paramKey) {
    case 'temperature': return player.game.getTemperature();
    case 'oxygen': return player.game.getOxygenLevel();
    case 'oceans': return player.game.board.getOceanSpaces().length;
    case 'venus': return player.game.getVenusScaleLevel();
    default: return 0;
    }
  }

  /**
   * 检查全球参数加成对于打出某张牌是否为必要条件。
   * 此方法设计为在卡牌效果结算*前*，从 `Player.playCard` 中调用。
   * 它会分析卡牌需求和当前游戏状态，以判断玩家在没有加成的情况下是否能打出此牌。
   * 如果加成是必要的，它会设置一个内部标记，供 `onCardPlayed` 稍后读取。
   * @param player 尝试打出卡牌的玩家。
   * @param card 正在被打出的卡牌。
   */
  public prePlayCardCheck(player: IPlayer, card: ICard): void {
    // 每次检查开始时都重置标记，确保状态干净。
    this._bonusWasEssentialInLastPlay = false;

    if (!card.requirements) {
      return;
    }

    const requirementDescriptor = Array.isArray(card.requirements) ? card.requirements[0] : card.requirements;
    if (!requirementDescriptor) {
      return;
    }

    // 通过检查已知的键名，来识别卡牌是否拥有全局参数需求。
    const paramKey = paramKeys.find((key) => key in requirementDescriptor);
    if (!paramKey) {
      return;
    }

    // 复现需求检查的核心逻辑。
    const requiredCount = requirementDescriptor[paramKey] as number;
    const isMax = !!requirementDescriptor.max;
    const scale = stepValues[paramKey];

    // 计算玩家*不带*任何加成的分数（即原始游戏状态）。
    const scoreWithoutBonus = this.getRawGlobalValue(paramKey, player);
    const satisfiedWithoutBonus = isMax ? scoreWithoutBonus <= requiredCount : scoreWithoutBonus >= requiredCount;

    // 计算玩家*带有*所有适用加成的分数。
    const playerRequirementsBonusSteps = player.getGlobalParameterRequirementBonus(globalParameterMap[paramKey]);
    const bonusValue = playerRequirementsBonusSteps * scale;
    const scoreWithBonus = isMax ? scoreWithoutBonus - bonusValue : scoreWithoutBonus + bonusValue;
    const satisfiedWithBonus = isMax ? scoreWithBonus <= requiredCount : scoreWithBonus >= requiredCount;

    // 如果在没有加成时需求不满足，但在有加成时满足，则该加成被视为“必要”的。
    if (!satisfiedWithoutBonus && satisfiedWithBonus) {
      this._bonusWasEssentialInLastPlay = true;
    }
  }

  /**
   * 响应卡牌打出事件。
   * 对于 Inventrix，此方法会检查前置检查的结果，判断是否使用了需求加成，如果是，则发放奖励。
   * @param player 打出卡牌的玩家。
   * @param card 被打出的卡牌。
   */
  public onCardPlayed(player: IPlayer, card: ICard): void {
    // 该效果只为拥有此公司的玩家触发。
    if (!player.isCorporation(this.name)) {
      return;
    }

    // 检查由 prePlayCardCheck 设置的标记。
    if (this._bonusWasEssentialInLastPlay) {
      player.stock.add(Resource.MEGACREDITS, 3, {log: false});
      player.game.log(
        '${0} gained 3 M€ from ${1} effect for using a global requirement modifier on ${2}.',
        (b) => b.player(player).card(this).card(card),
      );
    }

    // 【至关重要】使用后立即重置标记，以防影响后续不相关的游戏动作。
    this._bonusWasEssentialInLastPlay = false;
  }
}

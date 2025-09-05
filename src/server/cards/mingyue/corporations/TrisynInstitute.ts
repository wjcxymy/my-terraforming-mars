import {Tag} from '../../../../common/cards/Tag';
import {IPlayer} from '../../../IPlayer';
import {CorporationCard} from '../../corporation/CorporationCard';
import {ICard} from '../../ICard';
import {CardName} from '../../../../common/cards/CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {CardType} from '../../../../common/cards/CardType';
import {Size} from '../../../../common/cards/render/Size';
import {SelectCard} from '../../../inputs/SelectCard';
import {PlayerInput} from '../../../PlayerInput';
import {LogHelper} from '../../../LogHelper';
import {getTrisynInstituteData} from '../../../mingyue/MingYueData';

export class TrisynInstitute extends CorporationCard {
  /**
   * 定义构成“套数”的项目卡类型。
   * 作为一个静态只读属性，它为整个类提供了一个统一且不可变的常量引用。
   */
  public static readonly PROJECT_CARD_TYPES = [CardType.EVENT, CardType.AUTOMATED, CardType.ACTIVE];

  constructor() {
    super({
      name: CardName.TRISYN_INSTITUTE,
      tags: [Tag.SCIENCE],
      startingMegaCredits: 48,

      metadata: {
        cardNumber: 'MY-CORP-01',
        description: 'You start with 48 M€.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(48);
          b.corpBox('action', (cb) => {
            cb.vSpace(Size.LARGE);
            cb.action('Reveal and discard 2 cards from your hand, then draw 1 card of a color not present among the discarded cards.', (eb) => {
              eb.minus().cards(2).startAction.plus().cards(1).asterix();
            });
            cb.vSpace(Size.SMALL);
            cb.effect('After you play a project card, if this completes a new set of red, green, and blue project cards, draw 1 card.', (eb) => {
              eb.text('new<br>set', Size.SMALL, true)
                .one_set().asterix().startEffect.cards(1);
            });
          });
        }),
      },
    });
  }

  // --- 公司动作相关方法 ---

  /**
   * 检查公司的动作是否可执行。
   * 根据卡牌描述，玩家必须至少有2张手牌才能启动此动作。
   * @param player 当前玩家。
   * @returns 如果玩家手牌数大于等于2，则返回 true。
   */
  public canAct(player: IPlayer): boolean {
    return player.cardsInHand.length >= 2;
  }

  /**
   * 公司动作的主要入口点。
   * 此方法由游戏引擎在玩家选择执行动作时调用。
   * 它首先通过 `canAct` 进行前置条件检查，然后将具体的交互和逻辑处理委托给私有方法。
   * @param player 当前玩家。
   * @returns 返回一个玩家输入对象（PlayerInput）以启动交互，或者在不满足条件时返回 undefined。
   */
  public action(player: IPlayer): PlayerInput | undefined {
    if (!this.canAct(player)) {
      return undefined;
    }
    return this.discardAndDrawAction(player);
  }

  /**
   * 处理“弃2抽1”的核心交互逻辑。
   * 该方法会：
   * 1. 弹出卡牌选择界面，要求玩家选择2张手牌。
   * 2. 在玩家确认后，执行弃牌操作。
   * 3. 根据弃牌的颜色，计算出应该从哪种（或哪些）颜色的牌库中抽牌。
   * 4. 执行抽牌操作。
   * @param player 当前玩家。
   * @returns 返回一个启动卡牌选择流程的 PlayerInput 对象。
   */
  private discardAndDrawAction(player: IPlayer): PlayerInput {
    return new SelectCard('Select 2 cards to discard', 'Discard', player.cardsInHand, {min: 2, max: 2})
      .andThen((cards) => {
        const [card1, card2] = cards;
        player.game.log('${0} discarded 2 cards using their ${1} action.', (b) => b.player(player).card(this));
        LogHelper.logDiscardedCards(player.game, cards);
        player.discardCardFromHand(card1);
        player.discardCardFromHand(card2);

        const typesToDrawFrom = this.getRemainingCardTypes([card1.type, card2.type]);

        // 根据剩余颜色的数量决定是定向抽牌还是随机抽牌。
        const typeToDraw = typesToDrawFrom.length === 1 ?
          typesToDrawFrom[0] : // 如果只剩一种颜色，直接抽该颜色。
          typesToDrawFrom[Math.floor(Math.random() * typesToDrawFrom.length)]; // 如果剩下两种颜色，随机选择一种。

        player.drawCard(1, {cardType: typeToDraw});
        return undefined;
      });
  }

  /**
   * 一个纯粹的辅助函数，用于根据弃牌的颜色计算剩余的卡牌颜色。
   * 它能正确处理弃掉两张同色牌（返回另外两种颜色）或两张不同色牌（返回剩下的一种颜色）的情况。
   * @param discardedTypes 一个包含两张被弃卡牌类型的元组。
   * @returns 一个包含剩余卡牌类型的数组。
   */
  private getRemainingCardTypes(discardedTypes: [CardType, CardType]): CardType[] {
    const uniqueDiscardedTypes = new Set(discardedTypes);
    // 使用静态属性作为单一事实来源
    return TrisynInstitute.PROJECT_CARD_TYPES.filter((t) => !uniqueDiscardedTypes.has(t));
  }

  // --- 核心被动效果逻辑 ---

  /**
   * 检查并更新玩家的红/绿/蓝项目卡套数。
   *
   * 此方法是本公司的核心逻辑。它计算玩家当前拥有的完整套数（即红、绿、蓝卡牌数量的最小值），
   * 并与上次记录的套数进行比较：
   * - 如果套数增加，玩家将因公司效果抽一张牌。
   * - 如果套数减少，将记录一条日志以告知玩家状态变化。
   *
   * 【重要】: 此方法被设计为公共方法，因为它不仅在本类中被调用，还必须由其他可能
   * 影响玩家 `playedCards` 列表的外部卡牌主动调用，以确保套数统计的实时准确性。
   *
   * 已知的外部调用场景包括：
   * - `Playwrights` (剧作家): 其效果可以重演并永久移除一张事件牌。如果该牌属于
   *   Trisyn Institute 玩家，会导致其红牌数量减少，可能破坏一个已有的套数。
   * - `AstraMechanica` (星械会): 其效果可以从弃牌堆中回收事件牌至手牌，同样会
   *   减少玩家已打出的红牌数量，进而影响套数。
   */
  public updateTrisynInstituteSetCount(player: IPlayer): void {
    const redCount = player.playedCards.filter((c) => c.type === CardType.EVENT).length;
    const greenCount = player.playedCards.filter((c) => c.type === CardType.AUTOMATED).length;
    const blueCount = player.playedCards.filter((c) => c.type === CardType.ACTIVE).length;
    const currentSetCount = Math.min(redCount, greenCount, blueCount);

    const data = getTrisynInstituteData(player.game);

    if (currentSetCount > data.lastSetCount) {
      player.game.log(
        '${0} collected ${1} red-green-blue sets, drew 1 card due to ${2} effect.',
        (b) => b.player(player).number(currentSetCount).card(this),
      );
      player.drawCard(1);
    } else if (currentSetCount < data.lastSetCount) {
      player.game.log(
        '${0}\'s red-green-blue set count decreased to ${1}.',
        (b) => b.player(player).number(currentSetCount),
      );
    }

    data.lastSetCount = currentSetCount;
  }

  /**
   * 响应出牌事件的钩子。
   * 当本公司玩家打出任意一张红、绿、蓝项目卡时，触发套数更新检查。
   */
  public onCardPlayed(player: IPlayer, card: ICard): void {
    if (!player.isCorporation(this.name)) {
      return;
    }
    // 使用静态属性作为单一事实来源
    if (!TrisynInstitute.PROJECT_CARD_TYPES.includes(card.type)) {
      return;
    }

    this.updateTrisynInstituteSetCount(player);
  }
}

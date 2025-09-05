import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {ActionCard} from '../ActionCard';

export class InfiniteMonkeyTheorem extends ActionCard implements IProjectCard {
  /**
   * 存储所有通过此卡牌效果揭示的牌。
   * 这个数组是计算效果的“单一事实来源”，并且可以被游戏引擎正确地序列化和恢复。
   */
  public targetCards: IProjectCard[] = [];

  constructor() {
    super({
      name: CardName.INFINITE_MONKEY_THEOREM,
      cost: 12,
      tags: [Tag.ANIMAL],
      type: CardType.ACTIVE,
      resourceType: CardResource.TYPEWRITER,
      victoryPoints: 1,

      action: {},

      metadata: {
        cardNumber: 'MY05',
        renderData: CardRenderer.builder((b) => {
          b.action(
            'Reveal the top card of the deck and place it sideways on this card. For each new tag gained this way, place 1 typewriter here.',
            (eb) => {
              eb.empty()
                .startAction.cards(1).asterix()
                .nbsp.resource(CardResource.TYPEWRITER).slash().diverseTag().asterix();
            },
          ).br;
          b.megacredits(1).slash().resource(CardResource.TYPEWRITER).br;
          b.plainText('(Then gain 1M€ per typewriter here.)').br;
        }),
      },
    });
  }

  /**
   * 检查动作是否可执行。当牌库中至少还有一张牌时，可以执行。
   */
  public override bespokeCanAct(player: IPlayer): boolean {
    return player.game.projectDeck.canDraw(1);
  }

  /**
   * 执行卡牌的主要动作。
   * 此方法采用无状态计算方式，每次都从 this.targetCards 重新构建所需信息，
   * 以确保与游戏快照的序列化/反序列化机制兼容。
   */
  public override bespokeAction(player: IPlayer) {
    // 1. 从牌库顶抽一张牌。
    const topCard = player.game.projectDeck.drawOrThrow(player.game);
    if (!topCard) {
      return;
    }

    // 2. 在进行任何计算之前，先构建“之前”的状态。
    // a. 获取此动作发生前，已经揭示的所有卡牌。
    const previousCards = [...this.targetCards];
    // b. 将新揭示的卡牌加入列表，更新当前状态。
    this.targetCards.push(topCard);

    player.game.log('${0} linked ${1} with ${2}', (b) =>
      b.player(player).card(topCard).card(this),
    );

    // 3. 计算新获得的、独一无二的标签数量。
    // a. 首先，高效地构建一个包含所有“旧”标签的集合，用于快速查找。
    const seenTags = new Set<Tag>(previousCards.flatMap((card) => card.tags));

    // b. 然后，遍历新卡上的独特标签，并与旧标签集合进行比较。
    const newCardUniqueTags = new Set(topCard.tags);
    let newTagsCount = 0;
    for (const tag of newCardUniqueTags) {
      if (!seenTags.has(tag)) {
        newTagsCount++;
      }
    }

    // 4. 根据新标签的数量，增加资源。
    if (newTagsCount > 0) {
      player.addResourceTo(this, newTagsCount);
    }

    // 5. 根据当前总资源数，获得金钱。
    if (this.resourceCount > 0) {
      player.stock.add(Resource.MEGACREDITS, this.resourceCount, {log: true});
    }

    player.game.resettable = false;
    return undefined;
  }
}

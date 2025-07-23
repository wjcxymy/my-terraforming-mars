import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {Size} from '../../../common/cards/render/Size';
import {ActionCard} from '../ActionCard';

export class InfiniteMonkeyTheorem extends ActionCard implements IProjectCard {
  // 存储所有曾经展示的牌
  public targetCards: IProjectCard[] = [];

  constructor() {
    super({
      name: CardName.INFINITE_MONKEY_THEOREM,
      cost: 12,
      tags: [Tag.ANIMAL],
      type: CardType.ACTIVE,
      resourceType: CardResource.MONKEY,
      victoryPoints: 1,

      action: {},

      metadata: {
        cardNumber: 'MY05',
        renderData: CardRenderer.builder((b) => {
          b.action(
            'Reveal the top card of the deck and place it sideways on this card. For each new tag gained this way, place 1 animal here.',
            (eb) => {
              eb.empty()
                .startAction.cards(1).asterix()
                .nbsp.diverseTag().slash().resource(CardResource.MONKEY).asterix();
            },
          ).br;
          b.resource(CardResource.MONKEY).slash().megacredits(1).br;
          b.plainText('(Then gain 1M€ per animal here.)').br;
          b.text('Cannot gain animals by other means.', Size.SMALL, true);
        }),
      },
    });
  }

  public override bespokeCanAct(player: IPlayer): boolean {
    return player.game.projectDeck.canDraw(1);
  }

  public override bespokeAction(player: IPlayer) {
    const topCard = player.game.projectDeck.drawOrThrow(player.game);
    if (!topCard) return;

    this.targetCards.push(topCard);

    // 从所有 targetCards 中重新统计已有标志
    const ownedTags = new Set<Tag>();
    for (const card of this.targetCards) {
      for (const tag of card.tags) {
        ownedTags.add(tag);
      }
    }

    // 统计 topCard 中哪些标志是“新出现的”
    const newTags: Tag[] = [];
    const topCardUniqueTags = Array.from(new Set(topCard.tags));
    for (const tag of topCardUniqueTags) {
      // 如果之前未出现该标志
      const countInPrevious = this.targetCards
        .slice(0, this.targetCards.length - 1) // 排除刚展示的 topCard
        .some((card) => card.tags.includes(tag));
      if (!countInPrevious) {
        newTags.push(tag);
        // console.log(`新获得的标志: ${tag}`);
      }
    }

    // console.log(`当前存储的牌数量: ${this.targetCards.length}`);
    // console.log(`已获得的标志种类数: ${ownedTags.size}`);

    const gainedAnimalCount = newTags.length;
    if (gainedAnimalCount > 0) {
      player.addResourceTo(this, gainedAnimalCount);
    }

    player.game.log('${0} linked ${1} with ${2}', (b) =>
      b.player(player).card(topCard).card(this),
    );

    player.stock.add(Resource.MEGACREDITS, this.resourceCount, {log: true});

    return undefined;
  }
}

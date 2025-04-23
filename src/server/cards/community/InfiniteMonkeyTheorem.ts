import { IProjectCard } from '../IProjectCard';
import { IActionCard } from '../ICard';
import { Card } from '../Card';
import { CardType } from '../../../common/cards/CardType';
import { Tag } from '../../../common/cards/Tag';
import { CardName } from '../../../common/cards/CardName';
import { CardResource } from '../../../common/CardResource';
import { CardRenderer } from '../render/CardRenderer';
import { IPlayer } from '../../IPlayer';
import { Resource } from '../../../common/Resource';
import { Size } from '../../../common/cards/render/Size';

export class InfiniteMonkeyTheorem extends Card implements IProjectCard, IActionCard {
  // 存储所有曾经展示的牌
  public targetCards: IProjectCard[] = [];

  // 存储所有曾经展示牌中出现过的、并触发过奖励的标签
  private gainedTags: Set<Tag> = new Set();

  constructor() {
    super({
      name: CardName.INFINITE_MONKEY_THEOREM,
      cost: 12,
      tags: [Tag.ANIMAL],
      type: CardType.ACTIVE,
      resourceType: CardResource.MONKEY,
      victoryPoints:1,
      metadata: {
        cardNumber: 'MY05',
        renderData: CardRenderer.builder((b) => {
          b.action(
            'Reveal the top card of the deck and place it sideways on this card. For each new tag gained this way, place 1 animal here.',
            (eb) => {
              eb.empty().startAction.cards(1).asterix()
                .nbsp
                .diverseTag().slash().resource(CardResource.MONKEY).asterix();
            }).br;
          b.plainEffect(
            'Then gain 1M€ per animal here.',
            (eb) => {
              eb.empty().startEffect
                .resource(CardResource.MONKEY).slash().megacredits(1);
            }).br;
          b.text('Cannot gain animals by other means.', Size.SMALL, true);
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.game.projectDeck.canDraw(1);
  }

  public action(player: IPlayer) {
    const topCard = player.game.projectDeck.drawOrThrow(player.game);
    if (!topCard) return;

    this.targetCards.push(topCard);
    topCard.resourceCount = 2;

    const newTags: Tag[] = [];

    for (const tag of topCard.tags) {
      if (!this.gainedTags.has(tag)) {
        this.gainedTags.add(tag);
        newTags.push(tag);
      }
    }

    const gainedAnimalCount = newTags.length;

    if (gainedAnimalCount > 0) {
      player.addResourceTo(this, gainedAnimalCount);
    }

    player.game.log('${0} linked ${1} with ${2}', (b) =>
      b.player(player).card(topCard).card(this)
    );

    player.stock.add(Resource.MEGACREDITS, this.resourceCount, { log: true });

    return undefined;
  }
}

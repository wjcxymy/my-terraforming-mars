import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ICard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {Resource} from '../../../common/Resource';

/**
 * 微生物反应堆（Microbial Reactor）
 * 每获得资源时，若卡上有 2X 微生物，则移除这些资源，获得 2X 热量 和 X 点植物产量。
 */
export class MicrobialReactor extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MICROBIAL_REACTOR,
      tags: [Tag.PLANT, Tag.MICROBE],
      cost: 9,
      resourceType: CardResource.MICROBE,
      requirements: {greeneries: 2},

      metadata: {
        cardNumber: 'MY12',
        description: 'Requires that you have 2 greenery tiles in play.',
        renderData: CardRenderer.builder((b) => {
          b.effect(
            'For every 2 microbes on this card, remove them to gain 2 heat and 1 plant production.',
            (eb) => {
              eb.resource(CardResource.MICROBE, {amount: 2})
                .startEffect
                .heat(2)
                .production((pb) => pb.plants(1));
            },
          );
        }),
      },
    });
  }

  /**
   * 每次卡牌获得资源时触发。如果卡上有 2 的倍数数量的微生物，
   * 则自动移除这些微生物，换取等量热量并提升植物产量。
   */
  public onResourceAdded(player: IPlayer, playedCard: ICard) {
    if (playedCard.name !== this.name) return;

    const delta = Math.floor(this.resourceCount / 2);
    if (delta > 0) {
      const deducted = delta * 2;
      this.resourceCount -= deducted;

      player.stock.add(Resource.HEAT, deducted, {log: false});
      player.production.add(Resource.PLANTS, delta, {log: false});

      player.game.log(
        '${0} removed ${1} microbe(s) from ${2} to gain ${3} heat and increase plant production by ${4}.',
        (b) =>
          b.player(player).number(deducted).card(this).number(deducted).number(delta),
      );
    }
  }
}

import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {IProjectCard} from '../IProjectCard';
import {Payment} from '../../../common/inputs/Payment';
import {Size} from '../../../common/cards/render/Size';

export class HeavyworksCreed extends CorporationCard {
  constructor() {
    super({
      name: CardName.HEAVYWORKS_CREED,
      tags: [Tag.BUILDING],
      startingMegaCredits: 30,
      resourceType: CardResource.AGENDA,
      behavior: {
        stock: {steel: 10},
        addResources: 1,
      },
      metadata: {
        cardNumber: 'MY-CORP-07',
        description: 'You start with 10 steel and 1 worker.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br.megacredits(30).steel(10).nbsp.resource(CardResource.AGENDA);
          b.corpBox('effect', (cb) => {
            cb.vSpace(Size.LARGE);
            cb.effect('When you play a project card and pay 2 or more steel, place 1 worker on this card.', (eb) =>
              eb.cards(1).text('pay').text('2+').steel(1)
                .startEffect
                .resource(CardResource.AGENDA),
            );
            cb.effect('For every 2 workers, reduce the cost of building- or space-tagged cards you play by 1 M€.', (eb) =>
              eb.tag(Tag.BUILDING).slash().tag(Tag.SPACE)
                .startEffect
                .megacreditsText('-1').slash().text('2').resource(CardResource.AGENDA),
            );
          });
        }),
      },
    });
  }

  public onCardPlayedWithPayment(player: IPlayer, _card: IProjectCard, payment: Payment): void {
    if (!player.isCorporation(this.name)) return;

    // console.log(`[DEBUG] 卡牌名称: ${_card.name}, payment:`, payment);

    if (payment.steel >= 2) {
      player.addResourceTo(this, 1);
      player.game.log(
        '${0} paid ${1} steel and added 1 worker to ${2}.',
        (b) => b.player(player).number(payment.steel).card(this),
      );
    }
  }

  public override getCardDiscount(player: IPlayer, card: IProjectCard): number {
    if (!player.isCorporation(this.name)) return 0;

    const numValidTags = card.tags.filter((tag) => tag === Tag.BUILDING || tag === Tag.SPACE).length;
    if (numValidTags === 0) return 0;

    const discountPerInstance = Math.floor(this.resourceCount / 2);
    return discountPerInstance * numValidTags;
  }
}

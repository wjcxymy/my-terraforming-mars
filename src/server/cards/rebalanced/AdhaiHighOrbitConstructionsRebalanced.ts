import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {IProjectCard} from '../IProjectCard';
import {Size} from '../../../common/cards/render/Size';
import {AdhaiHighOrbitConstructions} from '../pathfinders/AdhaiHighOrbitConstructions';

export class AdhaiHighOrbitConstructionsRebalanced extends AdhaiHighOrbitConstructions {
  constructor() {
    super({
      name: CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS_REBALANCED,

      metadata: {
        cardNumber: 'RB-CORP-09',
        description: 'You start with 43 M€.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(43);
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect('Whenever you play a card with a space tag (including this) add 1 orbital on this card.', (eb) => {
              eb.tag(Tag.SPACE).startEffect.resource(CardResource.ORBITAL);
            });
            ce.effect('For every 2 orbitals on this card, cards with a space tag or the STANDARD COLONY PROJECT or TRADE ACTION costs 1M€ less.', (eb) => {
              eb.tag(Tag.SPACE).slash().colonies(1, {size: Size.SMALL}).slash().trade({size: Size.SMALL})
                .startEffect
                .megacreditsText('-1').slash().text('2').resource(CardResource.ORBITAL);
            });
          });
        }),
      },
    });
  }

  public override onCardPlayed(player: IPlayer, card: IProjectCard) {
    if (player.isCorporation(CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS_REBALANCED) && card.tags.includes(Tag.SPACE)) {
      player.addResourceTo(this, {qty: 1, log: true});
    }
  }

  public override getCardDiscount(player: IPlayer, card: IProjectCard) {
    if (player.isCorporation(CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS_REBALANCED) && card.tags.includes(Tag.SPACE)) {
      return Math.floor(this.resourceCount / 2);
    } else {
      return 0;
    }
  }
}

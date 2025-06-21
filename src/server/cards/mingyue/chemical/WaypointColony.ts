import {IProjectCard} from '../../IProjectCard';
import {Card} from '../../Card';
import {CardType} from '../../../../common/cards/CardType';
import {Tag} from '../../../../common/cards/Tag';
import {CardName} from '../../../../common/cards/CardName';
import {CardRenderer} from '../../render/CardRenderer';

export class WaypointColony extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.WAYPOINT_COLONY,
      cost: 20,
      tags: [Tag.SPACE],

      behavior: {
        colonies: {buildColony: {}},
      },

      cardDiscount: {tag: Tag.SPACE, amount: 2},

      metadata: {
        cardNumber: 'MY25',
        description: 'Place a colony.',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a space card, you pay 2 M€ less for it.', (eb) => {
            eb.tag(Tag.SPACE).startEffect.megacredits(-2);
          }).br;
          b.colonies(1);
        }),
      },
    });
  }
}

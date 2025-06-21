import {IProjectCard} from '../../IProjectCard';
import {Card} from '../../Card';
import {CardType} from '../../../../common/cards/CardType';
import {Tag} from '../../../../common/cards/Tag';
import {CardName} from '../../../../common/cards/CardName';
import {CardRenderer} from '../../render/CardRenderer';

export class PortOfElysium extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.PORT_OF_ELYSIUM,
      tags: [Tag.CITY, Tag.BUILDING],
      victoryPoints: 1,
      cost: 28,

      requirements: {colonies: 3},

      behavior: {
        production: {
          energy: -2,
          megacredits: 5,
        },
        city: {},
        colonies: {addTradeFleet: 1},
        stock: {titanium: 2},
      },

      metadata: {
        cardNumber: 'MY24',
        description: 'Requires 3 colonies. Decrease your energy production 2 steps, increase your M€ production 5 steps, place a city tile, gain a trade fleet, and gain 2 titanium.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(2).br;
            pb.plus().megacredits(5);
          }).nbsp.city().br;
          b.tradeFleet().titanium(2);
        }),
      },
    });
  }
}

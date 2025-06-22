import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class GrandStadium extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.GRAND_STADIUM,
      cost: 9,
      tags: [Tag.BUILDING],
      victoryPoints: 2,

      requirements: {cities: 3},

      behavior: {
        production: {
          energy: -1,
          megacredits: 3,
        },
      },

      metadata: {
        cardNumber: 'CHM07',
        description: 'Requires that you own 3 cities. Decrease your energy production 1 step and increase your M€ production 3 steps.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          });
        }),
      },
    });
  }
}

import {IProjectCard} from '../../IProjectCard';
import {Card} from '../../Card';
import {CardType} from '../../../../common/cards/CardType';
import {Tag} from '../../../../common/cards/Tag';
import {CardName} from '../../../../common/cards/CardName';
import {CardRenderer} from '../../render/CardRenderer';

export class FuelCellProduction extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.FUEL_CELL_PRODUCTION,
      cost: 4,
      tags: [Tag.BUILDING, Tag.POWER],

      behavior: {
        production: {
          megacredits: -2,
          energy: 2,
        },
      },

      metadata: {
        cardNumber: 'MY19',
        description: 'Decrease your M€ production 2 steps and increase your energy production 2 steps.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(2).br;
            pb.plus().energy(2);
          });
        }),
      },
    });
  }
}

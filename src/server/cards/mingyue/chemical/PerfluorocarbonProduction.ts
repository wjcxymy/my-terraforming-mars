import {IProjectCard} from '../../IProjectCard';
import {Card} from '../../Card';
import {CardType} from '../../../../common/cards/CardType';
import {Tag} from '../../../../common/cards/Tag';
import {CardName} from '../../../../common/cards/CardName';
import {CardRenderer} from '../../render/CardRenderer';

export class PerfluorocarbonProduction extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.PERFLUOROCARBON_PRODUCTION,
      cost: 12,
      tags: [Tag.BUILDING],
      victoryPoints: -1,

      behavior: {
        production: {
          energy: -1,
          heat: 5,
        },
      },

      metadata: {
        cardNumber: 'MY23',
        description: 'Decrease your energy production 1 step and increase your heat production 5 steps.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().heat(5);
          });
        }),
      },
    });
  }
}

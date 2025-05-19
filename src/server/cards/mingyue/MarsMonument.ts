import {CardName} from '../../../common/cards/CardName';
import {TileType} from '../../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';

export class MarsMonument extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.MARS_MONUMENT,
      tags: [Tag.BUILDING],
      cost: 20,
      requirements: {tr: 35},
      victoryPoints: 5,

      behavior: {
        tile: {
          type: TileType.MARS_MONUMENT,
          on: 'land',
          title: 'Place the Mars Monument tile.',
        },
      },

      metadata: {
        cardNumber: 'MY13',
        renderData: CardRenderer.builder((b) => {
          b.tile(TileType.MARS_MONUMENT, false, false);
        }),
        description: 'Place the Mars Monument tile — a silent monument to humanity’s dream of Terraforming Mars.',
      },
    });
  }
}

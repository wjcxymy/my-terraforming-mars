import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class PowerSurge extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.POWER_SURGE,
      cost: 6,
      type: CardType.EVENT,
      tags: [Tag.POWER],

      requirements: {
        tag: Tag.POWER,
        count: 2,
      },

      behavior: {
        stock: {
          energy: 8,
        },
      },

      metadata: {
        cardNumber: 'CHM17',
        description: 'Requires 2 power tags. Gain 8 energy.',
        renderData: CardRenderer.builder((b) => {
          b.energy(8);
        }),
      },
    });
  }
}

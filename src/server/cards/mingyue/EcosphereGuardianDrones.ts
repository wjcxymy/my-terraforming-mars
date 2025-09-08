import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class EcosphereGuardianDrones extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ECOSPHERE_GUARDIAN_DRONES,
      tags: [Tag.POWER, Tag.PLANT],
      cost: 11,

      requirements: {
        tag: Tag.PLANT,
        count: 2,
      },

      behavior: {
        production: {
          energy: -1,
          plants: 2,
        },
      },

      metadata: {
        cardNumber: 'MY19',
        description: 'Requires 2 plant tags. Decrease your energy production 1 step and increase your plant production 2 steps.',
        renderData: CardRenderer.builder((b) => {
          b.text('Opponents may not remove your plants.', Size.SMALL, true).br;
          b.production((pb) => {
            pb.minus().energy(1).plus().plants(2);
          });
        }),
      },
    });
  }
}

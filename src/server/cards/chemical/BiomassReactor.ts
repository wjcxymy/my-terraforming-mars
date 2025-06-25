import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class BiomassReactor extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.BIOMASS_REACTOR,
      cost: 9,
      tags: [Tag.BUILDING, Tag.POWER],

      behavior: {
        stock: {energy: 2},
      },

      action: {
        spend: {plants: 1},
        stock: {energy: 3},
      },

      metadata: {
        cardNumber: 'CHM08',
        description: 'Gain 2 energy.',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 plant to gain 3 energy.', (eb) => {
            eb.plants(1).startAction.energy(3, {digit});
          }).br;
          b.energy(2);
        }),
      },
    });
  }
}

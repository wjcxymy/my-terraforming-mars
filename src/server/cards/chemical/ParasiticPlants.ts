import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {all, digit} from '../Options';

export class ParasiticPlants extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.PARASITIC_PLANTS,
      cost: 4,
      type: CardType.AUTOMATED,
      tags: [Tag.PLANT],

      requirements: {
        temperature: -14,
      },

      behavior: {
        production: {plants: 1},
        removeAnyPlants: 2,
      },

      metadata: {
        cardNumber: 'CHM37',
        description: 'Requires -14°C or warmer. Increase your plant production 1 step and remove up to 2 plants from an opponent.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1)).nbsp.minus().plants(2, {all, digit});
        }),
      },
    });
  }
}

import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class LargePowerPlant extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LARGE_POWER_PLANT,
      cost: 14,
      type: CardType.AUTOMATED,
      tags: [Tag.BUILDING, Tag.POWER],

      behavior: {
        production: {energy: 2},
        stock: {energy: 2},
      },

      metadata: {
        cardNumber: 'CHM15',
        description: 'Increase your energy production 2 steps and gain 2 energy.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(2)).energy(2);
        }),
      },
    });
  }
}

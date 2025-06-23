import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Mixotrophs extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MIXOTROPHS,
      cost: 6,
      type: CardType.AUTOMATED,
      tags: [Tag.MICROBE],

      requirements: {
        tag: Tag.MICROBE,
        count: 1,
      },

      behavior: {
        production: {
          plants: 1,
        },
      },

      metadata: {
        cardNumber: 'CHM13',
        description: 'Requires 1 microbe tag. Increase your plant production 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1));
        }),
      },
    });
  }
}

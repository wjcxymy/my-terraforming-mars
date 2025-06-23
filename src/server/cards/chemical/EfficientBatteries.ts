import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class EfficientBatteries extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.EFFICIENT_BATTERIES,
      cost: 8,
      type: CardType.AUTOMATED,
      tags: [Tag.POWER],

      behavior: {
        production: {energy: {tag: Tag.POWER, per: 2}},
      },

      metadata: {
        cardNumber: 'CHM14',
        description: 'Increase your energy production 1 step for every 2 power tags you have, including this.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.energy(1).slash().tag(Tag.POWER, 2);
          });
        }),
      },
    });
  }
}

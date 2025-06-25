import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class KugelblitzEngine extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.KUGELBLITZ_ENGINE,
      cost: 20,
      type: CardType.ACTIVE,
      tags: [Tag.SCIENCE, Tag.POWER],
      victoryPoints: 2,

      cardDiscount: {tag: Tag.SPACE, amount: 3},

      requirements: {
        tag: Tag.POWER,
        count: 4,
      },

      behavior: {
        production: {
          energy: 4,
        },
      },

      metadata: {
        cardNumber: 'CHM24',
        description: 'Requires 4 power tags. Increase your energy production 4 steps.',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a space card, you pay 3 M€ less for it.', (eb) => {
            eb.tag(Tag.SPACE).startEffect.megacredits(-3);
          }).br;
          b.production((pb) => pb.energy(4, {digit}));
        }),
      },
    });
  }
}

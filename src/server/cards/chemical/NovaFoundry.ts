import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class NovaFoundry extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.NOVA_FOUNDRY,
      cost: 24,
      type: CardType.ACTIVE,
      tags: [Tag.SPACE],
      victoryPoints: 2,

      requirements: {
        tag: Tag.SCIENCE,
        count: 5,
      },

      behavior: {
        titanumValue: 1,
        production: {
          titanium: 2,
          heat: 2,
        },
      },

      metadata: {
        cardNumber: 'CHM23',
        description: 'Requires 5 science tags. Increase your titanium production 2 steps and your heat production 2 steps.',
        renderData: CardRenderer.builder((b) => {
          b.effect('Your titanium resources are worth 1 M€ extra.', (eb) => {
            eb.titanium(1).startEffect.plus(Size.SMALL).megacredits(1);
          }).br;
          b.production((pb) => pb.titanium(2).heat(2));
        }),
      },
    });
  }
}

import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';

export class AquaticBiodomes extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.AQUATIC_BIODOMES,
      cost: 22,
      type: CardType.AUTOMATED,
      tags: [Tag.BUILDING, Tag.PLANT, Tag.ANIMAL],

      requirements: {
        temperature: -10,
      },

      behavior: {
        production: {
          plants: 2,
        },
        ocean: {},
        addResourcesToAnyCard: {
          count: 2,
          type: CardResource.ANIMAL,
        },
      },

      metadata: {
        cardNumber: 'CHM12',
        description: 'Requires -10°C or warmer. Increase your plant production 2 steps, place an ocean tile, and add 2 animals to ANY card.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(2)).br;
          b.oceans(1).resource(CardResource.ANIMAL, 2).asterix();
        }),
      },
    });
  }
}

import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class CallistoOperations extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.CALLISTO_OPERATIONS,
      cost: 25,
      type: CardType.AUTOMATED,
      tags: [Tag.JOVIAN, Tag.SPACE],
      victoryPoints: 1,

      behavior: {
        production: {titanium: 1},
        ocean: {},
      },

      metadata: {
        cardNumber: 'CHM16',
        description: 'Increase your titanium production 1 step and place an ocean tile.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1)).oceans(1);
        }),
      },
    });
  }
}

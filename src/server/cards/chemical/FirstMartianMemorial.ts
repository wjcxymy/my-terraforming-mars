import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

export class FirstMartianMemorial extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.FIRST_MARTIAN_MEMORIAL,
      cost: 5,
      type: CardType.AUTOMATED,
      tags: [Tag.MARS],
      victoryPoints: 1,

      requirements: {
        chairman: true,
      },

      behavior: {
        drawCard: 1,
      },

      metadata: {
        cardNumber: 'CHM30',
        description: 'Requires that you are chairman. Draw a card.',
        renderData: CardRenderer.builder((b) => {
          b.cards(1);
        }),
      },
    });
  }
}

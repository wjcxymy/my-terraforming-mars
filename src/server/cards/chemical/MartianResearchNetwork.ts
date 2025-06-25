import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {all} from '../Options';

export class MartianResearchNetwork extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MARTIAN_RESEARCH_NETWORK,
      cost: 12,
      type: CardType.ACTIVE,
      tags: [Tag.MARS],
      victoryPoints: 1,

      cardDiscount: {amount: 1},

      requirements: {
        tag: Tag.MARS,
        count: 3,
        all,
      },

      metadata: {
        cardNumber: 'CHM31',
        description: 'Requires ANY 3 Mars tags in play.',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a card, you pay 1 M€ less for it.', (eb) => {
            eb.empty().startEffect.megacredits(-1);
          });
        }),
      },
    });
  }
}

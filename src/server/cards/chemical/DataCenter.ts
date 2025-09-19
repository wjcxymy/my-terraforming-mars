import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';

export class DataCenter extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.DATA_CENTER,
      cost: 10,
      type: CardType.AUTOMATED,
      tags: [Tag.EARTH, Tag.MARS],

      behavior: {
        addResourcesToAnyCard: {
          count: 2,
          type: CardResource.DATA,
        },
        drawCard: 2,
      },

      metadata: {
        cardNumber: 'CHM27',
        description: 'Add 2 data to ANY card and draw 2 cards.',
        renderData: CardRenderer.builder((b) => {
          b.resource(CardResource.DATA, 2).asterix().br;
          b.cards(2);
        }),
      },
    });
  }
}

import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class ExpeditionToDione extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.EXPEDITION_TO_DIONE,
      cost: 19,
      type: CardType.EVENT,
      tags: [Tag.SPACE],
      victoryPoints: 1,

      behavior: {
        ocean: {},
        stock: {steel: 2},
      },

      metadata: {
        cardNumber: 'CHM33',
        description: 'Place an ocean tile and gain 2 steel.',
        renderData: CardRenderer.builder((b) => {
          b.oceans(1).steel(2, {digit});
        }),
      },
    });
  }
}

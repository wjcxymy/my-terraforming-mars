import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class SmallSupplyDrop extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SMALL_SUPPLY_DROP,
      cost: 2,
      type: CardType.EVENT,

      behavior: {
        stock: {
          steel: 2,
          plants: 2,
        },
      },

      metadata: {
        cardNumber: 'CHM22',
        description: 'Gain 2 steel and 2 plants.',
        renderData: CardRenderer.builder((b) => {
          b.steel(2, {digit}).plants(2, {digit});
        }),
      },
    });
  }
}

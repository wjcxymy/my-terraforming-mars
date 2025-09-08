import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {all, digit} from '../Options';

export class MinorRimpactor extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MINOR_RIMPACTOR,
      cost: 3,
      type: CardType.EVENT,
      tags: [Tag.SPACE],

      behavior: {
        stock: {heat: 4},
        removeAnyPlants: 2,
      },

      metadata: {
        cardNumber: 'CHM35',
        description: 'Gain 4 heat and remove up to 2 plants from an opponent.',
        renderData: CardRenderer.builder((b) => {
          b.heat(4, {digit}).nbsp.minus().plants(2, {all, digit});
        }),
      },
    });
  }
}

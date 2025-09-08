import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class EcologicalShipment extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.ECOLOGICAL_SHIPMENT,
      tags: [Tag.EARTH, Tag.SPACE],
      cost: 25,

      behavior: {
        stock: {plants: 5},
        addResourcesToAnyCard: [
          {type: CardResource.MICROBE, count: 3},
          {type: CardResource.ANIMAL, count: 3},
        ],
      },

      metadata: {
        cardNumber: 'CHM36',
        description: 'Gain 5 plants, add 3 microbes to ANOTHER card, and 3 animals to ANOTHER card.',
        renderData: CardRenderer.builder((b) => {
          b.plants(5, {digit}).br;
          b.resource(CardResource.MICROBE, {amount: 3, digit}).asterix().nbsp;
          b.resource(CardResource.ANIMAL, {amount: 3, digit}).asterix();
        }),
      },
    });
  }
}

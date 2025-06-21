import {IProjectCard} from '../../IProjectCard';
import {Card} from '../../Card';
import {CardType} from '../../../../common/cards/CardType';
import {Tag} from '../../../../common/cards/Tag';
import {CardName} from '../../../../common/cards/CardName';

export class SpeciesCryopreservation extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.SPECIES_CRYOPRESERVATION,
      cost: 4,
      tags: [Tag.SCIENCE, Tag.ANIMAL],
      victoryPoints: 1,

      requirements: {
        tag: Tag.ANIMAL,
        count: 2,
      },

      metadata: {
        cardNumber: 'MY20',
        description: 'Requires 2 animal tags.',
      },
    });
  }
}

import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class ExpansionOfPopulation extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.EXPANSION_OF_POPULATION,
      cost: 10,
      type: CardType.AUTOMATED,
      tags: [Tag.PLANT, Tag.ANIMAL],

      behavior: {
        spend: {plants: 3},
        addResourcesToAnyCard: {count: 3, type: CardResource.ANIMAL, mustHaveCard: true},
      },

      metadata: {
        cardNumber: 'MY14',
        description: 'Spend 3 plants to add 3 animals to ANY card.',
        renderData: CardRenderer.builder((b) => {
          b.minus().plants(3, {digit}).nbsp.plus().resource(CardResource.ANIMAL, {amount: 3, digit}).asterix();
        }),
      },
    });
  }
}

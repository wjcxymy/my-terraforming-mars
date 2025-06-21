import {Card} from '../../Card';
import {CardName} from '../../../../common/cards/CardName';
import {CardType} from '../../../../common/cards/CardType';
import {Tag} from '../../../../common/cards/Tag';
import {IProjectCard} from '../../IProjectCard';
import {CardRenderer} from '../../render/CardRenderer';
import {CardResource} from '../../../../common/CardResource';

export class NearMissRotaryAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.NEAR_MISS_ROTARY_ASTEROID,
      cost: 14,
      type: CardType.EVENT,
      tags: [Tag.SPACE],
      victoryPoints: 1,

      behavior: {
        global: {venus: 1},
        addResourcesToAnyCard: {count: 1, type: CardResource.ASTEROID},
      },

      metadata: {
        cardNumber: 'MY16',
        description: 'Raise Venus 1 step and add an asteroid to ANY card.',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).resource(CardResource.ASTEROID).asterix();
        }),
      },
    });
  }
}

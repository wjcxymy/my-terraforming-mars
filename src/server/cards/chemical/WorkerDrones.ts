import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class WorkerDrones extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.WORKER_DRONES,
      cost: 8,
      type: CardType.AUTOMATED,
      tags: [Tag.VENUS, Tag.SCIENCE],

      behavior: {
        addResourcesToAnyCard: {count: 2, tag: Tag.VENUS},
      },

      metadata: {
        cardNumber: 'CHM28',
        description: 'Add 2 resource to ANY Venus CARD.',
        renderData: CardRenderer.builder((b) => {
          b.wild(2, {secondaryTag: Tag.VENUS});
        }),
      },
    });
  }
}

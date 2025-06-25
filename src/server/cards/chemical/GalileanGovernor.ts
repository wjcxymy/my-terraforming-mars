import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class GalileanGovernor extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.GALILEAN_GOVERNOR,
      cost: 4,
      type: CardType.AUTOMATED,
      tags: [Tag.JOVIAN],

      requirements: {
        tag: Tag.JOVIAN,
        count: 2,
      },

      behavior: {
        production: {
          megacredits: 2,
        },
      },

      metadata: {
        cardNumber: 'CHM25',
        description: 'Requires 2 Jovian tags. Increase your M€ production 2 steps.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2));
        }),
      },
    });
  }
}

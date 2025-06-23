import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Crowdfunding extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.CROWDFUNDING,
      cost: 3,
      type: CardType.AUTOMATED,
      tags: [Tag.EARTH],

      behavior: {
        production: {
          megacredits: {tag: Tag.EARTH, per: 2},
        },
      },

      metadata: {
        cardNumber: 'CHM18',
        description: 'Increase your M€ production 1 step for every 2 Earth tags you have, including this.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1).slash().tag(Tag.EARTH, 2));
        }),
      },
    });
  }
}

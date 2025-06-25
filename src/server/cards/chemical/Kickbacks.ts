import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Kickbacks extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.KICKBACKS,
      cost: 1,
      type: CardType.AUTOMATED,
      victoryPoints: -1,

      requirements: {
        chairman: true,
      },

      behavior: {
        production: {megacredits: 2},
        stock: {megacredits: 3},
      },

      metadata: {
        cardNumber: 'CHM29',
        description: 'Requires that you are chairman. Increase your M€ production 2 steps and gain 3 M€.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).megacredits(3);
        }),
      },
    });
  }
}

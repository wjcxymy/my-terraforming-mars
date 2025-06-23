import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class ConstructionCenter extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.CONSTRUCTION_CENTER,
      cost: 26,
      type: CardType.ACTIVE,
      tags: [Tag.BUILDING, Tag.CITY],

      cardDiscount: {tag: Tag.BUILDING, amount: 2},

      behavior: {
        production: {
          energy: -1,
          megacredits: 3,
        },
        city: {},
      },

      metadata: {
        cardNumber: 'CHM19',
        description: 'Decrease your energy production 1 step, increase your M€ production 3 steps, and place a city tile.',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a building card, you pay 2 M€ less for it.', (eb) => {
            eb.tag(Tag.BUILDING).startEffect.megacredits(-2);
          }).br;
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          }).nbsp.city();
        }),
      },
    });
  }
}

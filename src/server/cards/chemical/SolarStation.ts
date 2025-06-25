import {IProjectCard} from '../IProjectCard';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class SolarStation extends ActionCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.SOLAR_STATION,
      cost: 13,
      type: CardType.ACTIVE,
      tags: [Tag.SCIENCE, Tag.SPACE],
      victoryPoints: 1,

      requirements: {
        tag: Tag.SCIENCE,
        count: 4,
      },

      action: {
        drawCard: 1,
      },

      behavior: {
        production: {
          heat: 1,
        },
        stock: {
          heat: 3,
        },
      },

      metadata: {
        cardNumber: 'CHM26',
        description: 'Requires 4 science tags. Increase your heat production 1 step and gain 3 heat.',
        renderData: CardRenderer.builder((b) => {
          b.action('Draw a card.', (eb) => {
            eb.empty().startAction.cards(1);
          }).br;
          b.production((pb) => pb.heat(1)).heat(3, {digit});
        }),
      },
    });
  }
}

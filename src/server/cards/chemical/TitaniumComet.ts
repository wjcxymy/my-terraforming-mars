import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {all, digit} from '../Options';

export class TitaniumComet extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.TITANIUM_COMET,
      cost: 28,
      type: CardType.EVENT,
      tags: [Tag.SPACE],

      behavior: {
        global: {temperature: 1},
        ocean: {},
        stock: {titanium: 3},
        removeAnyPlants: 3,
      },

      metadata: {
        cardNumber: 'CHM32',
        description: 'Raise the temperature 1 step, place an ocean tile, gain 3 titanium, and remove up to 3 plants from any player.',
        renderData: CardRenderer.builder((b) => {
          b.temperature(1).oceans(1).br;
          b.titanium(3, {digit}).br;
          b.minus().plants(3, {digit, all});
        }),
      },
    });
  }
}

import {Card} from '../../Card';
import {CardName} from '../../../../common/cards/CardName';
import {CardType} from '../../../../common/cards/CardType';
import {Tag} from '../../../../common/cards/Tag';
import {IProjectCard} from '../../IProjectCard';
import {CardRenderer} from '../../render/CardRenderer';
import {all} from '../../Options';

export class HighSpeedComet extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.HIGH_SPEED_COMET,
      cost: 27,
      type: CardType.EVENT,
      tags: [Tag.SPACE],

      behavior: {
        global: {temperature: 2},
        ocean: {},
        removeAnyPlants: 5,
      },

      metadata: {
        cardNumber: 'MY17',
        description: 'Raise the temperature 2 steps and place an ocean tile, Remove up to 5 plants from any player.',
        renderData: CardRenderer.builder((b) => {
          b.temperature(2).br;
          b.oceans(1).br;
          b.minus().plants(-5, {all});
        }),
      },
    });
  }
}

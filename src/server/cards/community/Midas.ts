import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class Midas extends CorporationCard {
  constructor({
    name = CardName.MIDAS,
    startingMegaCredits = 120,

    behavior = {
      tr: -7,
    },

    metadata = {
      cardNumber: 'R41',
      description: 'You start with 120 M€. Lower your TR 7 steps.',
      renderData: CardRenderer.builder((b) => {
        b.vSpace(Size.LARGE).br;
        b.megacredits(120, {size: Size.LARGE}).nbsp.nbsp.nbsp;
        b.minus().tr(7);
      }),
    },
  } = {}) {
    super({
      name,
      startingMegaCredits,

      behavior,

      metadata,
    });
  }
}

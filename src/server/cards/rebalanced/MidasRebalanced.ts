import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Midas} from '../community/Midas';
import {digit} from '../Options';

export class MidasRebalanced extends Midas {
  constructor() {
    super({
      name: CardName.MIDAS_REBALANCED,
      startingMegaCredits: 100,

      behavior: {
        tr: -4,
      },

      metadata: {
        cardNumber: 'RB-CORP-11',
        description: 'You start with 100 M€. Lower your TR 4 steps.',
        renderData: CardRenderer.builder((b) => {
          b.vSpace(Size.LARGE).br;
          b.megacredits(100, {size: Size.LARGE}).nbsp.nbsp.nbsp;
          b.minus().tr(4, {digit});
        }),
      },
    });
  }
}

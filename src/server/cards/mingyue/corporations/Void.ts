import {CorporationCard} from '../../corporation/CorporationCard';
import {CardName} from '../../../../common/cards/CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Size} from '../../../../common/cards/render/Size';

export class Void extends CorporationCard {
  constructor() {
    super({
      name: CardName.VOID,
      startingMegaCredits: 70,

      metadata: {
        cardNumber: 'MY-CORP-14',
        description: 'You start with 70 M€.',
        renderData: CardRenderer.builder((b) => {
          b.vSpace(Size.LARGE).br;
          b.megacredits(70, {size: Size.LARGE});
        }),
      },
    });
  }
}

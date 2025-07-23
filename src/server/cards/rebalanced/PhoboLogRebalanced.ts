import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {digit} from '../Options';

export class PhoboLogRebalanced extends CorporationCard {
  constructor() {
    super({
      name: CardName.PHOBOLOG_REBALANCED,
      tags: [Tag.SPACE],
      startingMegaCredits: 30,

      behavior: {
        stock: {titanium: 8},
        titanumValue: 1,
      },

      metadata: {
        cardNumber: 'RB-CORP-15',
        description: 'You start with 8 titanium and 30 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(30).nbsp.titanium(8, {digit});
          b.corpBox('effect', (ce) => {
            ce.effect('Your titanium resources are each worth 1 M€ extra.', (eb) => {
              eb.titanium(1).startEffect.plus(Size.SMALL).megacredits(1);
            });
          });
        }),
      },
    });
  }
}

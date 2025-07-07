import {IPlayer} from '../../IPlayer';
import {CardRenderer} from '../render/CardRenderer';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from '../corporation/CorporationCard';

export class Aristarchus extends CorporationCard {
  constructor() {
    super({
      name: CardName.ARISTARCHUS,
      tags: [Tag.VENUS, Tag.EARTH, Tag.JOVIAN],
      startingMegaCredits: 33,

      metadata: {
        cardNumber: 'R51',
        description: 'You start with 33 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br.br.br;
          b.megacredits(33);
          b.corpBox('action', (ce) => {
            ce.vSpace();
            ce.action('If you have exactly 0 M€, gain 10 M€.', (eb) => {
              eb.empty().startAction.megacredits(10).asterix();
            });
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.megaCredits === 0;
  }

  public action(player: IPlayer) {
    player.megaCredits += 10;
    return undefined;
  }
}

import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Thorgate} from '../corporation/Thorgate';
import {IPlayer} from '../../../server/IPlayer';
import {Resource} from '../../../common/Resource';
import {Size} from '../../../common/cards/render/Size';

export class ThorgateRebalanced extends Thorgate {
  constructor() {
    super({
      name: CardName.THORGATE_REBALANCED,
      tags: [Tag.POWER],
      startingMegaCredits: 42,

      behavior: {
        production: {energy: 2},
      },
      cardDiscount: {tag: Tag.POWER, amount: 2},

      metadata: {
        cardNumber: 'RB-CORP-03',
        description: 'You start with 2 energy production and 42 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.production((pb) => pb.energy(2)).nbsp.megacredits(42);
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.action('gain 1 M€ for each power tag you have.', (ab) => {
              ab.empty().startAction.megacredits(1).slash().tag(Tag.POWER);
            });
            ce.effect('When playing a power card, you pay 2 M€ less for it.', (eb) => {
              eb.tag(Tag.POWER).startEffect.megacredits(-2);
            });
          });
        }),
      },
    });
  }

  public canAct(_player: IPlayer): boolean {
    return true;
  }

  public action(player: IPlayer) {
    player.stock.add(Resource.MEGACREDITS, player.tags.count(Tag.POWER), {log: true});
  }
}

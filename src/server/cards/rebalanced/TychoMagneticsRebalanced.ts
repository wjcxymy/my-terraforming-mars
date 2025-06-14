import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';
import {IPlayer} from '../../IPlayer';
import {SelectAmount} from '../../inputs/SelectAmount';
import {TychoMagnetics} from '../promo/TychoMagnetics';
import {Size} from '../../../common/cards/render/Size';

const ENERGY_PER_EXTRA_KEEP = 5;

export class TychoMagneticsRebalanced extends TychoMagnetics {
  constructor() {
    super({
      name: CardName.TYCHO_MAGNETICS_REBALANCED,
      behavior: {
        stock: {energy: 1},
        production: {energy: 1},
      },

      metadata: {
        cardNumber: 'RB-CORP-07',
        description: 'You start with 42 M€, 1 energy and 1 energy production.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(42).energy(1).production((pb) => pb.energy(1));
          b.corpBox('action', (cb) => {
            cb.vSpace(Size.LARGE);
            cb.action(
              'Spend any amount of energy to draw that many cards. Keep 1 and discard the rest. (For every additional ' +
              ENERGY_PER_EXTRA_KEEP +
              ' energy spent, excluding the first, you may keep 1 more.)', (ab) => {
                ab.text('X').energy(1).startAction.text('X').cards(1).text('KEEP 1 +<br>⌊(X - 1) ÷ 5⌋', Size.SMALL, true);
              });
          });
        }),
      },
    });
  }

  public override action(player: IPlayer) {
    const max = Math.min(player.energy, player.game.projectDeck.size());
    return new SelectAmount('Select amount of energy to spend', 'OK', 1, max)
      .andThen((amount) => {
        player.stock.deduct(Resource.ENERGY, amount);
        player.game.log('${0} spent ${1} energy', (b) => b.player(player).number(amount));
        if (amount === 1) {
          player.drawCard();
          return undefined;
        }
        const keepCount = 1 + Math.floor((amount - 1) / ENERGY_PER_EXTRA_KEEP);
        player.drawCardKeepSome(amount, {keepMax: keepCount});
        return undefined;
      });
  }
}

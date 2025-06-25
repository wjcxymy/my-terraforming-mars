import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../../server/IPlayer';
import {DecreaseAnyProduction} from '../../../server/deferredActions/DecreaseAnyProduction';
import {Resource} from '../../../common/Resource';
import {all} from '../Options';

export class PowerFailure extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.POWER_FAILURE,
      cost: 1,
      type: CardType.EVENT,

      metadata: {
        cardNumber: 'CHM20',
        description: 'Decrease any energy production 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1, {all});
          });
        }),
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer) {
    const eligiblePlayers = player.game.getPlayers().filter((p) => p.production.energy > 0);
    if (eligiblePlayers.length === 1 && eligiblePlayers[0] === player) {
      this.warnings.add('selfTarget');
    }
    return true;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new DecreaseAnyProduction(
      player,
      Resource.ENERGY,
      {count: 1, stealing: true},
    ));
    return undefined;
  }
}

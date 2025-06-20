import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Resource} from '../../../common/Resource';
import {Pristar} from '../turmoil/Pristar';

export class PristarRebalanced extends Pristar {
  constructor() {
    super({
      name: CardName.PRISTAR_REBALANCED,

      metadata: {
        cardNumber: 'RB-CORP-08',
        description: 'You start with 53 M€. Decrease your TR 2 steps. 1 VP per preservation resource here.',

        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(53).minus().tr(2, {size: Size.SMALL});
          b.corpBox('effect', (ce) => {
            ce.effect('During production phase, if you did not get TR so far this generation, or if you have the lowest TR, add one preservation resource here and gain 6 M€.', (eb) => {
              eb.tr(1, {size: Size.SMALL, cancelled: true}).asterix().startEffect.resource(CardResource.PRESERVATION).megacredits(6);
            });
          });
        }),
      },
    });
  }

  public override onProductionPhase(player: IPlayer) {
    const playerTR = player.getTerraformRating();
    const isLowestTR = player.getOpponents().every((op) => op.getTerraformRating() > playerTR);

    if (!player.hasIncreasedTerraformRatingThisGeneration || isLowestTR) {
      player.stock.add(Resource.MEGACREDITS, 6, {log: true, from: this});
      player.addResourceTo(this, 1);
    }
    return undefined;
  }
}

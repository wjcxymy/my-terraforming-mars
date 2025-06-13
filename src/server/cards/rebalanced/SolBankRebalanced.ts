import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';
import {SolBank} from '../pathfinders/SolBank';
import {Resource} from '../../../common/Resource';
import {Size} from '../../../common/cards/render/Size';

export class SolBankRebalanced extends SolBank {
  constructor() {
    super({
      name: CardName.SOLBANK_REBALANCED,
      metadata: {
        cardNumber: 'RB-CORP-05',
        description: 'You start with 40 M€',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(40);
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect('Whenever you spend M€ (or steel or titanium) add 1 data to this card.', (eb) => {
              eb.minus().megacredits(1).slash().steel(1).slash().titanium(1).startEffect.resource(CardResource.DATA);
            });
            ce.action('convert each data from this card into 1M€ each.', (ab) => {
              ab.resource(CardResource.DATA).startAction.megacredits(1);
            });
          });
        }),
      },
    });
  }

  // Behavior is in PathfindersExpansion.addToSolBank.
  public override onProductionPhase(_player: IPlayer): undefined {
    return undefined;
  }

  public canAct(_player: IPlayer): boolean {
    return this.resourceCount > 0;
  }

  public action(player: IPlayer) {
    player.stock.add(Resource.MEGACREDITS, this.resourceCount, {log: true});
    this.resourceCount = 0;
  }
}

import {IActionCard} from '../ICard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {MAX_VENUS_SCALE} from '../../../common/constants';
import {CardName} from '../../../common/cards/CardName';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {max} from '../Options';
import {LogHelper} from '../../../server/LogHelper';

const ACTION_COST = 6;
export class RotatorImpacts extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.ROTATOR_IMPACTS,
      type: CardType.ACTIVE,
      tags: [Tag.SPACE],
      cost: 6,
      resourceType: CardResource.ASTEROID,

      requirements: {venus: 14, max},
      metadata: {
        cardNumber: '243',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 6 M€ to add an asteroid resource to this card [TITANIUM MAY BE USED].', (eb) => {
            eb.megacredits(6).super((b) => b.titanium(1)).startAction.resource(CardResource.ASTEROID);
          }).br;
          b.action('Spend 1 resource from this card to increase Venus 1 step.', (eb) => {
            eb.or().resource(CardResource.ASTEROID).startAction.venus(1);
          });
        }),
        description: 'Venus must be 14% or lower',
      },
    });
  }

  private canAddResource(player: IPlayer) {
    return player.canAfford({cost: ACTION_COST, titanium: true});
  }

  private canSpendResource(player: IPlayer) {
    return this.resourceCount > 0 && player.canAfford({cost: 0, tr: {venus: 1}});
  }

  public canAct(player: IPlayer): boolean {
    if (player.game.getVenusScaleLevel() === MAX_VENUS_SCALE) {
      this.warnings.add('maxvenus');
    }
    return this.canAddResource(player) || this.canSpendResource(player);
  }

  public action(player: IPlayer) {
    const options = new OrOptions();

    if (this.canSpendResource(player)) {
      const increaseVenusOption = new SelectOption('Remove 1 asteroid to raise Venus 1 step').andThen(() => {
        player.removeResourceFrom(this, 1, {log: false});
        player.game.increaseVenusScaleLevel(player, 1);
        LogHelper.logRemoveResource(player, this, 1, 'increase Venus scale 1 step');
        return undefined;
      });
      if (player.game.getVenusScaleLevel() === MAX_VENUS_SCALE) {
        increaseVenusOption.warnings = ['maxvenus'];
      }
      options.options.push(increaseVenusOption);
    }

    if (this.canAddResource(player)) {
      options.options.push(
        new SelectOption('Spend 6 M€ to add 1 asteroids here').andThen(() => {
          player.game.defer(new SelectPaymentDeferred(player, ACTION_COST, {canUseTitanium: true})).andThen(() => {
            player.addResourceTo(this, {qty: 1, log: true});
          });
          return undefined;
        }));
    }

    if (options.options.length === 0) {
      return undefined;
    }
    if (options.options.length === 1) {
      return options.options[0].cb();
    }
    return options;
  }
}

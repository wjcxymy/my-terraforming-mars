import {IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {LogHelper} from '../../LogHelper';
import {SelectCard} from '../../inputs/SelectCard';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {CardRenderer} from '../render/CardRenderer';

const ACTION_COST = 1;
export class AsteroidRights extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ASTEROID_RIGHTS,
      tags: [Tag.EARTH, Tag.SPACE],
      cost: 10,
      resourceType: CardResource.ASTEROID,

      behavior: {
        addResources: 2,
      },

      metadata: {
        cardNumber: 'X34',
        description: 'Add 2 asteroids to this card.',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 M€ to add 1 asteroid to ANY card.', (eb) => {
            eb.megacredits(1).startAction.resource(CardResource.ASTEROID).asterix().nbsp.or();
          }).br;
          b.action('Spend 1 asteroid here to increase M€ production 1 step OR gain 2 titanium.', (eb) => {
            eb.resource(CardResource.ASTEROID)
              .startAction.production((pb) => pb.megacredits(1))
              .or()
              .titanium(2);
          }).br;
          b.resource(CardResource.ASTEROID, 2);
        }),
      },
    });
  }

  private canAddAsteroid(player: IPlayer) {
    return player.canAfford({cost: ACTION_COST});
  }

  private canSpendAsteroid() {
    return this.resourceCount > 0;
  }

  public canAct(player: IPlayer): boolean {
    return this.canAddAsteroid(player) || this.canSpendAsteroid();
  }

  public action(player: IPlayer) {
    const options = new OrOptions();

    const gainTitaniumOption = new SelectOption('Remove 1 asteroid on this card to gain 2 titanium', 'Remove asteroid').andThen(() => {
      player.removeResourceFrom(this, 1, {log: false});
      player.stock.add(Resource.TITANIUM, 2, {log: false });
      LogHelper.logRemoveResource(player, this, 1, 'gain 2 titanium');
      return undefined;
    });

    const increaseMcProdOption = new SelectOption('Remove 1 asteroid on this card to increase M€ production 1 step', 'Remove asteroid').andThen(() => {
      player.removeResourceFrom(this, 1, {log: false});
      player.production.add(Resource.MEGACREDITS, 1, {log: false });
      LogHelper.logRemoveResource(player, this, 1, 'increase M€ production 1 step');
      return undefined;
    });

    const addAsteroidToAnyCard = new SelectOption('Pay 1 M€ to add 1 asteroid to a card', 'Pay').andThen(() => this.addAsteroidToAnyCard(player));

    // Spend asteroid
    if (this.canSpendAsteroid()) {
      options.options.push(gainTitaniumOption);
      options.options.push(increaseMcProdOption);
    }

    // Add asteroid to any card
    if (this.canAddAsteroid(player)) {
      options.options.push(addAsteroidToAnyCard);
    }

    if (options.options.length === 0) {
      return undefined;
    }
    if (options.options.length === 1) {
      return options.options[0].cb();
    }
    return options;
  }

  private addAsteroidToAnyCard(player: IPlayer) {
    const asteroidCards = player.getResourceCards(CardResource.ASTEROID);
    player.game.defer(new SelectPaymentDeferred(player, ACTION_COST, {title: 'Select how to pay for asteroid'}));

    if (asteroidCards.length === 1) {
      player.addResourceTo(this, {qty: 1, log: true});
      return undefined;
    }

    return new SelectCard(
      'Select card to add 1 asteroid',
      'Add asteroid',
      asteroidCards)
      .andThen(([card]) => {
        player.addResourceTo(card, {qty: 1, log: true});
        return undefined;
      });
  }
}

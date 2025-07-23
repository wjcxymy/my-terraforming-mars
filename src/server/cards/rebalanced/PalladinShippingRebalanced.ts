import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {all, digit} from '../Options';
import {IPlayer} from '../../IPlayer';
import {IProjectCard} from '../IProjectCard';
import {Resource} from '../../../common/Resource';
import {IActionCard} from '../ICard';
import {Behavior} from '../../behavior/Behavior';
import {getBehaviorExecutor} from '../../behavior/BehaviorExecutor';
import {Size} from '../../../common/cards/render/Size';

export class PalladinShippingRebalanced extends CorporationCard implements IActionCard {
  constructor() {
    super({
      name: CardName.PALLADIN_SHIPPING_REBALANCED,
      tags: [Tag.SPACE],
      startingMegaCredits: 36,

      behavior: {
        stock: {titanium: 5},
      },

      metadata: {
        cardNumber: 'RB-CORP-16',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(36).titanium(5, {digit});
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect('When any player plays a space event, gain 1 titanium.', (eb) => {
              eb.tag(Tag.SPACE, {all}).tag(Tag.EVENT, {all}).startEffect.titanium(1);
            });
            ce.action('Spend 2 titanium to raise the temperature 1 step.', (ab) => {
              ab.titanium(2).startAction.temperature(1);
            });
          });
        }),
        description: 'You start with 36 M€. Gain 5 titanium.',
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard) {
    if (card.type === CardType.EVENT && card.tags.includes(Tag.SPACE)) {
      player.stock.add(Resource.TITANIUM, 1, {log: true});
    }
  }

  public canAct(player: IPlayer) {
    return getBehaviorExecutor().canExecute(PalladinShippingRebalanced.actionBehavior, player, this);
  }

  private static actionBehavior: Behavior = {
    spend: {titanium: 2},
    global: {temperature: 1},
  };

  public action(player: IPlayer) {
    getBehaviorExecutor().execute(PalladinShippingRebalanced.actionBehavior, player, this);
    return undefined;
  }
}

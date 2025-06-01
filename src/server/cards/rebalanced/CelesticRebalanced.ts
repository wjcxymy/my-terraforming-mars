import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {ICard} from '../ICard';
import {Resource} from '../../../common/Resource';
import {Celestic} from '../venusNext/Celestic';
import {Size} from '../../../common/cards/render/Size';

export class CelesticRebalanced extends Celestic {
  constructor() {
    super({
      name: CardName.CELESTIC_REBALANCED,
      metadata: {
        cardNumber: 'RB-CORP-04',
        description: 'You start with 42 M€. As your first action, reveal cards from the deck until you have revealed 2 cards with a floater icon on it. Take them into hand and discard the rest.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(42).nbsp.cards(2, {secondaryTag: AltSecondaryTag.FLOATER});
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.action('Add a floater to ANY card. 1 VP per 3 floaters on this card.', (eb) => {
              eb.empty().startAction.resource(CardResource.FLOATER).asterix();
            });
            ce.effect('When you gain an floater to ANY CARD, gain 1 M€.', (eb) => {
              eb.resource(CardResource.FLOATER).asterix().startEffect.megacredits(1);
            });
          });
        }),
      },
    });
  }

  public onResourceAdded(player: IPlayer, card: ICard, count: number) {
    if (card.resourceType === CardResource.FLOATER) {
      player.stock.add(Resource.MEGACREDITS, count, {log: true});
    }
  }
}

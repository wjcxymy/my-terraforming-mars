import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {ActiveCorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {Size} from '../../../common/cards/render/Size';
import {Resource} from '../../../common/Resource';
import {ICard} from '../ICard';
import {CardType} from '../../../common/cards/CardType';

export class CelesticRebalanced extends ActiveCorporationCard {
  constructor() {
    super({
      name: CardName.CELESTIC_REBALANCED,
      tags: [Tag.VENUS],
      startingMegaCredits: 42,
      resourceType: CardResource.FLOATER,

      victoryPoints: {resourcesHere: {}, per: 3},

      firstAction: {
        text: 'Draw a floater card',
        drawCard: {count: 1, type: CardType.ACTIVE, resource: CardResource.FLOATER},
      },

      action: {
        addResourcesToAnyCard: {
          type: CardResource.FLOATER,
          count: 1,
          autoSelect: true,
        },
      },

      metadata: {
        cardNumber: 'RB-CORP-04',
        description: 'You start with 42 M€. As your first action, draw a floater card.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(42).nbsp.cards(1, {secondaryTag: AltSecondaryTag.FLOATER});
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

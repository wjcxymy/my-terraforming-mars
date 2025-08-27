import {ICorporationCard} from '../corporation/ICorporationCard';
import {ICard} from '../ICard';
import {CorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {IProjectCard} from '../IProjectCard';
import {Size} from '../../../common/cards/render/Size';
import {IStandardProjectCard} from '../IStandardProjectCard';

export class AdhaiHighOrbitConstructionsRebalanced extends CorporationCard {
  constructor() {
    super({
      name: CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS_REBALANCED,
      tags: [Tag.SPACE],
      startingMegaCredits: 43,
      resourceType: CardResource.ORBITAL,

      metadata: {
        cardNumber: 'RB-CORP-09',
        description: 'You start with 43 M€.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(43);
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect('Whenever you play a card with a space tag (including this) add 1 orbital on this card.', (eb) => {
              eb.tag(Tag.SPACE).startEffect.resource(CardResource.ORBITAL);
            });
            ce.effect('For every 2 orbitals on this card, cards with a space tag or the STANDARD COLONY PROJECT or TRADE ACTION costs 1M€ less.', (eb) => {
              eb.tag(Tag.SPACE).slash().colonies(1, {size: Size.SMALL}).slash().trade({size: Size.SMALL})
                .startEffect
                .megacredits(-1).slash().text('2').resource(CardResource.ORBITAL);
            });
          });
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    this.onCardPlayed(player, this);
    return undefined;
  }

  public onCorpCardPlayed(player: IPlayer, card: ICorporationCard) {
    this.onCardPlayed(player, card);
  }

  public onCardPlayed(player: IPlayer, card: ICard) {
    if (player.isCorporation(CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS_REBALANCED) && card.tags.includes(Tag.SPACE)) {
      player.addResourceTo(this, {qty: 1, log: true});
    }
  }

  public override getCardDiscount(player: IPlayer, card: IProjectCard) {
    if (player.isCorporation(CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS_REBALANCED) && card.tags.includes(Tag.SPACE)) {
      return Math.floor(this.resourceCount / 2);
    } else {
      return 0;
    }
  }

  public getStandardProjectDiscount(_player: IPlayer, card: IStandardProjectCard): number {
    if (card.name === CardName.BUILD_COLONY_STANDARD_PROJECT) {
      return Math.floor(this.resourceCount / 2);
    }
    return 0;
  }
}

import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {CorporationCard} from '../corporation/CorporationCard';
import {IActionCard} from '../ICard';
import {SelectCard} from '../../../server/inputs/SelectCard';
import {Payment} from '../../../common/inputs/Payment';

export class OdysseyRebalanced extends CorporationCard implements IActionCard {
  constructor() {
    super({
      name: CardName.ODYSSEY_REBALANCED,
      startingMegaCredits: 33,

      metadata: {
        cardNumber: 'RB-CORP-06',
        description: 'You start with 33 M€.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(33);
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.MEDIUM);
            ce.effect('Your event cards stay face up, and their tags are in use as if those were automated (green) cards.', (eb) => {
              eb.empty().startEffect.cards(1, {secondaryTag: Tag.EVENT}).text('up').asterix();
            });
            ce.action('Play for free an event card you have already played that has a base cost of 16M€ or less (INCLUDING events that place special tiles,) after which discard that card.', (eb) => {
              eb.empty().startAction.tag(Tag.EVENT).asterix().nbsp.text('≤').nbsp.megacredits(16);
            });
          });
        }),
      },
    });
  }

  // For Project Inspection
  private checkLoops: number = 0;

  public getCheckLoops(): number {
    return this.checkLoops;
  }

  public availableEventCards(player: IPlayer) {
    this.checkLoops++;
    try {
      const array = [];
      for (const card of player.playedCards) {
        // Special case Price Wars, which is not easy to work with.
        if (card.name === CardName.PRICE_WARS) {
          continue;
        }
        if (card.type === CardType.EVENT && card.cost <= 16) {
          const details = card.canPlayPostRequirements(player);
          if (details !== false) {
            array.push({card, details});
          }
        }
      }
      return array;
    } finally {
      this.checkLoops--;
    }
  }

  public canAct(player: IPlayer) {
    return this.availableEventCards(player).length > 0;
  }

  public action(player: IPlayer) {
    const eventCards = this.availableEventCards(player);
    return new SelectCard('选择1张事件牌免费打出', '打出', eventCards.map((e) => e.card), {min: 1, max: 1})
      .andThen((cards) => {
        const card = cards[0];
        player.removedFromPlayCards.push(card);
        player.playCard(card, Payment.EMPTY, 'discard');
        return undefined;
      });
  }
}

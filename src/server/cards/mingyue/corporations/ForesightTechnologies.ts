import {CorporationCard} from '../../corporation/CorporationCard';
import {CardName} from '../../../../common/cards/CardName';
import {Tag} from '../../../../common/cards/Tag';
import {CardRenderer} from '../../render/CardRenderer';
import {IPlayer} from '../../../IPlayer';
import {LogHelper} from '../../../LogHelper';

const LOOK_COUNT = 10;

export class ForesightTechnologies extends CorporationCard {
  constructor() {
    super({
      name: CardName.FORESIGHT_TECHNOLOGIES,
      tags: [Tag.SCIENCE],
      startingMegaCredits: 48,

      metadata: {
        cardNumber: 'MY-CORP-10',
        description: 'You start with 48 M€.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(48);
          b.corpBox('action', (cb) => {
            cb.action(`Look at the top ${LOOK_COUNT} cards of the deck.`, (eb) => {
              eb.empty().startAction.text('look at').nbsp.cards(LOOK_COUNT).asterix();
            });
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.game.projectDeck.drawPile.length > 0;
  }

  public action(player: IPlayer): void {
    const available = Math.min(LOOK_COUNT, player.game.projectDeck.drawPile.length);
    const cards = player.game.projectDeck.drawPile.slice(-available).reverse();
    LogHelper.logLookedAtCards(player, cards, /* privateMessage= */ true);
  }
}

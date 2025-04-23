import { CorporationCard } from '../corporation/CorporationCard';
import { CardName } from '../../../common/cards/CardName';
import { CardRenderer } from '../render/CardRenderer';
import { IActionCard, ICard, isIActionCard, isIHasCheckLoops } from '../ICard';
import { IPlayer } from '../../IPlayer';
import { SelectCard } from '../../inputs/SelectCard';

export class TestUnlimitedCorp extends CorporationCard {
  constructor() {
    super({
      name: CardName.TEST_UNLIMITED_CORP,
      tags: [],
      startingMegaCredits: 1000,
      metadata: {
        cardNumber: 'MY-CORP-04',
        description: 'Test corp with unlimited actions and test tools.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1000);
        }),
      },
    });
  }

  public canAct(): boolean {
    return true;
  }
  
  // This matches Viron.getActionCards.
  private getActionCards(player: IPlayer): Array<IActionCard & ICard> {
    const result = [];
    for (const playedCard of player.tableau) {
      if (playedCard === this) {
        continue;
      }
      if (!isIActionCard(playedCard)) {
        continue;
      }
      if (isIHasCheckLoops(playedCard) && playedCard.getCheckLoops() >= 2) {
        continue;
      }
      if (player.actionsThisGeneration.has(playedCard.name) && playedCard.canAct(player)) {
        result.push(playedCard);
      }
    }
    return result;
  }

  public action(player: IPlayer) {
    if (this.getActionCards(player).length === 0 ) {
      return undefined;
    }

    return new SelectCard(
      'Perform again an action from a played card',
      'Take action',
      this.getActionCards(player))
      .andThen(([card]) => {
        player.game.log('${0} used ${1} action with ${2}', (b) => b.player(player).card(card).card(this));
        return card.action(player);
      });
  }
}

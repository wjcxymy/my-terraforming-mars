import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';
import {ChooseCards} from '../../deferredActions/ChooseCards';
import {digit} from '../Options';
import {ActionCard} from '../ActionCard';

export class ProjectReorganization extends ActionCard implements IProjectCard {
  private static readonly ENERGY_COST = 2;

  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PROJECT_REORGANIZATION,
      tags: [Tag.BUILDING, Tag.SCIENCE],
      cost: 15,
      victoryPoints: 1,

      action: {},

      metadata: {
        cardNumber: 'MY01',
        renderData: CardRenderer.builder((b) => {
          b.action(
            'Spend 2 energy to look at the top 4 cards of the discard pile. Keep 1 and return the rest in order.',
            (eb) => eb.energy(ProjectReorganization.ENERGY_COST, {digit}).startAction.text('4').cards(1).asterix(),
          );
        }),
      },
    });
  }

  public override bespokeCanAct(player: IPlayer): boolean {
    return player.energy >= ProjectReorganization.ENERGY_COST &&
           player.game.projectDeck.discardPile.length > 0;
  }

  public override bespokeAction(player: IPlayer) {
    player.stock.deduct(Resource.ENERGY, ProjectReorganization.ENERGY_COST);
    player.game.log('${0} spent ${1} energy', (b) => b.player(player).number(ProjectReorganization.ENERGY_COST));

    const selectedCards = [];
    for (let idx = 0; idx < 4 && player.game.projectDeck.discardPile.length > 0; idx++) {
      const card = player.game.projectDeck.discardPile.pop();
      if (card) {
        selectedCards.push(card);
      }
    }

    const keepCount = Math.min(1, selectedCards.length);
    player.game.defer(new ChooseCards(player, selectedCards, {keepMax: keepCount}));

    return undefined;
  }
}

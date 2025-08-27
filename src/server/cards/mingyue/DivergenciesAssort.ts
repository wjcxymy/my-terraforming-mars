import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';
import {IPlayer} from '../../../server/IPlayer';
import {SelectCard} from '../../../server/inputs/SelectCard';
import {DrawCards} from '../../../server/deferredActions/DrawCards';
import {all} from '../Options';

export class DivergenciesAssort extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.DIVERGENCIES_ASSORT,
      tags: [Tag.SCIENCE],
      cost: 12,
      victoryPoints: 1,
      requirements: {tag: Tag.SCIENCE, count: 2},

      action: {},

      metadata: {
        cardNumber: 'MY10',
        description: 'Requires 2 science tags.',
        renderData: CardRenderer.builder((b) => {
          b.action(
            'Draw the top 2 cards of the deck. Keep at most 1 of them.',
            (eb) => {
              eb.empty().startAction.cards(2).asterix();
            },
          ).br;
          b.plainEffect('If you kept any, all other players draw 1 card.', (eb) => {
            eb.cards(1).startEffect.cards(1, {all});
          });
        }),
      },
    });
  }

  public override bespokeCanAct(player: IPlayer): boolean {
    return player.game.projectDeck.canDraw(2);
  }

  public override bespokeAction(player: IPlayer) {
    const game = player.game;
    const cards = game.projectDeck.drawNOrThrow(game, 2);
    game.resettable = false;

    return new SelectCard('Select 1 card to keep or none', undefined, cards, {min: 0, max: 1})
      .andThen((selected) => {
        const kept = new Set(selected);
        const discarded = cards.filter((card) => !kept.has(card));

        if (selected.length === 1) {
          player.cardsInHand.push(...selected);
          game.log(
            '${0} kept a card during the action of ${1}.',
            (b) => b.player(player).card(this),
          );

          for (const opponent of player.getOpponents()) {
            game.defer(DrawCards.keepAll(opponent));
            game.log(
              '${0} drew a card due to the action of ${1}.',
              (b) => b.player(opponent).card(this),
            );
          }
        } else {
          game.log(
            '${0} kept no cards during the action of ${1}.',
            (b) => b.player(player).card(this),
          );
        }

        for (const card of discarded) {
          game.projectDeck.discard(card);
          game.log('${0} was discarded.', (b) => b.card(card), {reservedFor: player});
        }

        return undefined;
      });
  }
}

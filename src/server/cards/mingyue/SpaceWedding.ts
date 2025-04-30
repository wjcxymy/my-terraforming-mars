import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardRenderer} from '../render/CardRenderer';
import {SelectCard} from '../../inputs/SelectCard';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {Priority} from '../../deferredActions/Priority';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {message} from '../../logs/MessageBuilder';
import {all} from '../Options';
import {LogHelper} from '../../../server/LogHelper';
import {Tag} from '../../../common/cards/Tag';

export class SpaceWedding extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.SPACE_WEDDING,
      tags: [Tag.EARTH, Tag.SPACE],
      cost: 12,
      victoryPoints: 2,
      metadata: {
        cardNumber: 'MY04',
        renderData: CardRenderer.builder((b) =>
          b.cards(1).cards(1, {all}).asterix(),
        ),
        description: 'Reveal 2 cards. Keep one and give the other to another player.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    return player.game.projectDeck.canDraw(2);
  }

  public override bespokePlay(player: IPlayer) {
    const cards = player.game.projectDeck.drawByConditionOrThrow(player.game, 2, () => true);
    LogHelper.logDrawnCards(player, cards);
    player.game.defer(new SelectWeddingCard(player, cards));
    return undefined;
  }
}

class SelectWeddingCard extends DeferredAction {
  constructor(player: IPlayer, private cards: IProjectCard[]) {
    super(player, Priority.DRAW_CARDS);
  }

  public execute() {
    return new SelectCard('Select a card to keep', 'Keep', this.cards).andThen(([kept]) => {
      const other = this.cards.find((c) => c !== kept);
      if (!other) throw new Error('Expected to find another card');
      const assuredOther = other as IProjectCard;
      this.player.cardsInHand.push(kept);

      const game = this.player.game;
      game.log('${0} kept ${1}', (b) => b.player(this.player).card(kept));

      const otherPlayers = this.player.getOpponents();

      if (otherPlayers.length === 0) {
        game.projectDeck.discard(assuredOther);
        game.log('No other players. ${0} was discarded.', (b) => b.card(assuredOther));
        return undefined;
      }

      const options = new OrOptions();
      otherPlayers.forEach((target) => {
        options.options.push(new SelectOption(
          message('Give ${0} to ${1}', (b) => b.card(assuredOther).player(target)),
        ).andThen(() => {
          target.cardsInHand.push(assuredOther);
          game.log('${0} gave ${1} to ${2}', (b) => b.player(this.player).card(assuredOther).player(target));
          return undefined;
        }));
      });

      return options;
    });
  }
}

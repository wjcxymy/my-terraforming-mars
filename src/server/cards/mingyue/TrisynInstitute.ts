import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CorporationCard} from '../corporation/CorporationCard';
import {ICard} from '../ICard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardType} from '../../../common/cards/CardType';
import {Size} from '../../../common/cards/render/Size';
import {SelectCard} from '../../inputs/SelectCard';
import {PlayerInput} from '../../../server/PlayerInput';
import { LogHelper } from '../../../server/LogHelper';

export class TrisynInstitute extends CorporationCard {

  private lastComboCount = 0;

  constructor() {
    super({
      name: CardName.TRISYN_INSTITUTE,
      tags: [Tag.SCIENCE],
      startingMegaCredits: 48,

      metadata: {
        cardNumber: 'MY-CORP-01',
        description: 'You start with 48 M€.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(48);

          b.corpBox('action', (cb) => {
            cb.vSpace(Size.LARGE);
            cb.action('Reveal and discard 2 cards to draw 1 card of a color not among the discarded ones.', (eb) => {
              eb.minus().cards(2).startAction.plus().cards(1).asterix();
            });
            cb.vSpace(Size.SMALL);
            cb.effect('After you play a project card, if this completes a new set of red, green, and blue project cards, draw 1 card.', (eb) => {
              eb.text('new<br>set', Size.SMALL, true)
                .one_set().asterix().startEffect.cards(1);
            });
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.cardsInHand.length >= 2;
  }

  public action(player: IPlayer) {
    // 检查玩家手牌是否至少有2张
    if (player.cardsInHand.length < 2) return undefined;

    // 调用 discard2AndDrawRemainingColor 进行弃牌和抽卡操作
    return this.discard2AndDrawRemainingColor(player);
  }

  // 弃2张不同颜色的牌并抽1张剩余颜色的牌
  public discard2AndDrawRemainingColor(player: IPlayer) {
    return new SelectCard('Select 2 cards to discard', 'Discard', player.cardsInHand, {min: 2, max: 2})
      .andThen((cards) => {
        // 判断弃掉的卡的颜色
        const type1 = cards[0].type;
        const type2 = cards[1].type;

        // 添加弃牌日志
        player.game.log('${0} discarded 2 cards using their ${1} action.', (b) => b.player(player).card(this));
        LogHelper.logDiscardedCards(player.game, cards);

        // 执行弃牌
        player.discardCardFromHand(cards[0]);
        player.discardCardFromHand(cards[1]);

        // 判断颜色是否不同
        if (type1 !== type2) {
          return this.drawRemainingColor(player, type1, type2); // 弃2色，抽剩余1色
        } else {
          return this.drawRandomFromRemaining(player, type1); // 弃同色卡，随机抽剩余2色中的1张
        }
      });
  }

  // 抽剩余颜色的卡
  private drawRemainingColor(player: IPlayer, type1: CardType, type2: CardType): PlayerInput | undefined {
    const types = [CardType.EVENT, CardType.AUTOMATED, CardType.ACTIVE];
    const remaining = types.filter((t) => t !== type1 && t !== type2);
    const remainingType = remaining[0];
    player.drawCard(1, {cardType: remainingType}); // 返回抽卡操作
    return undefined;
  }

  // 抽随机剩余的卡
  private drawRandomFromRemaining(player: IPlayer, discardedType: CardType): PlayerInput | undefined {
    const types = [CardType.EVENT, CardType.AUTOMATED, CardType.ACTIVE];
    const remaining = types.filter((t) => t !== discardedType);
    const randomType = remaining[Math.floor(Math.random() * remaining.length)];
    player.drawCard(1, {cardType: randomType}); // 返回抽卡操作
    return undefined;
  }

  public onCardPlayed(player: IPlayer, card: ICard) {
    if (!player.isCorporation(this.name)) return;

    // 判断是否为项目卡
    if (card.type !== CardType.AUTOMATED && card.type !== CardType.ACTIVE && card.type !== CardType.EVENT) return;

    const red = player.playedCards.filter((c) => c.type === CardType.EVENT).length;
    const green = player.playedCards.filter((c) => c.type === CardType.AUTOMATED).length;
    const blue = player.playedCards.filter((c) => c.type === CardType.ACTIVE).length;

    const currentComboCount = Math.min(red, green, blue);

    if (currentComboCount > this.lastComboCount) {
      this.lastComboCount = currentComboCount;
      player.game.log(
        '收集了 ${0} 套红绿蓝卡牌，抽 1 张牌',
        (b) => b.number(currentComboCount)
      );
      player.drawCard(1);
    }
  }
}

import {CorporationCard} from '../../corporation/CorporationCard';
import {CardName} from '../../../../common/cards/CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {IActionCard, ICard, isIActionCard, isIHasCheckLoops} from '../../ICard';
import {IPlayer} from '../../../IPlayer';
import {SelectCard} from '../../../inputs/SelectCard';
import {OrOptions} from '../../../inputs/OrOptions';
import {SelectOption} from '../../../inputs/SelectOption';
import {SelectAmount} from '../../../inputs/SelectAmount';
import {ChooseCards} from '../../../deferredActions/ChooseCards';
import {GainResources} from '../../../inputs/GainResources';
import {Size} from '../../../../common/cards/render/Size';
import {Payment} from '../../../../common/inputs/Payment';
import {message} from '../../../../server/logs/MessageBuilder';

export class GoldenFinger extends CorporationCard {
  constructor() {
    super({
      name: CardName.GOLDEN_FINGER,
      tags: [],
      startingMegaCredits: 999,
      metadata: {
        cardNumber: 'MY-CORP-04',
        description: '可无限执行公司行动，内含测试工具。',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(999, {size: Size.LARGE});
        }),
      },
    });
  }

  public canAct(): boolean {
    return true;
  }

  private getActionCards(player: IPlayer): Array<IActionCard & ICard> {
    const result: Array<IActionCard & ICard> = [];
    for (const playedCard of player.tableau) {
      if (playedCard === this) continue;
      if (!isIActionCard(playedCard)) continue;
      if (isIHasCheckLoops(playedCard) && playedCard.getCheckLoops() >= 2) continue;
      if (player.actionsThisGeneration.has(playedCard.name) && playedCard.canAct(player)) {
        result.push(playedCard);
      }
    }
    return result;
  }

  public action(player: IPlayer) {
    // 行动 1：获得任意标准资源
    const gainResource = new SelectOption('获得任意标准资源', 'Gain').andThen(() => {
      return new SelectAmount('输入要获得的资源总数', '确定', 1, 1000, true).andThen((amount) => {
        return new GainResources(player, amount, '获得任意标准资源');
      });
    });

    // 行动 2：摸 X 张牌
    const drawCards = new SelectOption('摸 X 张牌', 'Draw').andThen(() => {
      return new SelectAmount('输入要摸的牌数', '确定', 1, 1000, true).andThen((amount) => {
        player.drawCard(amount);
        player.game.log('${0} 摸了 ${1} 张牌', (b) => b.player(player).number(amount));
        return undefined;
      });
    });

    // 行动 3：展示牌堆顶 X 张牌，保留 1 张
    const revealDeck = new SelectOption('展示牌堆顶 X 张牌，保留 1 张', 'Reveal').andThen(() => {
      return new SelectAmount('输入要展示的牌数（最多保留1张）', '确定', 1, 1000, true).andThen((amount) => {
        player.drawCardKeepSome(amount, {keepMax: 1});
        return undefined;
      });
    });

    // 行动 4：展示弃牌堆顶 X 张牌，保留 1 张
    const revealDiscardPile = new SelectOption('展示弃牌堆顶 X 张牌，保留 1 张', 'Reveal').andThen(() => {
      return new SelectAmount('输入要展示的牌数（最多保留1张）', '确定', 1, 1000, true).andThen((amount) => {
        const selectedCards = [];
        for (let idx = 0; idx < amount && player.game.projectDeck.discardPile.length > 0; idx++) {
          const card = player.game.projectDeck.discardPile.pop();
          if (card) {
            selectedCards.push(card);
          }
        }

        const keepCount = Math.min(1, selectedCards.length);
        player.game.defer(new ChooseCards(player, selectedCards, {keepMax: keepCount}));
        return undefined;
      });
    });

    // 行动 5：再次使用蓝卡行动
    const useBlueCard = new SelectOption('执行任意蓝卡行动', 'Use card action').andThen(() => {
      const actionCards = this.getActionCards(player);
      if (actionCards.length === 0) {
        player.game.log('${0} 没有可用的蓝卡行动', (b) => b.player(player));
        return undefined;
      }

      return new SelectCard(
        '选择一个已使用过的蓝卡来再次行动',
        '使用',
        actionCards,
      ).andThen(([card]) => {
        player.game.log('${0} 使用了 ${1} 的行动（来自 ${2}）', (b) =>
          b.player(player).card(card).card(this),
        );
        return card.action(player);
      });
    });

    // 行动 6：展示牌堆顶所有牌，保留 x 张
    const revealDeckAll = new SelectOption('展示牌堆顶所有牌，保留 x 张', 'Reveal').andThen(() => {
      return new SelectAmount('输入要保留的牌数', '确定', 1, 1000, false).andThen((amount) => {
        player.drawCardKeepSome(1000, {keepMax: amount});
        return undefined;
      });
    });

    // 行动 7：从手牌中无视所有条件免费打出一张牌
    const playCard = new SelectOption('从手牌中无视所有条件免费打出一张牌', 'play Card').andThen(() => {
      return new SelectCard('从手牌中无视所有条件免费打出一张牌', '打出', player.cardsInHand, {min: 1, max: 1, played: false})
        .andThen((cards) => {
          const card = cards[0];
          player.playCard(card, Payment.EMPTY, 'add');
          return undefined;
        });
    });

    // 行动 8：从手牌中选一张交给其他玩家
    const giveCardToOpponent = new SelectOption('从手牌中选一张交给其他玩家', 'Give Card').andThen(() => {
      if (player.getOpponents().length === 0 || player.cardsInHand.length === 0) {
        return undefined;
      }
      return new SelectCard('选择一张手牌', '选择', player.cardsInHand, {min: 1, max: 1, played: false})
        .andThen((cards) => {
          const card = cards[0];
          const options = new OrOptions();
          player.getOpponents().forEach((opponent) => {
            options.options.push(
              new SelectOption(message('Give ${0} to ${1}', (b) => b.card(card).player(opponent)))
                .andThen(() => {
                  player.cardsInHand = player.cardsInHand.filter((c) => c !== card);
                  opponent.cardsInHand.push(card);
                  player.game.log('${0} gave ${1} to ${2}', (b) => b.player(player).card(card).player(opponent));
                  return undefined;
                }),
            );
          });
          return options;
        });
    });

    // A hack that allows this action to be replayable.
    player.defer(() => {
      player.actionsThisGeneration.delete(this.name);
    });

    return new OrOptions(
      useBlueCard,
      playCard,
      revealDeck,
      revealDeckAll,
      revealDiscardPile,
      drawCards,
      gainResource,
      giveCardToOpponent,
    );
  }
}

import {CorporationCard} from '../../corporation/CorporationCard';
import {CardName} from '../../../../common/cards/CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {IPlayer} from '../../../IPlayer';
import {getAbnormalTitanData} from '../../../../server/mingyue/MingYueData';
import {SelectCard} from '../../../../server/inputs/SelectCard';
import {IProjectCard} from '../../IProjectCard';
import {CardType} from '../../../../common/cards/CardType';
import {Resource} from '../../../../common/Resource';

export class AbnormalTitan extends CorporationCard {
  constructor() {
    super({
      name: CardName.ABNORMAL_TITAN,
      startingMegaCredits: 54,

      metadata: {
        cardNumber: 'MY-CORP-13',
        description: 'You start with 54 M€.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(54);
          b.corpBox('effect', (cb) => {
            cb.effect(
              'After playing a project card: 1/3 chance to draw a card, 1/3 chance to discard a card from hand, and 1/3 chance gain 1 M€.',
              (eb) => {
                eb.cards(1).startEffect
                  .plus().cards(1).slash()
                  .minus().cards(1).slash()
                  .megacredits(1);
              },
            );
          });
        }),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard) {
    if (!player.isCorporation(this.name)) return;
    if (card.type !== CardType.AUTOMATED && card.type !== CardType.ACTIVE && card.type !== CardType.EVENT) return;

    const game = player.game;
    const data = getAbnormalTitanData(game);

    let result: string;
    const rand = Math.random();
    game.resettable = false;

    // 先决定结果并记录
    if (rand < 1 / 3) {
      data.nothing += 1;
      result = '1 M€';
      player.stock.add(Resource.MEGACREDITS, 1, {log: true});
    } else if (rand < 2 / 3) {
      data.draw += 1;
      result = 'draw';
      player.drawCard(1);
    } else {
      data.discard += 1;
      result = 'discard';
    }

    // 打印日志（统计一定执行）
    game.log(
      '${0} triggered ${1} effect → ' + result + ' (Total: Draw-${2} / Discard-${3} / 1 M€-${4})',
      (b) => b.player(player).card(this).number(data.draw).number(data.discard).number(data.nothing),
    );

    // 如果是弃牌且手牌不为空，再异步选择
    if (result === 'discard' && player.cardsInHand.length > 0) {
      return new SelectCard('Select a card to discard', 'Discard', player.cardsInHand)
        .andThen(([card]) => {
          player.discardCardFromHand(card, {log: true});
          return undefined;
        });
    }

    return undefined;
  }
}

import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {ICard} from '../ICard';
import {CardRenderer} from '../render/CardRenderer';
import {Payment} from '../../../common/inputs/Payment';
import {Resource} from '../../../common/Resource';

export class ResourcePlanningBureau extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.RESOURCE_PLANNING_BUREAU,
      tags: [Tag.BUILDING, Tag.SPACE],
      cost: 12,
      victoryPoints: 1,

      metadata: {
        cardNumber: 'MY03',
        renderData: CardRenderer.builder((b) => {
          b.effect('Each time you play a project card, if you pay 0 M€ and at least 1 other resource, gain 2 M€.', (eb) =>
            eb.cards(1).text('pay')
              .megacredits(1, {text: '0'}).wild(1).asterix()
              .startEffect
              .megacredits(2),
          );
        }),
      },
    });
  }

  // TUDO:仅使用自我复制机器人打出时，存在bug，payment未记录该信息
  public onCardPlayedWithPayment(player: IPlayer, card: ICard, payment: Payment): void {
    if (![CardType.AUTOMATED, CardType.ACTIVE, CardType.EVENT].includes(card.type)) return;

    // 确保支付的 M€ 为 0，且支付了至少1个其他资源
    if (payment.megaCredits === 0 && Object.values(payment).some((value) => value > 0)) {
      const gain = 2;

      player.stock.add(Resource.MEGACREDITS, gain, {log: false});
      player.game.log(
        '${0} gained ${1} M€ from ${2} effect.',
        (b) => b.player(player).number(gain).card(this),
      );
    }
  }
}

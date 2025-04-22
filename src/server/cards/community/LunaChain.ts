import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardType} from '../../../common/cards/CardType';
import {ICard} from '../ICard';
import {IPlayer} from '../../IPlayer';
import {Payment} from '../../../common/inputs/Payment';

export class LunaChain extends CorporationCard {
  private lastProjectCardMegacreditCost: number | undefined;
  private lunaChainTotalGain: number = 0;
  private lunaChainProjectCardCount: number = 0;

  constructor() {
    super({
      name: CardName.LUNA_CHAIN,
      tags: [Tag.EARTH],
      startingMegaCredits: 48,

      metadata: {
        cardNumber: 'MY-CORP-02',
        description: 'You start with 48 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br.megacredits(48);
          b.corpBox('effect', (cb) => {
            cb.effect(
              'When the actual paid M€ of your current and previous project cards differ by X (X < 3), gain (3 - X) M€.',
              (eb) => {
                eb.cards(1).megacreditsText('M').minus().megacreditsText('N').text('<3').startEffect.megacreditsText('3-X').asterix();
              }
            );
          });
        }),
      },
    });
  }

  public onCardPlayedWithPayment(player: IPlayer, card: ICard, payment: Payment): void {
    if (!player.isCorporation(this.name)) return;
    if (![CardType.AUTOMATED, CardType.ACTIVE, CardType.EVENT].includes(card.type)) return;

    const actualCost = payment.megaCredits ?? 0;
    this.lunaChainProjectCardCount += 1;

    if (this.lastProjectCardMegacreditCost !== undefined) {
      const diff = Math.abs(actualCost - this.lastProjectCardMegacreditCost);

      if (diff < 3) {
        const gain = 3 - diff;
        player.megaCredits += gain;
        this.lunaChainTotalGain += gain;

        player.game.log(
          '${0} gained ${1} M€ due to ${2} effect.',
          (b) => b.player(player).number(gain).card(this)
        );

        const avg = this.lunaChainTotalGain / this.lunaChainProjectCardCount;
        let title = '';

        if (avg >= 2.0) {
          title = 'LunaChain God 🌙';
        } else if (avg >= 1.5) {
          title = 'LunaChain Baker 🍰';
        } else if (avg >= 1.0) {
          title = 'LunaChain Champion 💪';
        } else {
          title = 'LunaChain Newbie 🥬';
        }

        player.game.log(
          '${0} has accumulated ${1} M€, averaging ${2} M€ per project card (' + title + ')',
          (b) => b.player(player).number(this.lunaChainTotalGain).number(parseFloat(avg.toFixed(2)))
        );
      }
    }

    // 更新 lastProjectCardMegacreditCost 为当前卡的实际费用
    this.lastProjectCardMegacreditCost = actualCost;

    player.game.log(
      'The next card costs ${0} M€ to maximize the LunaChain skill',
      (b) => b.number(actualCost)
    );
  }
}

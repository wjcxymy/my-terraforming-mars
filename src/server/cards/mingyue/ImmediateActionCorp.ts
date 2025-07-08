import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {ICard, isIActionCard} from '../ICard';
import {IPlayer} from '../../IPlayer';
import {OrOptions} from '../../../server/inputs/OrOptions';
import {SelectOption} from '../../../server/inputs/SelectOption';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {Resource} from '../../../common/Resource';
import {Size} from '../../../common/cards/render/Size';

export class ImmediateActionCorp extends CorporationCard {
  constructor() {
    super({
      name: CardName.IMMEDIATE_ACTION_CORP,
      tags: [],
      startingMegaCredits: 48,
      metadata: {
        cardNumber: 'MY-CORP-11',
        description: 'You start with 48 M€.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(48);
          b.corpBox('effect', (cb) => {
            cb.vSpace(Size.MEDIUM);
            cb.effect('When you play a blue card with an action, you may immediately use its action (without spending it)', (eb) =>
              eb.cards(1, {secondaryTag: AltSecondaryTag.BLUE})
                .text('(').arrow().text(')')
                .startEffect
                .quickArrow()
                .asterix(),
            );
            cb.effect('When you play a blue card, gain 1 M€.', (eb) =>
              eb.cards(1, {secondaryTag: AltSecondaryTag.BLUE})
                .startEffect
                .megacredits(1),
            );
          });
        }),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: ICard) {
    if (!player.isCorporation(this.name)) {
      // player.game.log('【调试】onCardPlayed: 不是本公司，跳过');
      return;
    }

    if (card.type !== CardType.ACTIVE) {
      // player.game.log(`【调试】onCardPlayed: ${card.name} 不是蓝卡，跳过`);
      return;
    }

    player.stock.add(Resource.MEGACREDITS, 1, {log: true});

    if (!isIActionCard(card)) {
      player.game.log(`【调试】onCardPlayed: ${card.name} 没有行动，跳过`);
      return;
    }

    if (!card.canAct(player)) {
      player.game.log(`【调试】onCardPlayed: ${card.name} 当前不能行动，跳过`);
      return;
    }

    player.game.log(`【调试】onCardPlayed: ${card.name} 符合条件，提供立即行动选项`);

    const orOptions = new OrOptions();

    orOptions.options.push(
      new SelectOption(`immediately use ${card.name} action (without spending it)`, 'use').andThen(() => {
        player.game.log('${0} used ${1} action (via ${2})', (b) =>
          b.player(player).card(card).card(this),
        );
        return card.action(player);
      }),
    );

    orOptions.options.push(new SelectOption('skip'));

    return orOptions;
  }
}

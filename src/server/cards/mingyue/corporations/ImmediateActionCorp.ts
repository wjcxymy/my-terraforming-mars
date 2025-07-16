import {CorporationCard} from '../../corporation/CorporationCard';
import {CardName} from '../../../../common/cards/CardName';
import {CardType} from '../../../../common/cards/CardType';
import {CardRenderer} from '../../render/CardRenderer';
import {IActionCard, ICard, isIActionCard} from '../../ICard';
import {IPlayer} from '../../../IPlayer';
import {OrOptions} from '../../../inputs/OrOptions';
import {SelectOption} from '../../../inputs/SelectOption';
import {AltSecondaryTag} from '../../../../common/cards/render/AltSecondaryTag';
import {Resource} from '../../../../common/Resource';
import {Size} from '../../../../common/cards/render/Size';
import {DeferredAction} from '../../../../server/deferredActions/DeferredAction';
import {Priority} from '../../../../server/deferredActions/Priority';
import {message} from '../../../../server/logs/MessageBuilder';

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
    if (!player.isCorporation(this.name)) return;
    if (card.type !== CardType.ACTIVE) return;

    player.stock.add(Resource.MEGACREDITS, 1, {log: true});

    if (!isIActionCard(card)) return;

    player.game.defer(new UseActionImmediately(player, card, this));
  }
}

class UseActionImmediately extends DeferredAction {
  constructor(
    player: IPlayer,
    private card: IActionCard & ICard,
    private source: ICard,
  ) {
    super(player, Priority.BACK_OF_THE_LINE);
  }

  public execute() {
    if (!this.card.canAct(this.player)) return undefined;

    const options = new OrOptions();
    options.options.push(
      new SelectOption(
        message(
          'immediately use ${0} action (without spending it)',
          (b) => b.card(this.card),
        ),
        'use',
      ).andThen(() => {
        this.player.game.log(
          '${0} used ${1} action (via ${2})',
          (b) => b.player(this.player).card(this.card).card(this.source),
        );
        return this.card.action(this.player);
      }),
    );

    options.options.push(new SelectOption('skip'));
    return options;
  }
}

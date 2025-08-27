import {Tag} from '../../../../common/cards/Tag';
import {CorporationCard} from '../../corporation/CorporationCard';
import {CardName} from '../../../../common/cards/CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {IPlayer} from '../../../IPlayer';
import {all} from '../../Options';
import {Resource} from '../../../../common/Resource';
import {Size} from '../../../../common/cards/render/Size';

export class Tithes extends CorporationCard {
  constructor() {
    super({
      name: CardName.TITHES,
      tags: [Tag.EARTH],
      startingMegaCredits: 42,
      metadata: {
        cardNumber: 'MY-CORP-03',
        description: 'You start with 42 M€.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(42);
          b.corpBox('action', (cb) => {
            cb.vSpace(Size.LARGE);
            cb.action(
              'Each other player loses 10% (rounded down) of their M€. You gain the total amount lost.',
              (eb) => {
                eb
                  .empty()
                  .startAction
                  .minus().megacredits(1, {text: 'X', all})
                  .nbsp.plus().megacredits(1, {text: 'ΣX'})
                  .asterix();
              },
            );
            cb.vSpace(Size.SMALL);
            cb.plainEffect(
              'Each other player who loses 3 M€ or more due to this action draws 1 card.',
              (eb) => {
                eb
                  .megacredits(1, {text: 'X', all}).text('>=').megacredits(3, {all})
                  .startEffect.cards(1, {all})
                  .asterix();
              },
            );
          });
        }),
      },
    });
  }

  public canAct(): boolean {
    return true;
  }

  public action(player: IPlayer): void {
    if (!player.isCorporation(this.name)) return;

    const opponents = player.getOpponents();
    let totalStolen = 0;

    for (const opponent of opponents) {
      const amount = Math.floor(opponent.megaCredits / 10);

      if (amount > 0) {
        opponent.attack(player, Resource.MEGACREDITS, amount, {stealing: true, log: false});
        totalStolen += amount;

        if (amount >= 3) {
          opponent.drawCard(1);
          player.game.log(
            '${0} paid ${1} M€ in ${2} and draws 1 card.',
            (b) => b.player(opponent).number(amount).card(this),
          );
        } else {
          player.game.log(
            '${0} paid ${1} M€ in ${2}.',
            (b) => b.player(opponent).number(amount).card(this),
          );
        }
      }
    }

    if (totalStolen > 0) {
      player.game.log(
        '${0} collected a total of ${1} M€ via ${2}.',
        (b) => b.player(player).number(totalStolen).card(this),
      );
    }
  }
}

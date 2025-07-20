import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CorporationCard} from '../corporation/CorporationCard';
import {Resource} from '../../../common/Resource';
import {Size} from '../../../common/cards/render/Size';

export class HelionRebalanced extends CorporationCard {
  constructor() {
    super({
      name: CardName.HELION_REBALANCED,
      tags: [Tag.SPACE],
      startingMegaCredits: 42,

      behavior: {
        production: {heat: 3},
      },

      metadata: {
        cardNumber: 'RB-CORP-13',
        description: 'You start with 3 heat production and 42 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.production((pb) => pb.heat(3)).nbsp.megacredits(42);
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.MEDIUM);
            ce.effect('Heat may be used as 1 M€ each. M€ may not be used as heat.', (eb) => {
              eb.startEffect.text('x').heat(1).equals().megacredits(1, {text: 'x'});
            });
            ce.effect('For every 2 heat you spend, gain 1 M€.', (eb) => {
              eb.text('2x').heat(1).startEffect.megacredits(1, {text: 'x'});
            });
          });
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.canUseHeatAsMegaCredits = true;
    return undefined;
  }

  public onStandardResourceSpent(player: IPlayer, resource: Resource, amount: number) {
    if (resource === Resource.HEAT && amount >= 2) {
      const gain = Math.floor(amount / 2);
      player.stock.add(Resource.MEGACREDITS, gain, {log: false});
      player.game.log(
        '${0} gained ${1} M€ via ${2} (spent ${3} heat)',
        (b) => b.player(player).number(gain).card(this).number(amount),
      );
    }
  }
}

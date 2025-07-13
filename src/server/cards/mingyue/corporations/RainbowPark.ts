import {CorporationCard} from '../../corporation/CorporationCard';
import {CardName} from '../../../../common/cards/CardName';
import {Tag} from '../../../../common/cards/Tag';
import {CardRenderer} from '../../render/CardRenderer';
import {IPlayer} from '../../../IPlayer';
import {ResourceTypeRequirement} from '../../../../server/cards/requirements/ResourceTypeRequirement';
import {Resource} from '../../../../common/Resource';

export class RainbowPark extends CorporationCard {
  constructor() {
    super({
      name: CardName.RAINBOW_PARK,
      tags: [Tag.WILD],
      startingMegaCredits: 48,

      metadata: {
        cardNumber: 'MY-CORP-09',
        description: 'You start with 48 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.megacredits(48);
          b.corpBox('action', (cb) => {
            cb.action(
              'Gain M€ equal to the number of different resource types you have.',
              (eb) => {
                eb.empty().startAction.megacreditsText('X')
                  .nbsp.text('(').text('have').nbsp.text('X').wild(1).asterix().text(')');
              },
            );
          });
        }),
      },
    });
  }

  public canAct(_player: IPlayer): boolean {
    return true;
  }

  public action(player: IPlayer) {
    // 计算资源种类数量
    const gainAmount = new ResourceTypeRequirement().getScore(player);
    player.stock.add(Resource.MEGACREDITS, gainAmount);

    player.game.log(
      '${0} took ${1} action and gained ${2} M€.',
      (b) => b.player(player).card(this).number(gainAmount),
    );
  }
}

import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';

export class InstantiatedSolarFlare extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.INSTANTIATED_SOLAR_FLARE,
      cost: 11,
      type: CardType.EVENT,
      tags: [Tag.SPACE],
      victoryPoints: -1,

      requirements: {
        tag: Tag.SCIENCE,
        count: 3,
      },

      behavior: {
        global: {temperature: 2},
      },

      metadata: {
        cardNumber: 'CHM34',
        description: 'Requires 3 science tags. Raise the temperature 2 steps and each player loses 2 plants.',
        renderData: CardRenderer.builder((b) => {
          b.temperature(2).br;
          b.minus().plants(2, {all}).asterix();
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    for (const p of player.game.getPlayers()) {
      if (!p.plantsAreProtected()) {
        // Botanical Experience reduces the impact in half.
        if (p.cardIsInEffect(CardName.BOTANICAL_EXPERIENCE)) {
          p.stock.deduct(Resource.PLANTS, 1, {log: true, from: player});
        } else {
          p.stock.deduct(Resource.PLANTS, 2, {log: true, from: player});
        }
      }
    }

    return undefined;
  }
}

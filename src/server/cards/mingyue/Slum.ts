import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer, CanAffordOptions} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {Board} from '../../boards/Board';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';

export class Slum extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.SLUM,
      cost: 6,
      type: CardType.AUTOMATED,
      tags: [Tag.CITY, Tag.BUILDING],
      victoryPoints: -1,

      behavior: {
        production: {energy: -1},
      },

      metadata: {
        cardNumber: 'MY15',
        description: 'Decrease your energy production 1 step. Place a city tile ADJACENT TO AT LEAST 1 OTHER CITY TILE.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1);
          }).city().asterix();
        }),
      },
    });
  }

  private getAvailableSpaces(player: IPlayer, canAffordOptions?: CanAffordOptions): Array<Space> {
    return player.game.board.getAvailableSpacesOnLand(player, canAffordOptions)
      .filter((space) => player.game.board.getAdjacentSpaces(space).some((adjacentSpace) => Board.isCitySpace(adjacentSpace)));
  }

  public override bespokeCanPlay(player: IPlayer, canAffordOptions: CanAffordOptions): boolean {
    return this.getAvailableSpaces(player, canAffordOptions).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new PlaceCityTile(player, {
      title: 'Select space adjacent to a city tile',
      spaces: this.getAvailableSpaces(player),
    }));
    return undefined;
  }
}

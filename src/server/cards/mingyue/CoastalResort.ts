import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {TileType} from '../../../common/TileType';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {CanAffordOptions, IPlayer} from '../../../server/IPlayer';
import {Space} from '../../../server/boards/Space';
import {Board} from '../../../server/boards/Board';
import {PlaceTile} from '../../../server/deferredActions/PlaceTile';
import {Size} from '../../../common/cards/render/Size';

export class CoastalResort extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.COASTAL_RESORT,
      type: CardType.AUTOMATED,
      tags: [Tag.BUILDING, Tag.PLANT],
      cost: 12,

      requirements: {oceans: 1},
      victoryPoints: 'special',
      adjacencyBonus: {bonus: [SpaceBonus.MEGACREDITS]},

      metadata: {
        cardNumber: 'MY18',
        description: 'Requires 1 ocean tile.',
        renderData: CardRenderer.builder((b) => {
          b.tile(TileType.COASTAL_RESORT, false, true);
          b.br;
          b.text('Place this tile adjacent to an ocean tile. This tile grants an ADJACENCY BONUS of 1 M€.', Size.TINY, false, false);
          b.br;
          b.text('If adjacent to a city tile, a greenery tile, and an ocean tile, gain 2 VP.', Size.TINY, false, false);
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.questionmark(),
      },
    });
  }

  /**
   * 获取所有合法放置位置（必须与至少一块海洋相邻）
   */
  public getAvailableSpaces(player: IPlayer, canAffordOptions?: CanAffordOptions): Space[] {
    const board = player.game.board;
    return board.getAvailableSpacesOnLand(player, canAffordOptions).filter(
      (space) => board.getAdjacentSpaces(space).some(Board.isOceanSpace),
    );
  }

  /**
   * 检查当前是否存在合法的放置位置
   */
  public override bespokeCanPlay(player: IPlayer, canAffordOptions: CanAffordOptions): boolean {
    return this.getAvailableSpaces(player, canAffordOptions).length > 0;
  }

  /**
   * 让玩家选择一个与海洋相邻的位置放置该板块
   */
  public override bespokePlay(player: IPlayer) {
    player.game.defer(
      new PlaceTile(player, {
        tile: {tileType: TileType.COASTAL_RESORT, card: this.name},
        on: () => this.getAvailableSpaces(player),
        title: 'Select a space adjacent to an ocean tile',
        adjacencyBonus: this.adjacencyBonus,
      }),
    );
    return undefined;
  }

  /**
   * 若该板块相邻有城市、绿地和海洋各至少一个，则得 2 VP
   */
  public override getVictoryPoints(player: IPlayer): number {
    const board = player.game.board;
    const space = board.getSpaceByTileCard(this.name);
    if (!space) return 0;

    const neighbors = board.getAdjacentSpaces(space);
    const hasCity = neighbors.some(Board.isCitySpace);
    const hasGreenery = neighbors.some(Board.isGreenerySpace);
    const hasOcean = neighbors.some(Board.isOceanSpace);

    return hasCity && hasGreenery && hasOcean ? 2 : 0;
  }
}

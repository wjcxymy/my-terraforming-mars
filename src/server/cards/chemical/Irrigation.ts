import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {Tag} from '../../../common/cards/Tag';
import {TileType} from '../../../common/TileType';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {CanAffordOptions, IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {Board} from '../../boards/Board';
import {PlaceTile} from '../../deferredActions/PlaceTile';

export class Irrigation extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.IRRIGATION,
      cost: 18,
      type: CardType.AUTOMATED,
      tags: [Tag.PLANT, Tag.BUILDING],

      requirements: {
        oceans: 6,
      },

      behavior: {
        global: {oxygen: 1},
      },

      metadata: {
        cardNumber: 'CHM38',
        description: 'Requires 6 ocean tiles. Place a greenery tile ADJACENT TO AN OCEAN and increase oxygen 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.greenery().asterix();
        }),
      },
    });
  }

  /**
   * 获取所有与至少一个海洋板块相邻的可用地块。
   */
  public getAvailableSpaces(player: IPlayer, canAffordOptions?: CanAffordOptions): Space[] {
    const board = player.game.board;
    // 筛选所有合法的陆地地块，只保留那些与海洋相邻的地块。
    return board.getAvailableSpacesOnLand(player, canAffordOptions).filter(
      (space) => board.getAdjacentSpaces(space).some(Board.isOceanSpace),
    );
  }

  /**
   * 仅当存在至少一个可以放置板块的合法地块时，此牌才能被打出。
   */
  public override bespokeCanPlay(player: IPlayer, canAffordOptions: CanAffordOptions): boolean {
    return this.getAvailableSpaces(player, canAffordOptions).length > 0;
  }

  /**
   * 延迟一个 PlaceTile (放置板块) 行动，提示玩家从所有合法地块中进行选择。
   */
  public override bespokePlay(player: IPlayer) {
    player.game.defer(
      new PlaceTile(player, {
        tile: {tileType: TileType.GREENERY, card: this.name},
        on: () => this.getAvailableSpaces(player),
        title: '选择一个与海洋相邻的地块放置绿地',
      }),
    );
    return undefined;
  }
}

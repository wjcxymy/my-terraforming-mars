import { CardName } from '../../../common/cards/CardName';
import { TileType } from '../../../common/TileType';
import { CardRenderer } from '../render/CardRenderer';
import { CardType } from '../../../common/cards/CardType';
import { IProjectCard } from '../IProjectCard';
import { Card } from '../Card';
import { Tag } from '../../../common/cards/Tag';
import { IPlayer } from '../../../server/IPlayer';
import { Space } from '../../../server/boards/Space';
import { BoardType } from '../../../server/boards/BoardType';
import { SpaceType } from '../../../common/boards/SpaceType';
import { Resource } from '../../../common/Resource';
import { all } from '../Options';

export class GamblingDistrictLasVegas extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.GAMBLING_DISTRICT_LAS_VEGAS,
      tags: [Tag.BUILDING, Tag.CITY],
      cost: 20,
      behavior: {
        production: { energy: -1, megacredits: 3 },
        tile: {
          type: TileType.GAMBLING_DISTRICT_LAS_VEGAS,
          on: 'city',
          title: 'Select space for special city tile',
          adjacencyBonus: {
            bonus: [],
            cost: 3,
          },
        },
      },
      metadata: {
        cardNumber: 'MY08',
        renderData: CardRenderer.builder((b) => {
          b.plainEffect('Place this tile. It counts as a City.', (eb) => {
            eb.empty()
              .startEffect.production((pb) => {
                pb.minus().energy(1).plus().megacredits(3);
              })
              .nbsp
              .tile(TileType.GAMBLING_DISTRICT_LAS_VEGAS, false, false);
          });
          b.br;
          b.plainEffect('When a tile is placed adjacent to it, the player must pay 3 M€ more, then roll 1d6 to gain that many M€.', (eb) => {
            eb.megacreditsText("-3", { all })
              .nbsp
              .myXDian()
              .startEffect.megacreditsText("+X", { all });
          });
          b.br;
          b.plainEffect('If the result is 5 or 6, they also draw a card.', (eb) => {
            eb.my5Dian()
              .my6Dian()
              .startEffect.cards(1, { all });
          });
        }),
        description: '',
      },
    });
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space, boardType: BoardType) {
    const game = cardOwner.game;

    // 只在火星上触发，月球和殖民地空间不触发
    if (boardType !== BoardType.MARS || space.spaceType === SpaceType.COLONY) {
      return;
    }

    // 遍历周围格子，检查是否邻接赌城
    const adjacentSpaces = game.board.getAdjacentSpaces(space);
    const isAdjacentToGamblingDistrict = adjacentSpaces.some(
      (adjSpace) => adjSpace.tile?.tileType === TileType.GAMBLING_DISTRICT_LAS_VEGAS
    );

    if (!isAdjacentToGamblingDistrict) {
      return; // 如果不相邻赌场，就啥也不做
    }

    // 投掷骰子（1D6）
    const diceRoll = Math.floor(Math.random() * 6) + 1;

    // 玩家获得等量 M€
    activePlayer.stock.add(Resource.MEGACREDITS, diceRoll);

    // 是否额外抽牌
    const drewCard = diceRoll >= 5;
    if (drewCard) {
      activePlayer.drawCard(1);
    }

    // 日志记录
    if (drewCard) {
      game.log(
        '${0} rolled ${1} and gained ${2} M€, then drew a card from ${3}.',
        (b) => b.player(activePlayer).number(diceRoll).number(diceRoll).card(this)
      );
    } else {
      game.log(
        '${0} rolled ${1} and gained ${2} M€ from ${3}.',
        (b) => b.player(activePlayer).number(diceRoll).number(diceRoll).card(this)
      );
    }
  }
}

import {CorporationCard} from '../../corporation/CorporationCard';
import {CardName} from '../../../../common/cards/CardName';
import {Tag} from '../../../../common/cards/Tag';
import {CardRenderer} from '../../render/CardRenderer';
import {IPlayer} from '../../../IPlayer';
import {Size} from '../../../../common/cards/render/Size';
import {BoardType} from '../../../boards/BoardType';
import {SpaceType} from '../../../../common/boards/SpaceType';
import {Resource} from '../../../../common/Resource';
import {Space} from '../../../boards/Space';
import {isSpecialTileSpace} from '../../../boards/Board';
import {CardResource} from '../../../../common/CardResource';
import {digit} from '../../Options';

const BELLS_TO_MEGACREDIT_RATIO = 4;

export class NookConstruction extends CorporationCard {
  constructor() {
    super({
      name: CardName.NOOK_CONSTRUCTION,
      tags: [Tag.ANIMAL, Tag.CITY],
      startingMegaCredits: 50,
      resourceType: CardResource.BELLS,
      behavior: {
        addResources: 2,
      },
      metadata: {
        cardNumber: 'MY-CORP-08',
        description: 'You start with 50 M€ and 2 Bells.',
        renderData: CardRenderer.builder((b) => {
          b.br.megacredits(50).resource(CardResource.BELLS, {amount: 2, digit});
          b.corpBox('effect', (cb) => {
            cb.vSpace(Size.LARGE);
            cb.effect(
              'When you place a special tile on Mars, Gain 1 Bells.',
              (eb) => {
                eb.specialTile().asterix().startEffect.resource(CardResource.BELLS);
              },
            );
            cb.effect(
              'When you place any tile on Mars (excluding ocean tiles), gain 2 + ⌊Bells ÷ 4⌋ M€.',
              (eb) => {
                eb.emptyTile('normal', {size: Size.SMALL}).asterix().startEffect.megacredits(2).plus().megacredits(1).slash().resource(CardResource.BELLS, {amount: BELLS_TO_MEGACREDIT_RATIO, digit});
              },
            );
          });
        }),
      },
    });
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space, boardType: BoardType): void {
    // 仅在卡牌拥有者亲自放置板块时触发
    if (cardOwner.id !== activePlayer.id) return;

    // 仅适用于火星地图（排除月球等其他地图）
    if (boardType !== BoardType.MARS) return;

    // 排除无玩家标记的板块（如海洋）
    if (space.player === undefined) return;

    // 跳过殖民地类型的板块
    if (space.spaceType === SpaceType.COLONY) return;

    const game = cardOwner.game;

    // 放置特殊板块时获得 1 个铃钱
    if (isSpecialTileSpace(space)) {
      cardOwner.addResourceTo(this, 1);
      game.log(
        '${0} placed a special tile and gained 1 Bells on ${1}.',
        (b) => b.player(cardOwner).card(this),
      );
    }

    // 放置任意板块可返现，返现金额与铃钱数量有关
    const bellsCount = this.resourceCount;
    const income = Math.floor(bellsCount / BELLS_TO_MEGACREDIT_RATIO) + 2;

    cardOwner.stock.add(Resource.MEGACREDITS, income, {log: false});
    game.log(
      '${0} gained ${1} M€ from ${2} after placing a tile on Mars.',
      (b) => b.player(cardOwner).number(income).card(this),
    );
  }
}

import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';
import {ICard} from '../ICard';
import {CardRenderer} from '../render/CardRenderer';
import {SelectCard} from '../../inputs/SelectCard';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {getAsteroidMaterialResearchCenterData} from '../../../server/mingyue/MingYueData';
import {DeferredAction} from '../../../server/deferredActions/DeferredAction';
import {Priority} from '../../../server/deferredActions/Priority';

export class AsteroidMaterialResearchCenter extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ASTEROID_MATERIAL_RESEARCH_CENTER,
      tags: [Tag.SPACE, Tag.SCIENCE],
      cost: 15,
      victoryPoints: 0,

      metadata: {
        cardNumber: 'MY02',
        renderData: CardRenderer.builder((b) => {
          // 效果1：当自己的蓝卡获得陨石资源时，刷新行动（每代最多2次）
          b.effect('When your blue card gains an asteroid resource, refresh its action (max 2 times per generation per card)', (eb) =>
            eb.empty()
              .resource(CardResource.ASTEROID)
              .startEffect
              .cards(1, {secondaryTag: AltSecondaryTag.BLUE})
              .myLoopArrow()
              .asterix(),
          ).br;

          // 效果2：当你打出名字中含有 "asteroid" 的事件牌时，为任意一张卡添加一个陨石资源
          b.effect('When you play an event card with "asteroid" in its name, add 1 asteroid resource to any card', (eb) =>
            eb.cards(1, {secondaryTag: Tag.EVENT})
              .myAsteroid()
              .startEffect
              .resource(CardResource.ASTEROID)
              .asterix(),
          );
        }),
      },
    });
  }

  // 效果1触发：蓝卡获得陨石资源时尝试刷新该卡行动
  public onResourceAdded(player: IPlayer, card: ICard): void {
    player.game.defer(new RefreshBlueCardAction(player, card));
  }

  // 效果2触发：当你打出名称中包含“asteroid”的事件牌时，为任意一张卡牌添加1个陨石资源
  public onCardPlayed(player: IPlayer, card: IProjectCard) {
    // 必须是事件牌，且名称中包含 "asteroid"（不区分大小写）
    if (card.type !== CardType.EVENT || !card.name.toLowerCase().includes('asteroid')) {
      return undefined;
    }

    const asteroidCards = player.getResourceCards(CardResource.ASTEROID);

    // 没有任何蓝卡可以放置小行星资源，直接跳过
    if (asteroidCards.length === 0) {
      return undefined;
    }

    // 如果只有一张卡可以添加资源，则直接添加
    if (asteroidCards.length === 1) {
      player.addResourceTo(asteroidCards[0], {qty: 1, log: true});
      return undefined;
    }

    // 否则弹出选择框
    return new SelectCard(
      'Select a card to add 1 asteroid resource',
      'Add asteroid',
      asteroidCards as ICard[],
    ).andThen(([selected]) => {
      player.addResourceTo(selected, {qty: 1, log: true});
      return undefined;
    });
  }

  public onProductionPhase(player: IPlayer): undefined {
    const data = getAsteroidMaterialResearchCenterData(player.game);
    data.refreshCounter = {};
    return undefined;
  }
}

/**
 * 优先级最低的延迟刷新蓝卡行动
 */
class RefreshBlueCardAction extends DeferredAction {
  constructor(
    player: IPlayer,
    private card: ICard,
  ) {
    super(player, Priority.BACK_OF_THE_LINE);
  }

  public execute() {
    const {card, player} = this;

    // 条件检查
    if (card.resourceType !== CardResource.ASTEROID) return; // 不是陨石资源
    if (card.type !== CardType.ACTIVE) return; // 不是具有行动的蓝卡
    if (!player.actionsThisGeneration.has(card.name)) return; // 本代未使用，不需要刷新

    const game = player.game;
    const data = getAsteroidMaterialResearchCenterData(game);

    const currentCount = data.refreshCounter[card.name] ?? 0;
    if (currentCount >= 2) return;

    // 执行刷新
    player.actionsThisGeneration.delete(card.name);
    data.refreshCounter[card.name] = currentCount + 1;

    game.log(
      '${0} 的 ${1} 获得陨石资源，行动被刷新（第 ${2}/2 次）',
      (b) => b.player(player).card(card).number(currentCount + 1),
    );

    return undefined;
  }
}

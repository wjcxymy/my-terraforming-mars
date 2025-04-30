import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';
import {ICard, isIActionCard} from '../ICard';
import {CardRenderer} from '../render/CardRenderer';
import {SelectCard} from '../../inputs/SelectCard';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

export class AsteroidMaterialResearchCenter extends Card implements IProjectCard {
  private static readonly COST = 15;

  // 每张蓝卡每代最多刷新2次
  private refreshCounter: Map<string, number> = new Map();
  private counterGeneration: number = -1; // refreshCounter 所属的世代

  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ASTEROID_MATERIAL_RESEARCH_CENTER,
      tags: [Tag.SPACE, Tag.SCIENCE],
      cost: AsteroidMaterialResearchCenter.COST,
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
    if (card.resourceType !== CardResource.ASTEROID) return; // 不是陨石资源
    if (!isIActionCard(card)) return; // 不是蓝卡
    if (!player.actionsThisGeneration.has(card.name)) return; // 本代未使用，不需要刷新

    const currentGeneration = player.game.generation;

    // 新的一代，重置计数器
    if (this.counterGeneration !== currentGeneration) {
      this.refreshCounter.clear();
      this.counterGeneration = currentGeneration;
    }

    const currentCount = this.refreshCounter.get(card.name) ?? 0;
    if (currentCount >= 2) return; // 已刷新2次，不再刷新

    // 执行刷新
    player.actionsThisGeneration.delete(card.name);
    this.refreshCounter.set(card.name, currentCount + 1);

    player.game.log(
      '${0} 的 ${1} 获得陨石资源，行动被刷新（第 ${2} 次）',
      (b) => b.player(player).card(card).number(currentCount + 1),
    );
  }

  // 效果2触发：当任意玩家打出事件牌，如果名字中含有 "asteroid"，则添加资源
  public onCardPlayedFromAnyPlayer(thisCardOwner: IPlayer, _playedCardOwner: IPlayer, card: IProjectCard) {
    // 必须是事件牌，且名称中包含 "asteroid"（不区分大小写）
    if (card.type !== CardType.EVENT || !card.name.toLowerCase().includes('asteroid')) {
      return undefined;
    }

    const asteroidCards = thisCardOwner.getResourceCards(CardResource.ASTEROID);

    // 没有任何蓝卡可以放置小行星资源，直接跳过
    if (asteroidCards.length === 0) {
      return undefined;
    }

    // 如果只有一张卡可以添加资源，则直接添加
    if (asteroidCards.length === 1) {
      thisCardOwner.addResourceTo(asteroidCards[0], {qty: 1, log: true});
      return undefined;
    }

    // 否则弹出选择框
    return new SelectCard(
      'Select a card to add 1 asteroid resource',
      'Add asteroid',
      asteroidCards as ICard[],
    ).andThen(([selected]) => {
      thisCardOwner.addResourceTo(selected, {qty: 1, log: true});
      return undefined;
    });
  }
}

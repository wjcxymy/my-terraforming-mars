import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resource} from '../../../common/Resource';

export class FloralBloomSurge extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.FLORAL_BLOOM_SURGE,
      tags: [Tag.PLANT],
      cost: 10,
      requirements: {tag: Tag.PLANT, count: 2}, // 2个植物标记前置
      metadata: {
        cardNumber: 'MY06',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a plant tag card (including this), increase your plant production by 1.', (eb) => {
            eb.tag(Tag.PLANT).startEffect.production((pb) => pb.plants(1));
          });
        }),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard) {
    const tagCount = player.tags.cardTagCount(card, Tag.PLANT);
    if (tagCount > 0) {
      player.production.add(Resource.PLANTS, tagCount, {log: true});
    }
  }
}

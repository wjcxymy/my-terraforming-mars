import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../../server/IPlayer';
import {Resource} from '../../../common/Resource';

export class ArtifactHarvest extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.ARTIFACT_HARVEST,
      tags: [Tag.PLANT],
      cost: 7,
      requirements: {oceans: 7},
      victoryPoints: 1,
      behavior: {},
      metadata: {
        cardNumber: 'MY09',
        description: '',
        renderData: CardRenderer.builder((b) => {
          b.plainEffect(
            'Requires 7 oceans. Gain 1 plants for each type of non-standard resource you have (up to 7 types counted).',
            (eb) => {
              eb.text('X').wild(1).asterix()
                .startEffect
                .text('X').plants(1);
            },
          );
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    // 计算玩家拥有的不同种类的非标准资源数量
    const nonStandardResources = new Set(
      player.getCardsWithResources().map((card) => card.resourceType),
    ).size;

    // 每种非标准资源给予1植物，总计最多7植物（对应7种资源）
    const plantGain = Math.min(nonStandardResources, 7);

    player.stock.add(Resource.PLANTS, plantGain, {log: true});
    return undefined;
  }
}

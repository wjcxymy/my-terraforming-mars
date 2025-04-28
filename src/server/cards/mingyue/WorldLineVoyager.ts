import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {Size} from '../../../common/cards/render/Size';

// α世界线：1动（isOneActionThisRound == true）红莉栖
// β世界线：3动（isOneActionThisRound == false）真由理
// steins;Gate世界线：2动（未使用）

export class WorldLineVoyager extends CorporationCard {
  public isOneActionThisRound: boolean = false; // 初始为β世界线，3动

  constructor() {
    super({
      name: CardName.WORLD_LINE_VOYAGER,
      tags: [Tag.SCIENCE],
      startingMegaCredits: 48,

      metadata: {
        cardNumber: 'MY-CORP-05',
        description: '起始获得48 M€。',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(48);
          b.corpBox('effect', (cb) => {
            cb.vSpace(Size.LARGE);
            cb.effect('At the end of each round, you jump to another World Line (in the first round, you start in the β World Line).', (eb) => {
              eb.empty().startEffect.text('α World Line ⇄ β World Line', Size.SMALL);
            });
            cb.plainEffect('α World Line: Base actions per round are 1, project card costs are reduced by 3 M€.', (eb) => {
              eb.text('α World Line', Size.SMALL).startEffect.arrow().megacreditsText('-3');
            });
            cb.plainEffect('β World Line: Base actions per round are 3, project card costs are increased by 1 M€.', (eb) => {
              eb.text('β World Line', Size.SMALL).startEffect.arrow().arrow().arrow().megacreditsText('+1');
            });
          });
        }),
      },
    });
  }

  public override getCardDiscount(player: IPlayer) {
    if (!player.isCorporation(this.name)) return 0;

    // 根据是否为1次行动或3次行动，返回卡牌的费用折扣
    if (this.isOneActionThisRound) {
      return 3;  // 1动时，项目卡费用减少3 M€
    } else {
      return -1; // 3动时，项目卡费用增加1 M€
    }
  }
}

import {CorporationCard} from '../../corporation/CorporationCard';
import {CardName} from '../../../../common/cards/CardName';
import {Tag} from '../../../../common/cards/Tag';
import {CardRenderer} from '../../render/CardRenderer';
import {IPlayer} from '../../../IPlayer';
import {CardResource} from '../../../../common/CardResource';
import {CardType} from '../../../../common/cards/CardType';
import {SelectCard} from '../../../../server/inputs/SelectCard';
import {SelectAmount} from '../../../../server/inputs/SelectAmount';
import {AltSecondaryTag} from '../../../../common/cards/render/AltSecondaryTag';
import {Size} from '../../../../common/cards/render/Size';

export class FlowingCloud extends CorporationCard {
  constructor() {
    super({
      name: CardName.FLOWING_CLOUD,
      tags: [Tag.VENUS],
      startingMegaCredits: 48,
      resourceType: CardResource.FLOATER,

      firstAction: {
        text: 'Draw a floater card',
        drawCard: {count: 1, type: CardType.ACTIVE, resource: CardResource.FLOATER},
      },

      metadata: {
        cardNumber: 'MY-CORP-12',
        description: 'You start with 48 M€. As your first action, draw a floater card.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(48).nbsp.cards(1, {secondaryTag: AltSecondaryTag.FLOATER});
          b.corpBox('action', (cb) => {
            cb.vSpace(Size.MEDIUM);
            // 修改点 1：更新行动描述
            cb.action('Move up to half of the floater resources from one floater card to another.',
              (eb) => {
                eb.minus().text('x').resource(CardResource.FLOATER).asterix().startAction.plus().text('x').resource(CardResource.FLOATER);
              },
            );
            cb.plainEffect('If the two cards have the same number of floater resources after moving, place 1 floater resource on each of these two cards.',
              (eb) => {
                eb.text('equal').startEffect.plus().resource(CardResource.FLOATER).plus().resource(CardResource.FLOATER).asterix();
              },
            );
          });
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    const floaterCards = player.tableau.filter((card) => card.resourceType === CardResource.FLOATER);
    if (floaterCards.length < 2) {
      return false; // 不够 2 张云载体，不能行动
    }
    // 至少有一张云载体含有至少2个云资源即可
    return floaterCards.some((card) => card.resourceCount >= 2);
  }

  public action(player: IPlayer) {
    const floaterCards = player.tableau.filter((card) => card.resourceType === CardResource.FLOATER);
    // 修改点 2：来源卡至少需要有2个云资源
    const sourceCandidates = floaterCards.filter((card) => card.resourceCount >= 2);

    return new SelectCard('选择来源云载体（至少含2个云资源）', '选择', sourceCandidates, {min: 1, max: 1}).andThen(
      ([sourceCard]) => {
        // 修改点 3：最大移动数量为资源数的一半（向下取整）
        const maxMove = Math.floor(sourceCard.resourceCount / 2);
        return new SelectAmount(`选择移动的云资源数量（最多 ${maxMove}）`, '确定', 1, maxMove).andThen(
          (amount) => {
            const targetCandidates = floaterCards.filter((card) => card !== sourceCard);
            return new SelectCard('选择目标云载体', '选择', targetCandidates, {min: 1, max: 1}).andThen(
              ([targetCard]) => {
                player.removeResourceFrom(sourceCard, amount, {log: true});
                player.addResourceTo(targetCard, {qty: amount, log: true});

                if (sourceCard.resourceCount === targetCard.resourceCount) {
                  player.addResourceTo(sourceCard, {qty: 1, log: true});
                  player.addResourceTo(targetCard, {qty: 1, log: true});
                }
                return undefined;
              },
            );
          },
        );
      },
    );
  }
}

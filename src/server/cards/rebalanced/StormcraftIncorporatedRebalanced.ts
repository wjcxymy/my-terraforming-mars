import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {AndOptions} from '../../inputs/AndOptions';
import {SelectAmount} from '../../inputs/SelectAmount';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {PlayerInput} from '../../PlayerInput';
import {Resource} from '../../../common/Resource';
import {message} from '../../logs/MessageBuilder';
import {SelectCard} from '../../inputs/SelectCard';
import {IActionCard} from '../ICard';

export class StormcraftIncorporatedRebalanced extends CorporationCard implements IActionCard {
  constructor() {
    super({
      name: CardName.STORMCRAFT_INCORPORATED_REBALANCED,
      tags: [Tag.JOVIAN],
      startingMegaCredits: 48,
      resourceType: CardResource.FLOATER,

      metadata: {
        cardNumber: 'RB-CORP-18',
        description: 'You start with 48 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(48);
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.action('Add a floater each to 1 or 2 different cards.', (eb) => {
              eb.empty().startAction.resource(CardResource.FLOATER).asterix().resource(CardResource.FLOATER).asterix();
            });
            ce.vSpace();
            ce.effect('Floaters on this card may be used as 2 heat each.', (eb) => {
              eb.startEffect.resource(CardResource.FLOATER).equals().heat(2);
            });
          });
        }),
      },
    });
  }

  public spendHeat(player: IPlayer, targetAmount: number,
    cb: () => (undefined | PlayerInput) = () => undefined): AndOptions {
    let heatAmount: number;
    let floaterAmount: number;

    return new AndOptions(
      new SelectAmount('Heat', 'Spend heat', 0, Math.min(player.heat, targetAmount))
        .andThen((amount) => {
          heatAmount = amount;
          return undefined;
        }),
      new SelectAmount('Stormcraft Incorporated Floaters (2 heat each)', 'Spend floaters',
        0, Math.min(this.resourceCount, Math.ceil(targetAmount / 2)))
        .andThen((amount) => {
          floaterAmount = amount;
          return undefined;
        })).andThen(() => {
      if (heatAmount + (floaterAmount * 2) < targetAmount) {
        throw new Error(`Need to pay ${targetAmount} heat`);
      }
      if (heatAmount > 0 && heatAmount - 1 + (floaterAmount * 2) >= targetAmount) {
        throw new Error('You cannot overspend heat');
      }
      if (floaterAmount > 0 && heatAmount + ((floaterAmount - 1) * 2) >= targetAmount) {
        throw new Error('You cannot overspend floaters');
      }
      player.removeResourceFrom(this, floaterAmount);
      player.stock.deduct(Resource.HEAT, heatAmount);
      return cb();
    }).setTitle(message('Select how to spend ${0} heat', (b) => b.number(targetAmount)));
  }

  public canAct(_player: IPlayer) {
    return true;
  }

  public action(player: IPlayer) {
    // 获取所有可以放置云资源的蓝卡
    const floaterEligibleCards = player.getResourceCards(CardResource.FLOATER);
    if (floaterEligibleCards.length === 0) return undefined;

    // 若卡牌数量不超过 2 张，则全部添加资源
    if (floaterEligibleCards.length <= 2) {
      for (const card of floaterEligibleCards) {
        player.addResourceTo(card, {qty: 1, log: true});
      }
      return undefined;
    }

    // 选择 2 张卡牌，各放置 1 个云资源
    return new SelectCard(
      'Select 2 cards to place 1 floater on each',
      'Place',
      floaterEligibleCards,
      {min: 2, max: 2},
    ).andThen((selectedCards) => {
      for (const card of selectedCards) {
        player.addResourceTo(card, {qty: 1, log: true});
      }
      return undefined;
    });
  }
}

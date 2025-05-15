import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IActionCard} from '../ICard';
import {Resource} from '../../../common/Resource';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {SelectAmount} from '../../inputs/SelectAmount';
import {digit} from '../Options';

export class MoonlitWarren extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.MOONLIT_WARREN,
      cost: 8,
      tags: [Tag.MOON, Tag.ANIMAL],
      resourceType: CardResource.ANIMAL,
      victoryPoints: {resourcesHere: {}, per: 2},

      behavior: {
        addResources: 2,
      },

      metadata: {
        cardNumber: 'MY11',
        renderData: CardRenderer.builder((b) => {
          b.action(
            'Spend up to X plants to add that many animals here. X = ⌊animals on this card / 2⌋',
            (eb) => {
              eb.text('X').plants(1).startAction.text('X').resource(CardResource.ANIMAL);
            },
          ).br;
          b.vpText('1 VP per 2 animals on this card.').br;
          b.resource(CardResource.ANIMAL, {amount: 2, digit});
        }),
        description: 'Add 2 animals to this card.',
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    const animals = this.resourceCount;
    const maxSpend = Math.floor(animals / 2);
    return maxSpend > 0 && player.plants > 0;
  }

  public action(player: IPlayer) {
    const animals = this.resourceCount;
    const maxSpend = Math.min(Math.floor(animals / 2), player.plants);

    return new SelectAmount(
      `Choose how many plants to spend (max: ${maxSpend})`,
      'Feed',
      1,
      maxSpend,
      true,
    ).andThen((amount) => {
      if (amount > 0) {
        player.stock.deduct(Resource.PLANTS, amount);
        player.addResourceTo(this, amount);
        player.game.log(
          '${0} spent ${1} plant(s) to add ${2} animal(s) to ${3}.',
          (b) => b.player(player).number(amount).number(amount).card(this),
        );
      }
      return undefined;
    });
  }
}

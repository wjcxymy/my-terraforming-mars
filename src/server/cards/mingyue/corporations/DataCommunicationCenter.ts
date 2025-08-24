import {CorporationCard} from '../../corporation/CorporationCard';
import {IPlayer} from '../../../IPlayer';
import {Tag} from '../../../../common/cards/Tag';
import {Resource} from '../../../../common/Resource';
import {CardName} from '../../../../common/cards/CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {ICard} from '../../ICard';
import {CardResource} from '../../../../common/CardResource';
import {digit} from '../../Options';
import {Size} from '../../../../common/cards/render/Size';

export class DataCommunicationCenter extends CorporationCard {
  constructor() {
    super({
      name: CardName.DATA_COMMUNICATION_CENTER,
      tags: [Tag.MARS, Tag.POWER],
      startingMegaCredits: 42,
      resourceType: CardResource.DATA,

      behavior: {
        stock: {energy: 3},
      },

      metadata: {
        cardNumber: 'MY-CORP-15',
        description: 'You start with 42 M€ and 3 energy.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.megacredits(42).energy(3, {digit});
          b.corpBox('effect', (cb) => {
            cb.vSpace(Size.MEDIUM);
            cb.effect(
              `Whenever your energy production increases or you spend energy, add 1 data to this card.`,
              (eb) => {
                eb.plus().production((pb) => pb.energy(1))
                  .slash()
                  .minus().energy(1)
                  .startEffect.resource(CardResource.DATA);
              },
            );
            cb.effect(
              `Whenever this card has at least 3 data, automatically remove 3 data to draw 1 card.`,
              (eb) => {
                eb.resource(CardResource.DATA, {amount: 3, digit})
                  .asterix()
                  .startEffect.cards(1);
              },
            );
          });
        }),
      },
    });
  }

  // 当电力产能上升时会添加数据
  public onProductionGain(player: IPlayer, resource: Resource, amount: number) {
    if (resource === Resource.ENERGY && amount > 0) {
      player.addResourceTo(this, {qty: 1, log: true});
    }
  }

  // 当消耗电力资源时会添加数据
  public onStandardResourceSpent(player: IPlayer, resource: Resource, amount: number) {
    if (resource === Resource.ENERGY && amount > 0) {
      player.addResourceTo(this, {qty: 1, log: true});
    }
  }

  // 每有 3 个数据就抽 1 张牌
  public onResourceAdded(player: IPlayer, playedCard: ICard): void {
    if (playedCard.name !== this.name) return;

    if (this.resourceCount >= 3) {
      const delta = Math.floor(this.resourceCount / 3);
      const deducted = delta * 3;

      player.removeResourceFrom(this, deducted, {log: false});
      player.drawCard(delta);

      player.game.log(
        '${0} removed ${1} data from ${2} to draw ${3} card(s).',
        (b) => b.player(player).number(deducted).card(this).number(delta),
      );
    }
  }
}

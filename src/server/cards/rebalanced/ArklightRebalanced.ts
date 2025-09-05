import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {Arklight} from '../colonies/Arklight';
import {IPlayer} from '../../../server/IPlayer';
import {ICard} from '../ICard';
import {Resource} from '../../../common/Resource';
import {Size} from '../../../common/cards/render/Size';

export class ArklightRebalanced extends Arklight {
  constructor() {
    super({
      name: CardName.ARKLIGHT_REBALANCED,
      metadata: {
        cardNumber: 'RB-CORP-01',
        description: 'You start with 45 M€. Increase your M€ production 2 steps. 1 VP per 2 animals on this card.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(45).nbsp.production((pb) => pb.megacredits(2));
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect('When you play an animal or plant tag, including this, add 1 animal to this card.', (eb) => {
              eb.tag(Tag.ANIMAL).slash().tag(Tag.PLANT).startEffect.resource(CardResource.ANIMAL);
            });
            ce.effect('When you gain an animal to ANY CARD, gain 1 M€.', (eb) => {
              eb.resource(CardResource.ANIMAL).asterix().startEffect.megacredits(1);
            });
          });
        }),
      },
    });
  }

  public onResourceAdded(player: IPlayer, card: ICard, count: number) {
    if (card.resourceType === CardResource.ANIMAL) {
      player.stock.add(Resource.MEGACREDITS, count, {log: true});
    }
  }
}

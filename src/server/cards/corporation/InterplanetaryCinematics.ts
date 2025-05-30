import {CorporationCard} from './CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';
import {Resource} from '../../../common/Resource';

export class InterplanetaryCinematics extends CorporationCard {
  constructor({
    name = CardName.INTERPLANETARY_CINEMATICS,
    tags = [Tag.BUILDING],
    startingMegaCredits = 30,

    behavior = {
      stock: {steel: 20},
    },

    metadata = {
      cardNumber: 'R19',
      description: 'You start with 20 steel and 30 M€.',
      renderData: CardRenderer.builder((b) => {
        b.br.br.br;
        b.megacredits(30).nbsp.steel(20, {digit});
        b.corpBox('effect', (ce) => {
          ce.effect('Each time you play an event, you gain 2 M€.', (eb) => {
            eb.tag(Tag.EVENT).startEffect.megacredits(2);
          });
        });
      }),
    },
  } = {}) {
    super({
      name,
      tags,
      startingMegaCredits,

      behavior,

      metadata,
    });
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard) {
    if (player.isCorporation(this.name) && card.type === CardType.EVENT) {
      player.stock.add(Resource.MEGACREDITS, 2, {log: true, from: this});
    }
  }
}

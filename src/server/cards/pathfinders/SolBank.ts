import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';

export class SolBank extends CorporationCard {
  constructor({
    name = CardName.SOLBANK,
    metadata = {
      cardNumber: 'PfC13',
      description: 'You start with 40 M€',
      renderData: CardRenderer.builder((b) => {
        b.megacredits(40).br;
        b.effect('Whenever you spend M€ (or steel or titanium) add 1 data to this card.', (eb) =>
          eb.minus().megacredits(1).slash().steel(1).slash().titanium(1).startEffect.resource(CardResource.DATA));
        b.br;
        b.effect('During the production phase convert each data from this card into 1M€ each.', (eb) => eb.resource(CardResource.DATA).asterix().startEffect.megacredits(1));
      }),
    },
  } = {}) {
    super({
      name,
      startingMegaCredits: 40,
      resourceType: CardResource.DATA,

      metadata,
    });
  }

  // Behavior is in PathfindersExpansion.addToSolBank.
  public onProductionPhase(player: IPlayer): undefined {
    player.megaCredits += this.resourceCount;
    this.resourceCount = 0;
    return undefined;
  }
}

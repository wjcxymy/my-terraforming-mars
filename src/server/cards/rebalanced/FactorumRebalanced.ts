import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {Tag} from '../../../common/cards/Tag';
import {IActionCard} from '../ICard';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {SelectOption} from '../../../server/inputs/SelectOption';
import {OrOptions} from '../../../server/inputs/OrOptions';

export class FactorumRebalanced extends CorporationCard implements IActionCard {
  constructor() {
    super({
      name: CardName.FACTORUM_REBALANCED,
      tags: [Tag.POWER, Tag.BUILDING],
      startingMegaCredits: 37,

      behavior: {
        production: {steel: 1, energy: 1},
      },

      metadata: {
        cardNumber: 'RB-CORP-12',
        description: 'You start with 37 M€. Increase your steel and energy production 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(37).nbsp.production((pb) => pb.steel(1).energy(1));
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.MEDIUM);
            ce.action('If you have (or are tied for) the least energy resources, Increase your energy production 1 step.', (eb) => {
              eb.text('least').energy(1).startAction.production((pb) => pb.energy(1));
            });
            ce.action('If you have (or are tied for) the most steel resources, draw a building card.', (eb) => {
              eb.or().nbsp.text('most').steel(1).startAction.cards(1, {secondaryTag: Tag.BUILDING});
            });
          });
        }),
      },
    });
  }

  private hasLeastEnergy(player: IPlayer): boolean {
    const energies = player.game.getPlayers().map((p) => p.energy);
    const minEnergy = Math.min(...energies);
    return player.energy === minEnergy;
  }

  private hasMostSteel(player: IPlayer): boolean {
    const steels = player.game.getPlayers().map((p) => p.steel);
    const maxSteel = Math.max(...steels);
    return player.steel === maxSteel;
  }

  public canAct(player: IPlayer): boolean {
    return this.hasLeastEnergy(player) || this.hasMostSteel(player);
  }

  public action(player: IPlayer) {
    const increaseEnergy = new SelectOption(
      'Increase your energy production 1 step',
      'Increase production')
      .andThen(() => {
        player.production.add(Resource.ENERGY, 1, {log: true});
        return undefined;
      });

    const drawBuildingCard = new SelectOption(
      'Draw a building card',
      'Draw card')
      .andThen(() => {
        player.drawCard(1, {tag: Tag.BUILDING});
        return undefined;
      });

    if (!this.hasLeastEnergy(player)) return drawBuildingCard;
    if (!this.hasMostSteel(player)) return increaseEnergy;

    return new OrOptions(increaseEnergy, drawBuildingCard);
  }
}

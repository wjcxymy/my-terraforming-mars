import {Tag} from '../../../../common/cards/Tag';
import {CorporationCard} from '../../corporation/CorporationCard';
import {CardName} from '../../../../common/cards/CardName';
import {CardRenderer} from '../../render/CardRenderer';
import {Size} from '../../../../common/cards/render/Size';
import {digit} from '../../Options';
import {IPlayer} from '../../../IPlayer';
import {Resource} from '../../../../common/Resource';

// 无限回路转换比例
const PLANTS_TO_ENERGY_THRESHOLD = 3;
const PLANTS_TO_ENERGY_GAIN = 2;

const ENERGY_TO_HEAT_THRESHOLD = 3;
const ENERGY_TO_HEAT_GAIN = 2;

const HEAT_TO_PLANTS_THRESHOLD = 3;
const HEAT_TO_PLANTS_GAIN = 1;

export class InfinityCircuit extends CorporationCard {
  constructor() {
    super({
      name: CardName.INFINITY_CIRCUIT,
      tags: [Tag.POWER, Tag.PLANT],
      startingMegaCredits: 42,
      behavior: {
        stock: {plants: 2, energy: 2, heat: 2},
      },
      metadata: {
        cardNumber: 'MY-CORP-06',
        description: 'You start with 42 M€, and 2 each of plants, energy, and heat.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br.megacredits(42).energy(2, {digit}).plants(2, {digit}).heat(2, {digit});
          b.corpBox('effect', (cb) => {
            cb.vSpace(Size.MEDIUM);
            cb.effect(undefined, (eb) => {
              eb.text('3+').plants(1).startEffect.energy(PLANTS_TO_ENERGY_GAIN);
            });
            cb.effect(undefined, (eb) => {
              eb.text('3+').energy(1).startEffect.heat(ENERGY_TO_HEAT_GAIN);
            });
            cb.effect(`When you spend ${HEAT_TO_PLANTS_THRESHOLD} or more plants, energy, or heat, gain ${PLANTS_TO_ENERGY_GAIN} energy, ${ENERGY_TO_HEAT_GAIN} heat, or ${HEAT_TO_PLANTS_GAIN} plant, respectively.`, (eb) => {
              eb.text('3+').heat(1).startEffect.plants(HEAT_TO_PLANTS_GAIN);
            });
          });
        }),
      },
    });
  }

  public onStandardResourceSpent(player: IPlayer, resource: Resource, amount: number) {
    if (resource === Resource.PLANTS && amount >= PLANTS_TO_ENERGY_THRESHOLD) {
      player.stock.add(Resource.ENERGY, PLANTS_TO_ENERGY_GAIN, {log: false});
      player.game.log(
        '${0} gained ${1} energy via ${2} (spent ${3} plants)',
        (b) => b.player(player).number(PLANTS_TO_ENERGY_GAIN).card(this).number(amount),
      );
    }

    if (resource === Resource.ENERGY && amount >= ENERGY_TO_HEAT_THRESHOLD) {
      player.stock.add(Resource.HEAT, ENERGY_TO_HEAT_GAIN, {log: false});
      player.game.log(
        '${0} gained ${1} heat via ${2} (spent ${3} energy)',
        (b) => b.player(player).number(ENERGY_TO_HEAT_GAIN).card(this).number(amount),
      );
    }

    if (resource === Resource.HEAT && amount >= HEAT_TO_PLANTS_THRESHOLD) {
      player.stock.add(Resource.PLANTS, HEAT_TO_PLANTS_GAIN, {log: false});
      player.game.log(
        '${0} gained ${1} plant via ${2} (spent ${3} heat)',
        (b) => b.player(player).number(HEAT_TO_PLANTS_GAIN).card(this).number(amount),
      );
    }
  }
}

import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {all, digit} from '../Options';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {PlayerInput} from '../../PlayerInput';

export class Parasite extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.PARASITE,
      cost: 4,
      type: CardType.EVENT,
      tags: [Tag.MICROBE],

      behavior: {
        addResourcesToAnyCard: {count: 1, type: CardResource.MICROBE},
      },

      metadata: {
        cardNumber: 'CHM21',
        description: 'Add a microbe to ANY card. Remove up to 2 microbes or 1 animal from any player.',
        renderData: CardRenderer.builder((b) => {
          b.resource(CardResource.MICROBE, 1).asterix().br;
          b.minus().resource(CardResource.MICROBE, {amount: 2, all, digit});
          b.or().minus().resource(CardResource.ANIMAL, {amount: 1, all});
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer): PlayerInput | undefined {
    const orOptionsMicrobes = new RemoveResourcesFromCard(player, CardResource.MICROBE, 2, {mandatory: false, log: true}).execute() as OrOptions;
    const removeMicrobes = orOptionsMicrobes !== undefined ?
      orOptionsMicrobes.options[0] :
      undefined;

    const orOptionsAnimals = new RemoveResourcesFromCard(player, CardResource.ANIMAL, 1, {mandatory: false, log: true}).execute() as OrOptions;
    const removeAnimals = orOptionsAnimals !== undefined ?
      orOptionsAnimals.options[0] :
      undefined;

    // If no other player has microbes or animals, skip
    if (removeAnimals === undefined && removeMicrobes === undefined) {
      player.game.log('There were no microbes or animals to remove from any player.');
      return undefined;
    }

    const orOptions = new OrOptions();
    if (removeAnimals !== undefined) {
      orOptions.options.push(removeAnimals);
    }
    if (removeMicrobes !== undefined) {
      orOptions.options.push(removeMicrobes);
    }
    orOptions.options.push(new SelectOption('Skip removal'));

    return orOptions;
  }
}

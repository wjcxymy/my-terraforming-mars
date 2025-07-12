import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {CardRenderer} from '../render/CardRenderer';
import {OrOptions} from '../../inputs/OrOptions';
import {all} from '../Options';
import {SelectOption} from '../../../server/inputs/SelectOption';
import {AddResourcesToCard} from '../../../server/deferredActions/AddResourcesToCard';

export class Poachers extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.POACHERS,
      cost: 5,
      type: CardType.EVENT,
      metadata: {
        cardNumber: 'MY17',
        description: 'Move 1 resource from any card to another card with the same resource type that already has resources.',
        renderData: CardRenderer.builder((b) => {
          b.minus().wild(1, {all}).nbsp.plus().wild(1).asterix();
        }),
      },
    });
  }

  private getOwnedResourceTypes(player: IPlayer) {
    return [...new Set(
      player.getCardsWithResources().map((card) => card.resourceType),
    )];
  }

  public override bespokePlay(player: IPlayer) {
    const orOptions = new OrOptions();
    const resourceTypes = this.getOwnedResourceTypes(player);
    for (const resourceType of resourceTypes) {
      const resourceRemovalOptions = new RemoveResourcesFromCard(
        player,
        resourceType,
        1,
        {mandatory: false, log: true},
      )
        .andThen((response) => {
          if (response.proceed) {
            player.game.defer(new AddResourcesToCard(player, resourceType, {count: 1}));
          }
        })
        .execute() as OrOptions;
      const removalOption = resourceRemovalOptions !== undefined ?
        resourceRemovalOptions.options[0] :
        undefined;
      if (removalOption !== undefined) {
        orOptions.options.push(removalOption);
      }
    }

    orOptions.options.push(new SelectOption('Skip removal'));
    return orOptions;
  }
}

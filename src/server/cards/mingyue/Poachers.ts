import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {RemoveResourcesFromCard} from '../../deferredActions/RemoveResourcesFromCard';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardRenderer} from '../render/CardRenderer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectCard} from '../../inputs/SelectCard';
import {all} from '../Options';

export class Poachers extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.POACHERS,
      cost: 5,
      type: CardType.EVENT,
      metadata: {
        cardNumber: 'MY17',
        description: 'Move 1 resource from any card to another card with the same resource type.',
        renderData: CardRenderer.builder((b) => {
          b.minus().wild(1, {all}).nbsp.plus().wild(1).asterix();
        }),
      },
    });
  }

  private getCardResourceTypes(player: IPlayer) {
    return [...new Set(player.getResourceCards().map((card) => card.resourceType))];
  }

  public override bespokeCanPlay(player: IPlayer): boolean {
    const cards = player.getResourceCards();
    if (player.game.isSoloMode()) return cards.length > 0;

    return this.getCardResourceTypes(player).some((type) =>
      RemoveResourcesFromCard.getAvailableTargetCards(player, type).length > 0,
    );
  }

  public override bespokePlay(player: IPlayer) {
    const cards = player.getResourceCards();

    if (player.game.isSoloMode()) {
      if (cards.length === 0) return undefined;
      if (cards.length === 1) {
        player.addResourceTo(cards[0], {qty: 1, log: true});
        return undefined;
      }
      return new SelectCard(
        'Select a card to gain 1 resource',
        'Add Resource',
        cards,
        {min: 1, max: 1},
      ).andThen((selected) => {
        player.addResourceTo(selected[0], {qty: 1, log: true});
        return undefined;
      });
    }

    const orOptions = new OrOptions();
    for (const resourceType of this.getCardResourceTypes(player)) {
      const removalOptions = new RemoveResourcesFromCard(player, resourceType, 1, {
        mandatory: false,
        log: true,
      })
        .andThen((response) => {
          if (response.proceed) {
            player.game.defer(new AddResourcesToCard(player, resourceType, {count: 1}));
          }
        })
        .execute() as OrOptions;

      if (removalOptions?.options[0]) {
        orOptions.options.push(removalOptions.options[0]);
      }
    }

    orOptions.options.push(new SelectOption('Skip removal'));
    return orOptions;
  }
}

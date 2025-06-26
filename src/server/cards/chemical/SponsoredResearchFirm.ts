import {IProjectCard} from '../IProjectCard';
import {ActionCard} from '../ActionCard';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {CardRenderer} from '../render/CardRenderer';

export class SponsoredResearchFirm extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.SPONSORED_RESEARCH_FIRM,
      cost: 15,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      requirements: {tag: Tag.EARTH, count: 2},

      behavior: {
        tr: 1,
      },

      action: {
        drawCard: 1,
      },

      metadata: {
        cardNumber: 'CHM01',
        description: 'Requires 2 Earth tags. Raise your TR 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.action('If you have increased your TR this generation, draw 1 card.', (eb) => {
            eb.plus().tr(1).asterix().startAction.cards(1);
          });
          b.br.tr(1);
        }),
      },
    });
  }

  public override bespokeCanAct(player: IPlayer): boolean {
    return player.hasIncreasedTerraformRatingThisGeneration;
  }
}

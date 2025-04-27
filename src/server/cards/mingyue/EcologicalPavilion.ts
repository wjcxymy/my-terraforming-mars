import { IProjectCard } from '../IProjectCard';
import { Tag } from '../../../common/cards/Tag';
import { Card } from '../Card';
import { CardType } from '../../../common/cards/CardType';
import { CardName } from '../../../common/cards/CardName';
import { CardRenderer } from '../render/CardRenderer';

export class EcologicalPavilion extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ECOLOGICAL_PAVILION,
      tags: [Tag.PLANT, Tag.MICROBE, Tag.ANIMAL],
      cost: 10,
      victoryPoints: 1,
      requirements: [
        { tag: Tag.PLANT },
        { tag: Tag.MICROBE },
        { tag: Tag.ANIMAL },
      ],

      behavior: {
        drawCard: 2,
      },

      metadata: {
        cardNumber: 'MY07',
        description: 'Requires a plant tag, a microbe tag, and an animal tag. Draw 2 cards.',
        renderData: CardRenderer.builder((b) => b.cards(2)),
      },
    });
  }
}

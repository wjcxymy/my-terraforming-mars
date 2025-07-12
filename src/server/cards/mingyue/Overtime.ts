import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../../server/IPlayer';

export class Overtime extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.OVERTIME,
      cost: 4,
      type: CardType.EVENT,

      metadata: {
        cardNumber: 'MY16',
        description: 'Take another two actions this turn.',
        renderData: CardRenderer.builder((b) => {
          b.arrow().arrow();
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.availableActionsThisRound += 2;
    return undefined;
  }
}

import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../../server/IPlayer';
import {InterplanetaryCinematics} from '../corporation/InterplanetaryCinematics';
import {Size} from '../../../common/cards/render/Size';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {Resource} from '../../../common/Resource';

const EVENT_REWARD_AMOUNT = 2;

export class InterplanetaryCinematicsRebalanced extends InterplanetaryCinematics {
  constructor() {
    super({
      name: CardName.INTERPLANETARY_CINEMATICS_REBALANCED,
      tags: [],
      startingMegaCredits: 60,
      behavior: undefined,
      metadata: {
        cardNumber: 'RB-CORP-02',
        description: 'You start with 60 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br.br;
          b.megacredits(60);
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.MEDIUM);
            ce.effect(
              'Your event cards stay face up, and their tags are in use as if those were automated (green) cards.',
              (eb) => {
                eb.empty().startEffect.cards(1, {secondaryTag: Tag.EVENT}).text('up').asterix();
              },
            );
            ce.effect(
              `Each time you play an event, you gain ${EVENT_REWARD_AMOUNT} M€.`,
              (eb) => {
                eb.tag(Tag.EVENT).startEffect.megacredits(EVENT_REWARD_AMOUNT);
              },
            );
          });
        }),
      },
    });
  }

  public override onCardPlayed(player: IPlayer, card: IProjectCard): void {
    if (player.isCorporation(this.name) && card.type === CardType.EVENT) {
      player.stock.add(Resource.MEGACREDITS, EVENT_REWARD_AMOUNT, {log: true, from: this});
    }
  }
}

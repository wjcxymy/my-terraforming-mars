import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Phase} from '../../../common/Phase';
import {Space} from '../../boards/Space';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {GainProduction} from '../../deferredActions/GainProduction';
import {CardRenderer} from '../render/CardRenderer';
import {BoardType} from '../../boards/BoardType';
import {digit} from '../Options';
import {AresHandler} from '../../ares/AresHandler';
import {CorporationCard} from '../corporation/CorporationCard';
import {Size} from '../../../common/cards/render/Size';

export class MiningGuildRebalanced extends CorporationCard {
  constructor() {
    super({
      name: CardName.MINING_GUILD_REBALANCED,
      tags: [Tag.BUILDING, Tag.BUILDING],
      startingMegaCredits: 30,

      behavior: {
        production: {steel: 1},
        stock: {steel: 5},
      },

      metadata: {
        cardNumber: 'RB-CORP-14',
        hasExternalHelp: true,
        description: 'You start with 30 M€, 5 steel and 1 steel production.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(30).nbsp.steel(5, {digit}).nbsp.production((pb) => pb.steel(1));
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.MEDIUM);
            ce.effect('Each time you place a tile on an area with a steel or titanium placement bonus, increase your steel production 1 step', (eb) => {
              eb.steel(1).asterix().slash().titanium(1).asterix();
              eb.startEffect.production((pb) => pb.steel(1));
            });
            ce.effect('STEEL MAY BE USED for the CITY STANDARD PROJECT as if you were playing a building card.', (eb) => {
              eb.city().asterix().startEffect.megacredits(25).super((b) => b.steel(1));
            });
          });
        }),
      },
    });
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space, boardType: BoardType) {
    // Nerfing on The Moon.
    if (boardType !== BoardType.MARS) {
      return;
    }
    if (cardOwner.id !== activePlayer.id || cardOwner.game.phase === Phase.SOLAR) {
      return;
    }
    // Don't grant a bonus if the card is overplaced (like Ares Ocean City)
    if (space.tile?.covers !== undefined) {
      return;
    }
    const board = cardOwner.game.board;
    const grant = space.bonus.some((bonus) => bonus === SpaceBonus.STEEL || bonus === SpaceBonus.TITANIUM) ||
      AresHandler.anyAdjacentSpaceGivesBonus(board, space, SpaceBonus.STEEL) ||
      AresHandler.anyAdjacentSpaceGivesBonus(board, space, SpaceBonus.TITANIUM);
    if (grant) {
      cardOwner.game.defer(new GainProduction(cardOwner, Resource.STEEL));
    }
  }
}

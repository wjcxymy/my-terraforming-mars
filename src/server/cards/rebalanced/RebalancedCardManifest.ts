import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {AdhaiHighOrbitConstructionsRebalanced} from './AdhaiHighOrbitConstructionsRebalanced';
import {ArklightRebalanced} from './ArklightRebalanced';
import {CelesticRebalanced} from './CelesticRebalanced';
import {InterplanetaryCinematicsRebalanced} from './InterplanetaryCinematicsRebalanced';
import {InventrixRebalanced} from './InventrixRebalanced';
import {OdysseyRebalanced} from './OdysseyRebalanced';
import {PristarRebalanced} from './PristarRebalanced';
import {SolBankRebalanced} from './SolBankRebalanced';
import {ThorgateRebalanced} from './ThorgateRebalanced';
import {TychoMagneticsRebalanced} from './TychoMagneticsRebalanced';

export const REBALANCED_CARD_MANIFEST = new ModuleManifest({
  module: 'rebalanced',
  corporationCards: {
    [CardName.ARKLIGHT_REBALANCED]: {Factory: ArklightRebalanced},
    [CardName.INTERPLANETARY_CINEMATICS_REBALANCED]: {Factory: InterplanetaryCinematicsRebalanced},
    [CardName.THORGATE_REBALANCED]: {Factory: ThorgateRebalanced},
    [CardName.CELESTIC_REBALANCED]: {Factory: CelesticRebalanced},
    [CardName.SOLBANK_REBALANCED]: {Factory: SolBankRebalanced},
    [CardName.ODYSSEY_REBALANCED]: {Factory: OdysseyRebalanced},
    [CardName.TYCHO_MAGNETICS_REBALANCED]: {Factory: TychoMagneticsRebalanced},
    [CardName.PRISTAR_REBALANCED]: {Factory: PristarRebalanced},
    [CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS_REBALANCED]: {Factory: AdhaiHighOrbitConstructionsRebalanced},
    [CardName.INVENTRIX_REBALANCED]: {Factory: InventrixRebalanced},
  },
  preludeCards: {
  },
  projectCards: {
  },
  globalEvents: {
  },
  cardsToRemove: [
    CardName.ARKLIGHT,
    CardName.INTERPLANETARY_CINEMATICS,
    CardName.THORGATE,
    CardName.CELESTIC,
    CardName.SOLBANK,
    CardName.ODYSSEY,
    CardName.TYCHO_MAGNETICS,
    CardName.PRISTAR,
    CardName.ADHAI_HIGH_ORBIT_CONSTRUCTIONS,
    CardName.INVENTRIX,
  ],
});

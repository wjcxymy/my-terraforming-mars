import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {ArklightRebalanced} from './ArklightRebalanced';
import {CelesticRebalanced} from './CelesticRebalanced';
import {InterplanetaryCinematicsRebalanced} from './InterplanetaryCinematicsRebalanced';
import {OdysseyRebalanced} from './OdysseyRebalanced';
import {SolBankRebalanced} from './SolBankRebalanced';
import {ThorgateRebalanced} from './ThorgateRebalanced';

export const REBALANCED_CARD_MANIFEST = new ModuleManifest({
  module: 'rebalanced',
  corporationCards: {
    [CardName.ARKLIGHT_REBALANCED]: {Factory: ArklightRebalanced},
    [CardName.INTERPLANETARY_CINEMATICS_REBALANCED]: {Factory: InterplanetaryCinematicsRebalanced},
    [CardName.THORGATE_REBALANCED]: {Factory: ThorgateRebalanced},
    [CardName.CELESTIC_REBALANCED]: {Factory: CelesticRebalanced},
    [CardName.SOLBANK_REBALANCED]: {Factory: SolBankRebalanced},
    [CardName.ODYSSEY_REBALANCED]: {Factory: OdysseyRebalanced},
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
  ],
});

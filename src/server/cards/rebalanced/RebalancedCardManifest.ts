import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {AdhaiHighOrbitConstructionsRebalanced} from './AdhaiHighOrbitConstructionsRebalanced';
import {ArklightRebalanced} from './ArklightRebalanced';
import {CelesticRebalanced} from './CelesticRebalanced';
import {FactorumRebalanced} from './FactorumRebalanced';
import {HelionRebalanced} from './HelionRebalanced';
import {InterplanetaryCinematicsRebalanced} from './InterplanetaryCinematicsRebalanced';
import {InventrixRebalanced} from './InventrixRebalanced';
import {MidasRebalanced} from './MidasRebalanced';
import {MiningGuildRebalanced} from './MiningGuildRebalanced';
import {OdysseyRebalanced} from './OdysseyRebalanced';
import {PalladinShippingRebalanced} from './PalladinShippingRebalanced';
import {PhoboLogRebalanced} from './PhoboLogRebalanced';
import {PristarRebalanced} from './PristarRebalanced';
import {SolBankRebalanced} from './SolBankRebalanced';
import {StormcraftIncorporatedRebalanced} from './StormcraftIncorporatedRebalanced';
import {TharsisRepublicRebalanced} from './TharsisRepublicRebalanced';
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
    [CardName.MIDAS_REBALANCED]: {Factory: MidasRebalanced},
    [CardName.FACTORUM_REBALANCED]: {Factory: FactorumRebalanced},
    [CardName.HELION_REBALANCED]: {Factory: HelionRebalanced},
    [CardName.MINING_GUILD_REBALANCED]: {Factory: MiningGuildRebalanced},
    [CardName.PHOBOLOG_REBALANCED]: {Factory: PhoboLogRebalanced},
    [CardName.PALLADIN_SHIPPING_REBALANCED]: {Factory: PalladinShippingRebalanced},
    [CardName.THARSIS_REPUBLIC_REBALANCED]: {Factory: TharsisRepublicRebalanced},
    [CardName.STORMCRAFT_INCORPORATED_REBALANCED]: {Factory: StormcraftIncorporatedRebalanced},
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
    CardName.MIDAS,
    CardName.FACTORUM,
    CardName.HELION,
    CardName.MINING_GUILD,
    CardName.PHOBOLOG,
    CardName.PALLADIN_SHIPPING,
    CardName.THARSIS_REPUBLIC,
    CardName.STORMCRAFT_INCORPORATED,
  ],
});

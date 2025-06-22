import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {BiomassReactor} from './BiomassReactor';
import {FuelCellProduction} from './FuelCellProduction';
import {GrandStadium} from './GrandStadium';
import {HighSpeedComet} from './HighSpeedComet';
import {LaserDrillMining} from './LaserDrillMining';
import {NearMissRotaryAsteroid} from './NearMissRotaryAsteroid';
import {PerfluorocarbonProduction} from './PerfluorocarbonProduction';
import {PortOfElysium} from './PortOfElysium';
import {SpeciesCryopreservation} from './SpeciesCryopreservation';
import {SponsoredResearchFirm} from './SponsoredResearchFirm';
import {WaypointColony} from './WaypointColony';

export const CHEMICAL_CARD_MANIFEST = new ModuleManifest({
  module: 'chemical',
  corporationCards: {
  },
  preludeCards: {
  },
  projectCards: {
    [CardName.SPONSORED_RESEARCH_FIRM]: {Factory: SponsoredResearchFirm},
    [CardName.NEAR_MISS_ROTARY_ASTEROID]: {Factory: NearMissRotaryAsteroid, compatibility: 'venus'},
    [CardName.HIGH_SPEED_COMET]: {Factory: HighSpeedComet},
    [CardName.LASER_DRILL_MINING]: {Factory: LaserDrillMining},
    [CardName.FUEL_CELL_PRODUCTION]: {Factory: FuelCellProduction},
    [CardName.SPECIES_CRYOPRESERVATION]: {Factory: SpeciesCryopreservation},
    [CardName.GRAND_STADIUM]: {Factory: GrandStadium},
    [CardName.BIOMASS_REACTOR]: {Factory: BiomassReactor},
    [CardName.PERFLUOROCARBON_PRODUCTION]: {Factory: PerfluorocarbonProduction},
    [CardName.PORT_OF_ELYSIUM]: {Factory: PortOfElysium, compatibility: 'colonies'},
    [CardName.WAYPOINT_COLONY]: {Factory: WaypointColony, compatibility: 'colonies'},
  },
  globalEvents: {
  },
});

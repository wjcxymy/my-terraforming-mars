import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {AquaticBiodomes} from './AquaticBiodomes';
import {BiomassReactor} from './BiomassReactor';
import {CallistoOperations} from './CallistoOperations';
import {ConstructionCenter} from './ConstructionCenter';
import {Crowdfunding} from './Crowdfunding';
import {EfficientBatteries} from './EfficientBatteries';
import {FuelCellProduction} from './FuelCellProduction';
import {GrandStadium} from './GrandStadium';
import {HighSpeedComet} from './HighSpeedComet';
import {LargePowerPlant} from './LargePowerPlant';
import {LaserDrillMining} from './LaserDrillMining';
import {Mixotrophs} from './Mixotrophs';
import {NearMissRotaryAsteroid} from './NearMissRotaryAsteroid';
import {PerfluorocarbonProduction} from './PerfluorocarbonProduction';
import {PortOfElysium} from './PortOfElysium';
import {PowerSurge} from './PowerSurge';
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
    [CardName.AQUATIC_BIODOMES]: {Factory: AquaticBiodomes},
    [CardName.MIXOTROPHS]: {Factory: Mixotrophs},
    [CardName.EFFICIENT_BATTERIES]: {Factory: EfficientBatteries},
    [CardName.LARGE_POWER_PLANT]: {Factory: LargePowerPlant},
    [CardName.CALLISTO_OPERATIONS]: {Factory: CallistoOperations},
    [CardName.POWER_SURGE]: {Factory: PowerSurge},
    [CardName.CROWDFUNDING]: {Factory: Crowdfunding},
    [CardName.CONSTRUCTION_CENTER]: {Factory: ConstructionCenter},
  },
  globalEvents: {
  },
});

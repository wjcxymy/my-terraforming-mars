import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {AquaticBiodomes} from './AquaticBiodomes';
import {BiomassReactor} from './BiomassReactor';
import {CallistoOperations} from './CallistoOperations';
import {ConstructionCenter} from './ConstructionCenter';
import {Crowdfunding} from './Crowdfunding';
import {DataCenter} from './DataCenter';
import {EfficientBatteries} from './EfficientBatteries';
import {FirstMartianMemorial} from './FirstMartianMemorial';
import {FuelCellProduction} from './FuelCellProduction';
import {GalileanGovernor} from './GalileanGovernor';
import {GrandStadium} from './GrandStadium';
import {HighSpeedComet} from './HighSpeedComet';
import {Kickbacks} from './Kickbacks';
import {KugelblitzEngine} from './KugelblitzEngine';
import {LargePowerPlant} from './LargePowerPlant';
import {LaserDrillMining} from './LaserDrillMining';
import {MartianResearchNetwork} from './MartianResearchNetwork';
import {Mixotrophs} from './Mixotrophs';
import {NearMissRotaryAsteroid} from './NearMissRotaryAsteroid';
import {NovaFoundry} from './NovaFoundry';
import {Parasite} from './Parasite';
import {PerfluorocarbonProduction} from './PerfluorocarbonProduction';
import {PortOfElysium} from './PortOfElysium';
import {PowerFailure} from './PowerFailure';
import {PowerSurge} from './PowerSurge';
import {SmallSupplyDrop} from './SmallSupplyDrop';
import {SolarStation} from './SolarStation';
import {SpeciesCryopreservation} from './SpeciesCryopreservation';
import {SponsoredResearchFirm} from './SponsoredResearchFirm';
import {WaypointColony} from './WaypointColony';
import {WorkerDrones} from './WorkerDrones';

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
    [CardName.POWER_FAILURE]: {Factory: PowerFailure},
    [CardName.PARASITE]: {Factory: Parasite},
    [CardName.SMALL_SUPPLY_DROP]: {Factory: SmallSupplyDrop},
    [CardName.NOVA_FOUNDRY]: {Factory: NovaFoundry},
    [CardName.KUGELBLITZ_ENGINE]: {Factory: KugelblitzEngine},
    [CardName.GALILEAN_GOVERNOR]: {Factory: GalileanGovernor},
    [CardName.SOLAR_STATION]: {Factory: SolarStation},
    [CardName.DATA_CENTER]: {Factory: DataCenter},
    [CardName.WORKER_DRONES]: {Factory: WorkerDrones, compatibility: 'venus'},
    [CardName.KICKBACKS]: {Factory: Kickbacks, compatibility: 'turmoil'},
    [CardName.FIRST_MARTIAN_MEMORIAL]: {Factory: FirstMartianMemorial, compatibility: 'turmoil'},
    [CardName.MARTIAN_RESEARCH_NETWORK]: {Factory: MartianResearchNetwork},
  },
  globalEvents: {
  },
});

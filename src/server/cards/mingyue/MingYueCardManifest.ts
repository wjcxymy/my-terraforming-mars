import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {ProjectReorganization} from './ProjectReorganization';
import {AsteroidMaterialResearchCenter} from './AsteroidMaterialResearchCenter';
import {TrisynInstitute} from './corporations/TrisynInstitute';
import {LunaChain} from './corporations/LunaChain';
import {Tithes} from './corporations/Tithes';
import {ResourcePlanningBureau} from './ResourcePlanningBureau';
import {SpaceWedding} from './SpaceWedding';
import {InfiniteMonkeyTheorem} from './InfiniteMonkeyTheorem';
import {GoldenFinger} from './corporations/GoldenFinger';
import {FloralBloomSurge} from './FloralBloomSurge';
import {EcologicalPavilion} from './EcologicalPavilion';
import {GamblingDistrictLasVegas} from './GamblingDistrictLasVegas';
import {ArtifactHarvest} from './ArtifactHarvest';
import {WorldLineVoyager} from './corporations/WorldLineVoyager';
import {DivergenciesAssort} from './DivergenciesAssort';
import {InfinityCircuit} from './corporations/InfinityCircuit';
import {HeavyworksCreed} from './corporations/HeavyworksCreed';
import {NookConstruction} from './corporations/NookConstruction';
import {MoonlitWarren} from './MoonlitWarren';
import {MicrobialReactor} from './MicrobialReactor';
import {MarsMonument} from './MarsMonument';
import {RainbowPark} from './corporations/RainbowPark';
import {ExpansionOfPopulation} from './ExpansionOfPopulation';
import {ForesightTechnologies} from './corporations/ForesightTechnologies';
import {ImmediateActionCorp} from './corporations/ImmediateActionCorp';
import {Slum} from './Slum';
import {Overtime} from './Overtime';
import {Poachers} from './Poachers';
import {CoastalResort} from './CoastalResort';
import {FlowingCloud} from './corporations/FlowingCloud';
import {AbnormalTitan} from './corporations/AbnormalTitan';
import {Void} from './corporations/Void';
import {DataCommunicationCenter} from './corporations/DataCommunicationCenter';
import {EcosphereGuardianDrones} from './EcosphereGuardianDrones';

export const MINGYUE_CARD_MANIFEST = new ModuleManifest({
  module: 'mingyue',
  corporationCards: {
    [CardName.TRISYN_INSTITUTE]: {Factory: TrisynInstitute},
    [CardName.LUNA_CHAIN]: {Factory: LunaChain, compatibility: 'mingyue'},
    [CardName.TITHES]: {Factory: Tithes},
    [CardName.GOLDEN_FINGER]: {Factory: GoldenFinger},
    [CardName.WORLD_LINE_VOYAGER]: {Factory: WorldLineVoyager, compatibility: 'mingyue'},
    [CardName.INFINITY_CIRCUIT]: {Factory: InfinityCircuit},
    [CardName.HEAVYWORKS_CREED]: {Factory: HeavyworksCreed},
    [CardName.NOOK_CONSTRUCTION]: {Factory: NookConstruction},
    [CardName.RAINBOW_PARK]: {Factory: RainbowPark},
    [CardName.FORESIGHT_TECHNOLOGIES]: {Factory: ForesightTechnologies},
    [CardName.IMMEDIATE_ACTION_CORP]: {Factory: ImmediateActionCorp},
    [CardName.FLOWING_CLOUD]: {Factory: FlowingCloud, compatibility: 'venus'},
    [CardName.ABNORMAL_TITAN]: {Factory: AbnormalTitan},
    [CardName.VOID]: {Factory: Void},
    [CardName.DATA_COMMUNICATION_CENTER]: {Factory: DataCommunicationCenter},
  },
  preludeCards: {
  },
  projectCards: {
    [CardName.PROJECT_REORGANIZATION]: {Factory: ProjectReorganization},
    [CardName.ASTEROID_MATERIAL_RESEARCH_CENTER]: {Factory: AsteroidMaterialResearchCenter},
    [CardName.RESOURCE_PLANNING_BUREAU]: {Factory: ResourcePlanningBureau},
    [CardName.SPACE_WEDDING]: {Factory: SpaceWedding},
    [CardName.INFINITE_MONKEY_THEOREM]: {Factory: InfiniteMonkeyTheorem},
    [CardName.FLORAL_BLOOM_SURGE]: {Factory: FloralBloomSurge},
    [CardName.ECOLOGICAL_PAVILION]: {Factory: EcologicalPavilion},
    [CardName.ARTIFACT_HARVEST]: {Factory: ArtifactHarvest},
    [CardName.DIVERGENCIES_ASSORT]: {Factory: DivergenciesAssort},
    [CardName.MOONLIT_WARREN]: {Factory: MoonlitWarren},
    [CardName.MICROBIAL_REACTOR]: {Factory: MicrobialReactor},
    [CardName.MARS_MONUMENT]: {Factory: MarsMonument},
    [CardName.EXPANSION_OF_POPULATION]: {Factory: ExpansionOfPopulation},
    [CardName.GAMBLING_DISTRICT_LAS_VEGAS]: {Factory: GamblingDistrictLasVegas, compatibility: 'ares'},
    [CardName.SLUM]: {Factory: Slum},
    [CardName.OVERTIME]: {Factory: Overtime},
    [CardName.POACHERS]: {Factory: Poachers},
    [CardName.COASTAL_RESORT]: {Factory: CoastalResort, compatibility: 'ares'},
    [CardName.ECOSPHERE_GUARDIAN_DRONES]: {Factory: EcosphereGuardianDrones},
  },
  globalEvents: {
  },
});

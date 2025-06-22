import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {ProjectReorganization} from './ProjectReorganization';
import {AsteroidMaterialResearchCenter} from './AsteroidMaterialResearchCenter';
import {TrisynInstitute} from './TrisynInstitute';
import {LunaChain} from './LunaChain';
import {Tithes} from './Tithes';
import {ResourcePlanningBureau} from './ResourcePlanningBureau';
import {SpaceWedding} from './SpaceWedding';
import {InfiniteMonkeyTheorem} from './InfiniteMonkeyTheorem';
import {GoldenFinger} from './GoldenFinger';
import {FloralBloomSurge} from './FloralBloomSurge';
import {EcologicalPavilion} from './EcologicalPavilion';
import {GamblingDistrictLasVegas} from './GamblingDistrictLasVegas';
import {ArtifactHarvest} from './ArtifactHarvest';
import {WorldLineVoyager} from './WorldLineVoyager';
import {DivergenciesAssort} from './DivergenciesAssort';
import {InfinityCircuit} from './InfinityCircuit';
import {HeavyworksCreed} from './HeavyworksCreed';
import {NookConstruction} from './NookConstruction';
import {MoonlitWarren} from './MoonlitWarren';
import {MicrobialReactor} from './MicrobialReactor';
import {MarsMonument} from './MarsMonument';
import {RainbowPark} from './RainbowPark';
import {ExpansionOfPopulation} from './ExpansionOfPopulation';
import {ForesightTechnologies} from './ForesightTechnologies';

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
  },
  globalEvents: {
  },
});

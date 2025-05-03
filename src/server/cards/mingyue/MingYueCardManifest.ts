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

export const MINGYUE_CARD_MANIFEST = new ModuleManifest({
  module: 'mingyue',
  corporationCards: {
    [CardName.TRISYN_INSTITUTE]: {Factory: TrisynInstitute},
    [CardName.LUNA_CHAIN]: {Factory: LunaChain, compatibility: 'mingyue'},
    [CardName.TITHES]: {Factory: Tithes},
    [CardName.GOLDEN_FINGER]: {Factory: GoldenFinger},
    [CardName.WORLD_LINE_VOYAGER]: {Factory: WorldLineVoyager, compatibility: 'mingyue'},
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
    [CardName.GAMBLING_DISTRICT_LAS_VEGAS]: {Factory: GamblingDistrictLasVegas, compatibility: 'ares'},
  },
  globalEvents: {
  },
});

import {CardName} from '../../../common/cards/CardName';
import {ModuleManifest} from '../ModuleManifest';
import {ArklightRebalanced} from './ArklightRebalanced';
import {InterplanetaryCinematicsRebalanced} from './InterplanetaryCinematicsRebalanced';

export const REBALANCED_CARD_MANIFEST = new ModuleManifest({
  module: 'rebalanced',
  corporationCards: {
    [CardName.ARKLIGHT_REBALANCED]: {Factory: ArklightRebalanced},
  },
  preludeCards: {
  },
  projectCards: {
  },
  globalEvents: {
  },
  cardsToRemove: [
    CardName.ARKLIGHT,
  ],
});

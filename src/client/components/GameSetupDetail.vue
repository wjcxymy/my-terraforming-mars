<template>
        <div id="game-setup-detail" class="game-setup-detail-container">
          <ul>
            <li><div class="setup-item" v-i18n>Expansion:</div>
              <div v-if="gameOptions.expansions.venus" class="create-game-expansion-icon expansion-icon-venus"></div>
              <div v-if="gameOptions.expansions.prelude" class="create-game-expansion-icon expansion-icon-prelude"></div>
              <div v-if="gameOptions.expansions.prelude2" class="create-game-expansion-icon expansion-icon-prelude2"></div>
              <div v-if="gameOptions.expansions.colonies" class="create-game-expansion-icon expansion-icon-colony"></div>
              <div v-if="gameOptions.expansions.turmoil" class="create-game-expansion-icon expansion-icon-turmoil"></div>
              <div v-if="gameOptions.expansions.promo" class="create-game-expansion-icon expansion-icon-promo"></div>
              <div v-if="gameOptions.expansions.ares" class="create-game-expansion-icon expansion-icon-ares"></div>
              <div v-if="gameOptions.expansions.moon" class="create-game-expansion-icon expansion-icon-themoon"></div>
              <div v-if="gameOptions.expansions.pathfinders" class="create-game-expansion-icon expansion-icon-pathfinders"></div>
              <div v-if="gameOptions.expansions.community" class="create-game-expansion-icon expansion-icon-community"></div>
              <div v-if="isPoliticalAgendasOn" class="create-game-expansion-icon expansion-icon-agendas"></div>
              <div v-if="gameOptions.expansions.ceo" class="create-game-expansion-icon expansion-icon-ceo"></div>
              <div v-if="gameOptions.expansions.underworld" class="create-game-expansion-icon expansion-icon-underworld"></div>
              <div v-if="gameOptions.expansions.mingyue" class="create-game-expansion-icon expansion-icon-mingyue"></div>
              <div v-if="gameOptions.expansions.rebalanced" class="create-game-expansion-icon expansion-icon-rebalanced"></div>
              <div v-if="gameOptions.expansions.chemical" class="create-game-expansion-icon expansion-icon-chemical"></div>
            </li>

            <li><div class="setup-item" v-i18n>Board:</div>
              <span :class="boardColorClass" v-i18n>{{ gameOptions.boardName }}</span>
              &nbsp;
              <span v-if="gameOptions.shuffleMapOption" class="game-config generic" v-i18n>(randomized tiles)</span>
            </li>

            <li><div class="setup-item" v-i18n>WGT:</div>
              <div v-if="gameOptions.solarPhaseOption" class="game-config generic" v-i18n>On</div>
              <div v-else class="game-config generic" v-i18n>Off</div>
            </li>
            <li v-if="gameOptions.requiresVenusTrackCompletion" v-i18n>Require terraforming Venus to end the game</li>
            <li v-if="gameOptions.requiresMoonTrackCompletion" v-i18n>Require terraforming The Moon to end the game</li>

            <li v-if="playerNumber > 1">
              <div class="setup-item" v-i18n>Milestones and Awards:</div>

              <div v-if="gameOptions.randomMA === RandomMAOptionType.NONE" class="game-config generic" v-i18n>Board-defined</div>
              <div v-if="gameOptions.randomMA === RandomMAOptionType.LIMITED" class="game-config generic" v-i18n>Randomized with limited synergy</div>
              <div v-if="gameOptions.randomMA === RandomMAOptionType.UNLIMITED" class="game-config generic" v-i18n>Full randomized</div>
              <div v-if="gameOptions.randomMA !== RandomMAOptionType.NONE && gameOptions.includeFanMA" class="game-config generic" v-i18n>Include fan Milestones/Awards</div>
            </li>

            <li v-if="playerNumber > 1">
              <div class="setup-item" v-i18n>Draft:</div>
              <div v-if="gameOptions.initialDraftVariant" class="game-config generic" v-i18n>Initial</div>
              <div v-if="gameOptions.draftVariant" class="game-config generic" v-i18n>Research phase</div>
              <div v-if="!gameOptions.initialDraftVariant && !gameOptions.draftVariant" class="game-config generic" v-i18n>Off</div>
              <div v-if="gameOptions.corporationDraftVariant" class="game-config generic" v-i18n>Corporation</div>
              <div v-if="gameOptions.preludeDraftVariant" class="game-config generic" v-i18n>Prelude</div>
            </li>

            <li v-if="gameOptions.escapeVelocityMode">
              <div class="create-game-expansion-icon expansion-icon-escape-velocity"></div>
              <span>{{escapeVelocityDescription}}</span>
            </li>

            <li v-if="gameOptions.expansions.venus && gameOptions.removeNegativeGlobalEvents">
              <div class="setup-item" v-i18n>Turmoil:</div>
              <div class="game-config generic" v-i18n>No negative Turmoil event</div>
            </li>

            <li v-if="playerNumber === 1">
              <div class="setup-item" v-i18n>Solo:</div>
              <div class="game-config generic" v-i18n>{{ this.lastSoloGeneration }} Gens</div>
              <div v-if="gameOptions.soloTR" class="game-config generic" v-i18n>63 TR</div>
              <div v-else class="game-config generic" v-i18n>TR all</div>
            </li>

            <li><div class="setup-item" v-i18n>Game configs:</div>
              <div v-if="gameOptions.fastModeOption" class="game-config fastmode" v-i18n>fast mode</div>
              <div v-if="gameOptions.showTimers" class="game-config timer" v-i18n>timer</div>
              <div v-if="gameOptions.showOtherPlayersVP" class="game-config realtime-vp" v-i18n>real-time vp</div>
              <div v-if="gameOptions.undoOption" class="game-config undo" v-i18n>undo</div>
              <div v-if="gameOptions.sevenHeatVariant" class="game-config sevenHeat" v-i18n>7热升温</div>
              <div v-if="gameOptions.twoCorpsVariant" class="game-config twoCorps" v-i18n>Merger</div>
              <div v-if="gameOptions.doubleCorpVariant" class="game-config doubleCorp" v-i18n>双公司</div>
            </li>
            <li v-if="gameOptions.bannedCards.length > 0"><div class="setup-item" v-i18n>Banned cards:</div>{{ gameOptions.bannedCards.join(', ') }}</li>
          </ul>
        </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {GameOptionsModel} from '@/common/models/GameOptionsModel';
import {BoardName} from '@/common/boards/BoardName';
import {RandomMAOptionType} from '@/common/ma/RandomMAOptionType';
import {translateTextWithParams} from '@/client/directives/i18n';

const boardColorClass: Record<BoardName, string> = {
  [BoardName.THARSIS]: 'game-config board-tharsis map',
  [BoardName.HELLAS]: 'game-config board-hellas map',
  [BoardName.ELYSIUM]: 'game-config board-elysium map',
  [BoardName.UTOPIA_PLANITIA]: 'game-config board-utopia-planitia map',
  [BoardName.VASTITAS_BOREALIS_NOVUS]: 'game-config board-vastitas_borealis_novus map',
  [BoardName.TERRA_CIMMERIA_NOVUS]: 'game-config board-terra_cimmeria_novus map',
  [BoardName.AMAZONIS]: 'game-config board-amazonis map',
  [BoardName.ARABIA_TERRA]: 'game-config board-arabia_terra map',
  [BoardName.VASTITAS_BOREALIS]: 'game-config board-vastitas_borealis map',
  [BoardName.TERRA_CIMMERIA]: 'game-config board-terra_cimmeria map',
};

export default Vue.extend({
  name: 'game-setup-detail',
  props: {
    playerNumber: {
      type: Number,
    },
    gameOptions: {
      type: Object as () => GameOptionsModel,
    },
    lastSoloGeneration: {
      type: Number,
    },
  },
  computed: {
    isPoliticalAgendasOn(): boolean {
      return (this.gameOptions.politicalAgendasExtension !== 'Standard');
    },
    boardColorClass(): string {
      return boardColorClass[this.gameOptions.boardName];
    },
    escapeVelocityDescription(): string {
      const {escapeVelocityThreshold, escapeVelocityPenalty, escapeVelocityPeriod, escapeVelocityBonusSeconds} = this.gameOptions ?? {};

      if (escapeVelocityThreshold === undefined || escapeVelocityPenalty === undefined || escapeVelocityPeriod === undefined || escapeVelocityBonusSeconds === undefined) {
        return '';
      }
      return translateTextWithParams('After ${0} min, reduce ${1} VP every ${2} min. (${3} bonus sec. per action.)', [escapeVelocityThreshold.toString(), escapeVelocityPenalty.toString(), escapeVelocityPeriod.toString(), escapeVelocityBonusSeconds.toString()]);
    },
    RandomMAOptionType(): typeof RandomMAOptionType {
      return RandomMAOptionType;
    },
  },
});

</script>

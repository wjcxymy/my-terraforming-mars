<template>
  <div class="ma-block">
    <div class="ma-player" v-if="milestone.playerName">
      <i :title="milestone.playerName" class="board-cube" :class="`board-cube--${milestone.playerColor}`" />
    </div>
    <div class="ma-name--milestones" :class="nameCss">
      <span v-i18n>{{milestone.name}}</span>
      <div v-if="showScores" class="ma-scores player_home_block--milestones-and-awards-scores">
        <p
          v-for="score in sortedScores"
          :key="score.playerColor"
          class="ma-score"
          :class="`player_bg_color_${score.playerColor}`"
          v-text="score.playerScore"
          data-test="player-score"
        />
      </div>
    </div>

    <div v-if="showDescription" class="ma-description">
      <span v-i18n>{{ description }}</span>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {ClaimedMilestoneModel, MilestoneScore} from '@/common/models/ClaimedMilestoneModel';
import {getMilestone} from '@/client/MilestoneAwardManifest';
export default Vue.extend({
  name: 'Milestone',
  props: {
    milestone: {
      type: Object as () => ClaimedMilestoneModel,
    },
    showScores: {
      type: Boolean,
      default: true,
    },
    showDescription: {
      type: Boolean,
    },
  },
  computed: {
    nameCss(): string {
      return 'ma-name ma-name--' + this.milestone.name.replace(/ /g, '-').replace(/\./g, '').toLowerCase();
    },
    sortedScores(): Array<MilestoneScore> {
      return [...this.milestone.scores].sort((s1, s2) => s2.playerScore - s1.playerScore);
    },
    description(): string {
      return getMilestone(this.milestone.name).description;
    },
  },
});
</script>

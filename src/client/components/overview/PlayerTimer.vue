<template>
  <div class="player-timer">
    <template v-if="hasHours()">
        <div class="player-timer-hours">{{ getHours() }}</div>
        <div class="timer-delimiter">:</div>
    </template>
    <div class="player-timer-minutes">{{ getMinutes() }}</div>
    <div class="timer-delimiter">:</div>
    <div class="player-timer-seconds">{{ getSeconds() }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Timer} from '@/common/Timer';
import {TimerModel} from '@/common/models/TimerModel';

export default Vue.extend({
  name: 'PlayerTimer',
  props: {
    timer: {
      type: Object as () => TimerModel,
    },
    live: {
      type: Boolean,
    },
    isCountdown: {
      type: Boolean,
    },
    countdownThresholdMinutes: {
      type: Number,
    },
    countdownBonusSeconds: {
      type: Number,
    },
    playerActions: {
      type: Number,
    },
  },
  data() {
    return {
      timerText: '',
    };
  },
  mounted() {
    this.updateTimer();
  },
  watch: {
    timerText: {
      handler() {
        if (this.live) {
          setTimeout(() => {
            this.updateTimer();
          }, 1000);
        }
      },
    },
  },
  methods: {
    updateTimer() {
      if (this.isCountdown) {
        const baseSeconds = this.countdownThresholdMinutes * 60;
        const bonusSeconds = this.playerActions * this.countdownBonusSeconds;
        const totalAvailableSeconds = baseSeconds + bonusSeconds;
        const elapsedSeconds = Timer.getElapsedSeconds(this.timer);
        const remainingSeconds = totalAvailableSeconds - elapsedSeconds;
        this.timerText = this.formatTimeFromSeconds(remainingSeconds);
      } else {
        this.timerText = Timer.toString(this.timer);
      }
    },
    formatTimeFromSeconds(totalSeconds: number): string {
      const prefix = totalSeconds < 0 ? '-' : '';
      const absoluteSeconds = Math.abs(totalSeconds);

      const hours = Math.floor(absoluteSeconds / 3600);
      const minutes = Math.floor((absoluteSeconds % 3600) / 60);
      const seconds = Math.floor(absoluteSeconds % 60);

      const paddedMinutes = String(minutes).padStart(2, '0');
      const paddedSeconds = String(seconds).padStart(2, '0');

      if (hours > 0) {
        return `${prefix}${hours}:${paddedMinutes}:${paddedSeconds}`;
      }
      return `${prefix}${minutes}:${paddedSeconds}`;
    },
    hasHours() {
      if (this.timerText.split(':').length > 2) {
        return 1;
      }
      return 0;
    },
    getHours(): string {
      if (this.hasHours()) {
        return this.timerText.split(':')[0];
      }
      return '';
    },
    getMinutes(): string {
      if (this.hasHours()) {
        return this.timerText.split(':')[1];
      }
      return this.timerText.split(':')[0];
    },
    getSeconds(): string {
      if (this.hasHours()) {
        return this.timerText.split(':')[2];
      }
      return this.timerText.split(':')[1];
    },
  },
});
</script>

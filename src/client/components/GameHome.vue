<template>
      <div id="game-home" class="game-home-container">
        <h1><span v-i18n>Terraforming Mars</span> [<span v-i18n>game id:</span> <span>{{getGameId()}}</span>]</h1>
        <h4><span v-i18n>Instructions: To start the game, separately copy and share the links with all players, and then click on your name.</span><br/><span v-i18n>Save this page in case you or one of your opponents loses a link.</span></h4>
        <div class="rollback-ui" v-if="game && game.lastSaveId !== undefined" style="margin-top: 1em;">
          <h4 style="display: flex; align-items: center; gap: 1em;">
            <span>Last Save Id: {{ game.lastSaveId }}</span>
            <AppButton title="ROLLBACK" size="medium" @click="rollbackToLastSave" />
          </h4>
        </div>
        <ul>
          <li v-for="(player, index) in (game === undefined ? [] : game.players)" :key="player.color">
            <span class="turn-order" v-i18n>{{getTurnOrder(index)}}</span>
            <span :class="'color-square ' + getPlayerCubeColorClass(player.color)">{{playerSymbol(player.color)}}</span>
            <span class="player-name"><a :href="getHref(player.id)">{{player.name}}</a></span>
            <AppButton title="copy" size="tiny" @click="copyUrl(player.id)"/>
            <span v-if="isPlayerUrlCopied(player.id)" class="copied-notice"><span v-i18n>Copied!</span></span>
          </li>
          <li v-if="game !== undefined && game.spectatorId">
            <p/>
            <span class="turn-order"></span>
            <span class="color-square"></span>
            <span class="player-name"><a :href="getHref(game.spectatorId)" v-i18n>Spectator</a></span>
            <AppButton title="copy" size="tiny" @click="copyUrl(game.spectatorId)"/>
          </li>
        </ul>

        <div class="spacing-setup"></div>

        <purge-warning :expectedPurgeTimeMs="game.expectedPurgeTimeMs"></purge-warning>

        <div class="spacing-setup"></div>
        <div v-if="game !== undefined">
          <h1 v-i18n>Game settings</h1>
          <game-setup-detail :gameOptions="game.gameOptions" :playerNumber="game.players.length" :lastSoloGeneration="game.lastSoloGeneration"></game-setup-detail>
        </div>
      </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {SimpleGameModel} from '@/common/models/SimpleGameModel';
import AppButton from '@/client/components/common/AppButton.vue';
import PurgeWarning from '@/client/components/common/PurgeWarning.vue';
import {playerColorClass} from '@/common/utils/utils';
import GameSetupDetail from '@/client/components/GameSetupDetail.vue';
import {ParticipantId} from '@/common/Types';
import {Color} from '@/common/Color';
import {playerSymbol} from '@/client/utils/playerSymbol';

// taken from https://stackoverflow.com/a/46215202/83336
// The solution to copying to the clipboard in this case is
// 1. create a dummy input
// 2. add the copied text as a value
// 3. select the input
// 4. execute document.execCommand('copy') which does the clipboard thing
// 5. remove the dummy input
function copyToClipboard(text: string): void {
  const input = document.createElement('input');
  input.setAttribute('value', text);
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}
const DEFAULT_COPIED_PLAYER_ID = '-1';

export default Vue.extend({
  name: 'game-home',
  props: {
    game: {
      type: Object as () => SimpleGameModel,
    },
  },
  components: {
    AppButton,
    'game-setup-detail': GameSetupDetail,
    PurgeWarning,
  },
  data() {
    return {
      // Variable to keep the state for the current copied player id. Used to display message of which button and which player playable link is currently in the clipboard
      urlCopiedPlayerId: DEFAULT_COPIED_PLAYER_ID,
    };
  },
  methods: {
    getGameId(): string {
      return this.game !== undefined ? this.game.id.toString() : 'n/a';
    },
    getTurnOrder(index: number): string {
      if (index === 0) {
        return '1st';
      } else if (index === 1) {
        return '2nd';
      } else if (index === 2) {
        return '3rd';
      } else if (index > 2) {
        return `${index + 1}th`;
      } else {
        return 'n/a';
      }
    },
    setCopiedIdToDefault() {
      this.urlCopiedPlayerId = DEFAULT_COPIED_PLAYER_ID;
    },
    getPlayerCubeColorClass(color: Color): string {
      return playerColorClass(color, 'bg');
    },
    getHref(playerId: ParticipantId): string {
      if (playerId === this.game.spectatorId) {
        return `spectator?id=${playerId}`;
      }
      return `player?id=${playerId}`;
    },
    copyUrl(playerId: ParticipantId | undefined): void {
      if (playerId === undefined) return;
      // Get current location path without game?id=xxxxxxx
      const path = window.location.href.replace(/game\?id=.*/, '');
      copyToClipboard(path + this.getHref(playerId));
      this.urlCopiedPlayerId = playerId;
    },
    isPlayerUrlCopied(playerId: string): boolean {
      return playerId === this.urlCopiedPlayerId;
    },
    playerSymbol(color: Color) {
      return playerSymbol(color);
    },
    async rollbackToLastSave() {
      if (!this.game) return;

      // 发送 POST 请求到后端 API，包含 gameId
      try {
        const response = await fetch(`/api/gamerollback?gameId=${this.game.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // 检查请求是否成功
        if (response.ok) {
          window.alert('回退成功，正在重新加载...');
          window.location.reload();
        } else {
          const errorText = await response.text();
          window.alert(`回退失败：${errorText}`);
        }
      } catch (error) {
        console.error('回退过程中发生错误：', error);
        window.alert('回退操作时发生错误，请稍后再试。');
      }
    },
  },
});

</script>


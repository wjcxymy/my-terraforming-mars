<template>
<div class="start-screen">
  <div v-i18n class="start-screen-links">
    <div class="start-screen-header start-screen-link--title">
      <div class="start-screen-title-top">TERRAFORMING</div>
      <div class="start-screen-title-bottom">MARS</div>
    </div>
    <a class="start-screen-link start-screen-link--new-game" href="new-game" v-i18n>New game</a>
    <a class="start-screen-link start-screen-link--how-to-play" href="https://github.com/terraforming-mars/terraforming-mars/wiki/Rulebooks" target="_blank" v-i18n>How to Play</a>
    <a class="start-screen-link start-screen-link--cards-list" href="cards" target="_blank" v-i18n>Cards list</a>
    <a class="start-screen-link start-screen-link--board-game" href="https://boardgamegeek.com/boardgame/167791/terraforming-mars" target="_blank" v-i18n>Board game</a>
    <a class="start-screen-link start-screen-link--about" href="https://github.com/terraforming-mars/terraforming-mars#README" target="_blank" v-i18n>About us</a>
    <a class="start-screen-link start-screen-link--changelog" href="https://github.com/terraforming-mars/terraforming-mars/wiki/Changelog" target="_blank" v-i18n>Whats new?</a>
    <a class="start-screen-link start-screen-link--chat" :href="DISCORD_INVITE" target="_blank" v-i18n>Join us on Discord</a>
    <div class="start-screen-header start-screen-link--languages">
      <language-switcher />
      <div class="start-screen-version-cont">
        <div class="nowrap start-screen-date"><span v-i18n>deployed</span>: {{raw_settings.builtAt}}</div>
        <div class="nowrap start-screen-version"><span v-i18n>version</span>: {{raw_settings.head}}</div>
      </div>
      <div class="source-code">
        <a href="https://github.com/wjcxymy/my-terraforming-mars" target="_blank" class="source-code-text">
        <img src="assets/misc/github.png" class="source-code-img">
          source code
        </a>
      </div>
    </div>
  </div>
  <div class="free-floating-preferences-icon">
    <preferences-icon></preferences-icon>
  </div>
</div>
</template>

<script lang="ts">

import Vue from 'vue';
import LanguageSwitcher from '@/client/components/LanguageSwitcher.vue';
import PreferencesIcon from '@/client/components/PreferencesIcon.vue';

import * as raw_settings from '@/genfiles/settings.json';
import * as constants from '@/common/constants';

export default Vue.extend({
  name: 'start-screen',
  components: {
    LanguageSwitcher,
    PreferencesIcon,
  },
  computed: {
    raw_settings(): typeof raw_settings {
      return raw_settings;
    },
    DISCORD_INVITE(): string {
      return constants.DISCORD_INVITE;
    },
  },
});

</script>

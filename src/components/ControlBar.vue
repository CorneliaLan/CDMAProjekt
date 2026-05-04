<template>
  <div class="control-bar">

    <!-- PLAY BUTTON -->
    <button class="play-btn">
      <ion-icon name="play"></ion-icon>
    </button>

    <!-- ACTIONS -->
    <div class="actions">
      <ion-icon name="pause"></ion-icon>
      <ion-icon name="play-skip-forward"></ion-icon>
      <ion-icon name="square-outline"></ion-icon>

      <div class="divider"></div>

      <ion-icon name="refresh"></ion-icon>
    </div>

  </div>
</template>

<script setup lang="ts">
import { colors } from '@/theme/colors'

import { IonIcon } from '@ionic/vue'
import { addIcons } from 'ionicons'
import {
  play,
  pause,
  playSkipForward,
  squareOutline,
  refresh
} from 'ionicons/icons'

addIcons({
  play,
  pause,
  playSkipForward,
  squareOutline,
  refresh
})
</script>

<style scoped>
.control-bar {
  display: flex;
  align-items: center;
  gap: 20px;

  padding: 16px 24px;
  border-radius: 20px;

  background: v-bind('colors.primaryLight');

  box-shadow: 0 8px 20px v-bind('colors.textMuted');
}

/* PLAY BUTTON */
.play-btn {
  width: 48px;
  height: 48px;
  border-radius: 14px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: v-bind('colors.primary');
  border: none;

  cursor: pointer;
}

.play-btn ion-icon {
  color: v-bind('colors.primaryBorder');
  font-size: 22px;
}

/* ACTION ICONS */
.actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.actions ion-icon {
  font-size: 18px;
  color: v-bind('colors.textMuted');
  cursor: pointer;
  transition: 0.2s;
}

.actions ion-icon:hover {
  color: v-bind('colors.primary');
}

/* DIVIDER */
.divider {
  width: 1px;
  height: 24px;
  background: v-bind('colors.line');
}
</style>
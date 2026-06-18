<template>
  <div class="control-bar">

    <!-- PLAY BUTTON -->
    <button class="play-btn" type="button" @click="emit('play')">
      <ion-icon name="play"></ion-icon>
    </button>

    <!-- ACTIONS -->
    <div class="actions">
      <ion-icon name="pause"></ion-icon>
      <ion-icon name="play-skip-forward"></ion-icon>
      <ion-icon name="square-outline"></ion-icon>

      <div class="divider"></div>

      <ion-icon name="refresh" @click="emit('reset')" ></ion-icon>
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

const emit = defineEmits<{
  play: []
  reset: []
}>()
</script>

<style scoped>
.control-bar {
  align-items: center;
  gap: 20px;

  padding: 16px 24px;
  border-radius: 20px;

  background: v-bind('colors.primaryLight');
  border: 1px solid v-bind('colors.primary');
  
  display: flex;
  width: max-content;
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

/* Phone */
@media (max-width: 1000px) {
  .control-bar {
    margin: 0 0;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    
    height: max-content;
  }

  .play-btn {
  width: 36px;
  height: 36px;
  }

  .actions {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .actions ion-icon {
    font-size: 15px;
    padding: 8px;
    text-align: center;
    width: 100%;
  }

  .divider {
    width: 100%;
    height: 1px;
  }
}
</style>

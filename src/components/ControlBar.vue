<template>
  <div class="control-bar">

    <!-- PLAY BUTTON -->
    <button class="primary-btn" type="button" title="Play" aria-label="Play" @click="emit('play')">
      <ion-icon name="play"></ion-icon>
    </button>

    <!-- ACTIONS -->
    <div class="actions">
      <button class="icon-btn" type="button" title="Start debug" aria-label="Start debug" @click="emit('debugStart')">
        <ion-icon name="bug-outline"></ion-icon>
      </button>

      <button
        v-if="debugActive"
        class="icon-btn"
        type="button"
        title="Previous debug step"
        aria-label="Previous debug step"
        :disabled="!canDebugBack"
        @click="emit('debugPrevious')"
      >
        <ion-icon name="play-skip-back"></ion-icon>
      </button>

      <button
        v-if="debugActive"
        class="icon-btn"
        type="button"
        title="Next debug step"
        aria-label="Next debug step"
        :disabled="!canDebugForward"
        @click="emit('debugNext')"
      >
        <ion-icon name="play-skip-forward"></ion-icon>
      </button>

      <div class="divider"></div>

      <button class="icon-btn" type="button" title="Reset" aria-label="Reset" @click="emit('reset')">
        <ion-icon name="refresh"></ion-icon>
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { colors } from '@/theme/colors'

import { IonIcon } from '@ionic/vue'
import { addIcons } from 'ionicons'
import {
  play,
  bugOutline,
  playSkipBack,
  playSkipForward,
  refresh
} from 'ionicons/icons'

addIcons({
  play,
  bugOutline,
  playSkipBack,
  playSkipForward,
  refresh
})

defineProps<{
  debugActive?: boolean
  canDebugBack?: boolean
  canDebugForward?: boolean
}>()

const emit = defineEmits<{
  play: []
  debugStart: []
  debugPrevious: []
  debugNext: []
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

  transition: all 0.2s ease;
}

.primary-btn {
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

.primary-btn ion-icon {
  color: v-bind('colors.primaryBorder');
  font-size: 22px;
}

/* ACTION ICONS */
.actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-btn {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  padding: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
}

.icon-btn ion-icon {
  font-size: 18px;
  color: v-bind('colors.textMuted');
  transition: 0.2s;
}

.icon-btn:hover:not(:disabled) ion-icon {
  color: v-bind('colors.primary');
}

.icon-btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

/* DIVIDER */
.divider {
  width: 1px;
  height: 24px;
  background: v-bind('colors.line');
}

/* Phone 
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

  .icon-btn ion-icon {
    font-size: 20px;
  }

  .divider {
    width: 100%;
    height: 1px;
  }
}*/

@media (max-width: 1000px) {
  .control-bar {
    margin: 0 0;
    flex-direction: column;
    align-items: center;
    
    height: max-content;
    padding: 10px 14px;
    gap: 12px;
    border-radius: 16px;
  }

  .actions {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .divider {
    width: 100%;
    height: 1px;
  }

  .play-btn {
    width: 38px;
    height: 38px;
    border-radius: 12px;
  }

  .play-btn ion-icon {
    font-size: 18px;
  }

  .actions {
    gap: 12px;
  }

  .actions ion-icon {
    font-size: 15px;
  }
}
</style>

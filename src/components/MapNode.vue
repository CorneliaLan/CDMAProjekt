<template>
  <div
    class="node"
    :class="status"
    :style="{
      left: x + 'px',
      top: y + 'px'
    }"
  >
    <div class="diamond">
        <div v-if="status === 'complete'" class="icon-circle">
          <ion-icon name="checkmark"></ion-icon>
        </div>
      <ion-icon v-if="status === 'active'" name="play"></ion-icon>
      <ion-icon v-if="status === 'locked'" name="lock-closed"></ion-icon>
    </div>

    <span v-if="status === 'active'" class="label">ACTIVE</span>

    <p>{{ title }}</p>
  </div>
</template>

<script setup lang="ts">
import { colors } from '@/theme/colors'

import { IonIcon } from '@ionic/vue'
import { addIcons } from 'ionicons'
import { checkmark, play, lockClosed } from 'ionicons/icons'

addIcons({
  checkmark,
  play,
  lockClosed
})

defineProps<{
  title: string
  status: 'complete' | 'active' | 'locked'
  x: number
  y: number
}>()
</script>

<style scoped>
.node {
  position: absolute;
  transform: translate(-50%, -50%);
  text-align: center;
}

.diamond {
  width: 80px;
  height: 80px;
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid v-bind('colors.primaryBorder');

  background: v-bind('colors.background');
}

/* STATES */
.complete .diamond { /* TODO: Farbe aktualisieren: e1e0ff */
  background: v-bind('colors.complete');
}

.active .diamond {
  background: v-bind('colors.active');
  color: white;
  border: 4px solid v-bind('colors.primaryBorder');
  
  box-shadow: 0 0 0 6px v-bind('colors.active');
}

.locked .diamond {
  background: v-bind('colors.locked');
  color: v-bind('colors.textMuted');
}

/* DEFAULT (optional) */
.diamond ion-icon {
  transform: rotate(-45deg);
  font-size: 28px;
}

.icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: v-bind('colors.primaryLight');

  display: flex;
  align-items: center;
  justify-content: center;

  transform: rotate(-45deg);
}

.complete .icon-circle ion-icon {
  color: white;
  transform: none;
  font-size: 20px;
}

/* STATES → ICON COLORS */

/* complete */
.complete .diamond ion-icon {
  color: white;
}

/* active */
.active .diamond ion-icon {
  color: white;
}

/* locked */
.locked .diamond ion-icon {
  color: v-bind('colors.textMuted');
}

/* LABEL */
.label {
  display: inline-block;
  margin-top: 30px;
  font-size: 10px;
  background: v-bind('colors.active');
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
}
</style>
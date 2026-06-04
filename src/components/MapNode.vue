<template>
  <div
    class="node"
    :class="status"
    :role="status === 'locked' ? undefined : 'button'"
    :tabindex="status === 'locked' ? -1 : 0"
    :style="{
      left: x + 'px',
      top: y + 'px'
    }"
    @click="emitSelect"
    @keydown.enter.prevent="emitSelect"
    @keydown.space.prevent="emitSelect"
  >
    <div class="node-inner">

      <div class="diamond">
        <div v-if="status === 'complete'" class="icon-circle">
          <ion-icon name="checkmark"></ion-icon>
        </div>

        <ion-icon v-if="status === 'active'" name="play"></ion-icon>
        <ion-icon v-if="status === 'locked'" name="lock-closed"></ion-icon>
      </div>

      <span v-if="status === 'active'" class="label">ACTIVE</span>

      <p class="title">{{ title }}</p>

    </div>
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

const props = defineProps<{
  title: string
  status: 'complete' | 'active' | 'locked'
  x: number
  y: number
}>()

const emit = defineEmits<{
  (e: 'select'): void
}>()

const emitSelect = () => {
  if (props.status === 'locked') {
    return
  }
  emit('select')
}
</script>

<style scoped>
/* OUTER NODE = POSITION ONLY */
.node {
  position: absolute;
  width: 80px;
  height: 80px;
  cursor: pointer;
  transform: translate(-50%, -50%);
}

.locked {
  cursor: not-allowed;
}

.complete,
.active {
  cursor: pointer;
}

/* INNER LAYOUT WRAPPER */
.node-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* DIAMOND */
.diamond {
  width: 80px;
  height: 80px;

  transform: rotate(45deg);

  display: flex;
  align-items: center;
  justify-content: center;

  border: 4px solid v-bind('colors.primaryBorder');
  background: v-bind('colors.background');

  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* STATES */
.complete .diamond {
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

/* ICONS */
.diamond ion-icon {
  transform: rotate(-45deg);
  font-size: 28px;
}

.icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;

  background: v-bind('colors.primary');

  display: flex;
  align-items: center;
  justify-content: center;

  transform: rotate(-45deg);
}

.complete .icon-circle ion-icon {
  color: white;
  transform: none;
  font-size: 28px;
}

/* ICON COLORS */
.complete .diamond ion-icon,
.active .diamond ion-icon {
  color: white;
}

.locked .diamond ion-icon {
  color: v-bind('colors.textMuted');
}

/* LABEL */
.label {
  margin-top: 30px;
  font-size: 10px;

  background: v-bind('colors.active');
  color: white;

  padding: 3px 8px;
  border-radius: 10px;

  text-align: center;
}

/* TITLE */
.title {
  margin-top: 10px;
  font-size: 14px;
  color: v-bind('colors.text');
  text-align: center;
}

</style>

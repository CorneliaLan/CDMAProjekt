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
      <span v-if="status === 'complete'">✔</span>
      <span v-if="status === 'active'">▶</span>
      <span v-if="status === 'locked'">🔒</span>
    </div>

    <span v-if="status === 'active'" class="label">ACTIVE</span>

    <p>{{ title }}</p>
  </div>
</template>

<script setup lang="ts">
import { colors } from '@/theme/colors'

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
  border-radius: 12px;

  background: v-bind('colors.background');
}

/* STATES */
.complete .diamond {
  background: v-bind('colors.complete');
}

.active .diamond {
  background: v-bind('colors.active');
  color: white;
  border: 4px solid v-bind('colors.primaryLight');
}

.locked .diamond {
  background: v-bind('colors.locked');
  color: v-bind('colors.textMuted');
}

/* LABEL */
.label {
  display: inline-block;
  margin-top: 8px;
  font-size: 10px;
  background: v-bind('colors.active');
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
}
</style>
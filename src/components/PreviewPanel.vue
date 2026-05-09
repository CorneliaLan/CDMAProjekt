<template>
  <div class="preview-panel">
    <div class="preview-container">
      <LevelPreview
        v-if="previewGrid.length"
        :grid="previewGrid"
        :player-x="playerX"
        :player-y="playerY"
      />
    </div>

    <div class="control-wrapper">
      <ControlBar @play="emit('play')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LevelPreview from '@/components/LevelPreview.vue'
import ControlBar from '@/components/ControlBar.vue'
import type { GameState } from '@/core/engine/GameState'
import type { LevelDefinition } from '@/core/levels/levelCatalog'

const props = defineProps<{
  level: LevelDefinition | null
  gameState: GameState | null
}>()

const emit = defineEmits<{
  play: []
}>()

const previewGrid = computed(() => props.gameState?.grid ?? props.level?.grid ?? [])
const playerX = computed(() => props.gameState?.playerX ?? props.level?.startX)
const playerY = computed(() => props.gameState?.playerY ?? props.level?.startY)
</script>

<style scoped>
.preview-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preview-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.control-wrapper {
  display: flex;
  justify-content: center;
  padding: 16px;
}
</style>

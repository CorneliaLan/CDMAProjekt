<template>
  <div class="preview-panel">
    <div class="preview-container">
      <div class="preview-scale">
        <LevelPreview
          :grid="level"
          :playerX="playerX"
          :playerY="playerY"
        />
      </div>
    </div>

    <div class="control-wrapper">
      <ControlBar />
    </div>
  </div>
</template>

<script setup lang="ts">
import LevelPreview from '@/components/LevelPreview.vue'
import ControlBar from '@/components/ControlBar.vue'

const level = [
  [0,1,1,1,1,0,0,0],
  [0,1,3,0,1,1,0,0],
  [1,1,0,2,0,1,1,1],
  [1,0,0,0,2,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,1,3,1,1,1,1,1]
]

const playerX = 2
const playerY = 3
</script>

<style scoped>
.preview-panel {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;

  overflow: hidden;
}

.preview-container {
  flex: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  min-height: 0;
  min-width: 0;

  padding: 24px;
  box-sizing: border-box;
}

.preview-scale {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-scale :deep(canvas),
.preview-scale :deep(svg),
.preview-scale :deep(.level-preview) {
  max-width: 100%;
  max-height: 100%;

  width: auto;
  height: auto;

  object-fit: contain;
}

.control-wrapper {
  flex-shrink: 0;

  display: flex;
  justify-content: center;

  padding: 16px;
}
</style>
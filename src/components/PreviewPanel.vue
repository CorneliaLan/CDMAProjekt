<template>
  <div class="preview-panel">
    <div class="preview-container">
      <LevelPreview
        :grid="level"
        :playerX="playerX"
        :playerY="playerY"
      />
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
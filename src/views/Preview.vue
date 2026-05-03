<template>
  <ion-page>

    <!-- HEADER COMPONENT -->
    <Header />

    <ion-content :fullscreen="true">

      <div class="preview-container">
        <LevelPreview
          :grid="level"
          :playerX="playerX"
          :playerY="playerY"
        />
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue'
import Header from '@/components/Header.vue'
import LevelPreview from '@/components/LevelPreview.vue'

const level = [
  [0,1,1,1,1,0,0,0],
  [0,1,3,0,1,1,0,0],
  [1,1,0,2,0,1,1,1],
  [1,0,0,0,2,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,1,3,1,1,1,1,1]
]

// Player Position
const playerX = 2
const playerY = 3
</script>

<style scoped>
.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
}
</style>
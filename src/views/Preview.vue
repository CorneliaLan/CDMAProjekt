<template>
  <ion-page>

    <!-- HEADER COMPONENT -->
    <Header />

   <ion-content class="preview-page"
                 :fullscreen="true"
                 :style="{ '--background': colors.background }">

      <div class="page-layout">

        <div class="preview-container">
          <LevelPreview
            :grid="level"
            :playerX="playerX"
            :playerY="playerY"
          />
        </div>

        <!-- CONTROL BAR -->
        <div class="control-wrapper">
          <ControlBar />
        </div>

      </div>

     </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue'
import Header from '@/components/Header.vue'
import LevelPreview from '@/components/LevelPreview.vue'
import ControlBar from '@/components/ControlBar.vue'

import { colors } from '@/theme/colors'

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
ion-content {
  --padding-bottom: 24px;
}

.page-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: env(safe-area-inset-bottom);
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

  padding: 16px 16px 24px;

  margin-bottom: env(safe-area-inset-bottom);
}
</style>
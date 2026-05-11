<template>
  <ion-page>
    <Header />

    <ion-content
      :fullscreen="true"
      :style="{ '--background': colors.background }"
    >
      <div class="preview-page">
        <PreviewPanel />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue'
import Header from '@/components/Header.vue'
import PreviewPanel from '@/components/PreviewPanel.vue'
import { colors } from '@/theme/colors'
</script>

<style scoped>
.preview-page {
  width: 100%;
  height: 100%;
}

ion-content::part(scroll) {
  height: 100%;
}

.right-pane {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.right-pane > * {
  width: 100%;
  height: 100%;
}
</style>
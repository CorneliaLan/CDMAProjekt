<template>
  <ion-page>
    <Header />

    <ion-content
      :fullscreen="true"
      :style="{ '--background': colors.background }"
    >
      <PreviewPanel />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue'
import Header from '@/components/Header.vue'
import PreviewPanel from '@/components/PreviewPanel.vue'
import { colors } from '@/theme/colors'
</script>
<template>
  <ion-page>

    <!-- HEADER COMPONENT -->
    <Header />

    <ion-content class="map-page"
                 :fullscreen="true"
                 :style="{ '--background': colors.background }">

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { IonContent, IonPage } from '@ionic/vue'

import Header from '@/components/Header.vue'

import { colors } from '@/theme/colors'


import { Preview } from '@/composables/Preview'

const { title, subtitle, message, link } = Preview()
</script>

<style scoped>
#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>

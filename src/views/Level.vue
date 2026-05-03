<template>
  <ion-page>
    <Header />

    <ion-content class="level-page">
      <div v-if="activeLevel" class="level-card">
        <h1>{{ activeLevel.title }}</h1>
        <p>{{ activeLevel.description }}</p>
        <p>Map size: {{ activeLevel.grid[0].length }} x {{ activeLevel.grid.length }}</p>
        <p>Unlocked blocks: {{ activeLevel.unlockedBlockIds.join(', ') }}</p>
        <ion-button @click="startLevel">Start Level</ion-button>
      </div>
      <div v-else class="level-card">
        <h1>Level not found</h1>
        <ion-button @click="goToMap">Back to map</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonButton, IonContent, IonPage } from '@ionic/vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import { getLevelById } from '@/core/levels/levelCatalog'

const route = useRoute()
const router = useRouter()

const levelId = computed(() => Number(route.params.levelId))
const activeLevel = computed(() => getLevelById(levelId.value))

const startLevel = () => {
  if (!activeLevel.value) {
    return
  }
  router.push(`/editor/${activeLevel.value.id}`)
}

const goToMap = () => {
  router.push('/map')
}
</script>

<style scoped>
.level-page {
  --padding-start: 24px;
  --padding-end: 24px;
  --padding-top: 24px;
}

.level-card {
  max-width: 680px;
  margin: 16px auto;
  padding: 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
}

.level-card h1 {
  margin: 0 0 8px 0;
}

.level-card p {
  margin: 8px 0;
}
</style>

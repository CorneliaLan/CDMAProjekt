<template>
  <ion-page>
    <Header />

    <ion-content :fullscreen="true">
      <div class="level-page">
        <div class="level-card">
          <section class="level-left">
            <div class="status-badge">SYSTEM STATUS: STANDBY</div>

            <h1>{{ currentLevel?.title ?? 'Level' }}</h1>
            <p class="subtitle">
              {{ currentLevel?.status ?? 'Unknown' }}
            </p>
            <div class="icon-row">
              <button class="level-icon purple">
                <ion-icon :icon="serverOutline" />
              </button>

              <button class="level-icon orange">
                <ion-icon :icon="arrowForwardOutline" />
              </button>

              <button class="level-icon gray">
                <ion-icon :icon="terminalOutline" />
              </button>
            </div>

            <div class="complexity">
              <span>COMPLEXITY</span>

              <div class="complexity-bars">
                <div
                  v-for="i in 3"
                  :key="i"
                  class="bar"
                  :class="{ active: i <= complexity }"
                ></div>
              </div>
            </div>
          </section>

          <section class="level-right">
            <div class="objective-title">
              <span></span>
              MISSION OBJECTIVE
            </div>

            <div class="objective-content"></div>

            <div class="actions">
              <button class="back-button" @click="goToMap">
                <ion-icon :icon="arrowBackOutline" />
                Back to Map
              </button>

              <button class="start-button" @click="startLevel">
                START LEVEL
                <ion-icon :icon="playOutline" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IonContent, IonIcon, IonPage } from '@ionic/vue'
import {
  arrowBackOutline,
  arrowForwardOutline,
  playOutline,
  serverOutline,
  terminalOutline,
} from 'ionicons/icons'
import Header from '@/components/Header.vue'
import { Maps } from '@/composables/Maps'
import { colors } from '@/theme/color'
const router = useRouter()
const route = useRoute()

const { nodes } = Maps()

const levelId = computed(() => String(route.params.id))

const currentLevel = computed(() => {
  return nodes.find(node => String(node.id) === levelId.value)
})

const complexity = computed(() => currentLevel.value?.complexity ?? 1)

const goToMap = () => {
  router.push({ name: 'Map' })
}

const startLevel = () => {
  router.push({
    name: 'Logic',
    params: {
      id: levelId.value
    }
  })
}
</script>

<style scoped>
.level-page {
  min-height: 100%;
  padding: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.level-card {
  width: min(1280px, 100%);
  min-height: 540px;
  display: grid;
  grid-template-columns: 42% 58%;
  border: 1px solid #dfe5f3;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 18px 45px rgba(29, 54, 102, 0.08);
}

.level-left {
  padding: 58px;
  background: color.background;
}

.status-badge {
  display: inline-block;
  padding: 10px 18px;
  border-radius: 2px;
  background: #d7e1fb;
  color: #4f5b70;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 2px;
}

h1 {
  margin: 28px 0 8px;
  color: #12366f;
  font-size: 68px;
  line-height: 1;
  font-weight: 900;
}

.subtitle {
  margin: 0;
  color: #3e5fa5;
  font-size: 26px;
}

.icon-row {
  margin-top: 76px;
  display: flex;
  justify-content: center;
  gap: 12px;
  pointer-events: none;
}

.level-icon {
  width: 68px;
  height: 68px;
  border-radius: 4px;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.level-icon.purple {
  border: 1px solid #b9b9ff;
  background: #dedcff;
  color: #4646df;
}

.level-icon.orange {
  border: 1px solid #d8bfa8;
  background: #eee4dc;
  color: #9a5207;
}

.level-icon.gray {
  border: 1px solid #c6ccda;
  background: #e1e5ee;
  color: #526077;
}

.complexity {
  margin-top: 72px;
}

.complexity span {
  color: #3e5fa5;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 2px;
}

.complexity-bars {
  margin-top: 10px;
  display: flex;
  gap: 6px;
}

.bar {
  width: 46px;
  height: 8px;
  border-radius: 10px;
  background: #c4cbf1;
}

.bar.active {
  background: #4646df;
}

.level-right {
  padding: 62px 58px 58px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.objective-title {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #3e5fa5;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 4px;
}

.objective-title span {
  width: 26px;
  height: 2px;
  background: #9eb5f5;
}

.objective-content {
  flex: 1;
  border-bottom: 1px solid #e1e6f0;
}

.actions {
  padding-top: 46px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-button,
.start-button {
  border: none;
  background: transparent;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
}

.back-button {
  color: #3e5fa5;
  font-size: 20px;
}

.start-button {
  padding: 24px 42px;
  background: #526077;
  color: #ffffff;
  font-size: 22px;
  box-shadow: 0 12px 24px rgba(39, 51, 74, 0.26);
}

@media (max-width: 767px) {
  .level-page {
    padding: 24px;
  }

  .level-card {
    grid-template-columns: 1fr;
  }

  .level-left,
  .level-right {
    padding: 32px 24px;
  }

  h1 {
    font-size: 48px;
  }

  .subtitle {
    font-size: 20px;
  }

  .icon-row {
    margin-top: 48px;
  }

  .actions {
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
  }

  .start-button {
    justify-content: center;
  }
}
</style>
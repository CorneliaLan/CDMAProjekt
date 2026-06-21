<template>
  <ion-header>
    <ion-toolbar class="custom-header">
      <div class="header-content">

        <div class="logo" @click="handleLogoTap">LearnQube</div>

        <button
          v-if="debugUnlockEnabled"
          class="debug-reset-button"
          @click="handleDebugReset"
        >
          Reset Debug Unlock
        </button>

        <!-- TABS -->
      <!--  <div class="tabs">
          <span
            v-for="tab in tabs"
            :key="tab.path"
            :class="{ active: isActiveTab(tab.path) }"
            @click="goTo(tab.path)"
          >
            {{ tab.name }}
          </span>
        </div>-->

        <!-- ICONS -->
      <!--  <div class="icons">
          <ion-icon name="settings-outline"></ion-icon>
          <ion-icon name="notifications-outline"></ion-icon>
          <ion-icon name="person-circle-outline"></ion-icon>
        </div>-->

      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { IonHeader, IonToolbar } from '@ionic/vue'
import { useRoute, useRouter } from 'vue-router'
import {
  enableDebugUnlock,
  isDebugUnlockEnabled,
  resetDebugUnlock,
  LEVEL_PROGRESS_CHANGED_EVENT
} from '@/composables/useLevelProgress'
import { colors } from '@/theme/colors'
import { IonIcon } from '@ionic/vue'

import { addIcons } from 'ionicons'
import { settingsOutline, notificationsOutline, personCircleOutline } from 'ionicons/icons'

addIcons({
  settingsOutline,
  notificationsOutline,
  personCircleOutline
})

const route = useRoute()
const router = useRouter()
const debugUnlockEnabled = ref(false)

let logoTapCount = 0
let logoTapResetTimer: ReturnType<typeof setTimeout> | null = null

// const tabs = [
//   { name: 'Map', path: '/map' },
//   { name: 'Editor', path: '/editor/1' },
//   { name: 'Preview', path: '/preview' }
// ]

const goTo = (path: string) => {
  if (route.path !== path) {
    router.push(path)
  }
}

const isActiveTab = (path: string) => {
  if (path.startsWith('/editor')) {
    return route.path.startsWith('/editor')
  }
  return route.path === path
}

const syncDebugUnlock = () => {
  debugUnlockEnabled.value = isDebugUnlockEnabled()
}

const clearLogoTapResetTimer = () => {
  if (logoTapResetTimer === null) return

  clearTimeout(logoTapResetTimer)
  logoTapResetTimer = null
}

const handleLogoTap = () => {
  logoTapCount++
  clearLogoTapResetTimer()

  if (logoTapCount >= 9) {
    logoTapCount = 0
    enableDebugUnlock()
    syncDebugUnlock()
    return
  }

  logoTapResetTimer = setTimeout(() => {
    logoTapCount = 0
    logoTapResetTimer = null
  }, 2000)
}

const handleDebugReset = () => {
  resetDebugUnlock()
  syncDebugUnlock()
}

onMounted(() => {
  syncDebugUnlock()
  window.addEventListener(LEVEL_PROGRESS_CHANGED_EVENT, syncDebugUnlock)
})

onBeforeUnmount(() => {
  clearLogoTapResetTimer()
  window.removeEventListener(LEVEL_PROGRESS_CHANGED_EVENT, syncDebugUnlock)
})
</script>

<style scoped>

.custom-header {
  --background: v-bind('colors.primary');
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
}

/* LOGO */
.logo {
  font-weight: bold;
  font-size: 18px;
  user-select: none;
}

.debug-reset-button {
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.18);
  color: white;
  font-size: 13px;
  font-weight: 800;
  padding: 8px 12px;
}

@media (max-width: 1000px) {
  ion-toolbar.custom-header {
    --min-height: 36px;
  }

  .header-content {
    padding: 6px 12px;
  }

  .logo {
    font-size: 14px;
  }
}

</style>

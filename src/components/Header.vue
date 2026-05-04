<template>
  <ion-header>
    <ion-toolbar class="custom-header">
      <div class="header-content">

        <div class="logo">LearnQube</div>

        <!-- TABS -->
        <div class="tabs">
          <span
            v-for="tab in tabs"
            :key="tab.path"
            :class="{ active: isActiveTab(tab.path) }"
            @click="goTo(tab.path)"
          >
            {{ tab.name }}
          </span>
        </div>

        <div class="icons">
          <ion-icon name="settings-outline"></ion-icon>
          <ion-icon name="notifications-outline"></ion-icon>
          <ion-icon name="person-circle-outline"></ion-icon>
        </div>

      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { IonHeader, IonToolbar } from '@ionic/vue'
import { useRoute, useRouter } from 'vue-router'
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

const tabs = [
  { name: 'Map', path: '/map' },
  { name: 'Editor', path: '/editor/1' },
  { name: 'Preview', path: '/preview' }
]

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
}

/* TABS */
.tabs {
  display: flex;
  gap: 20px;
}

.tabs span {
  opacity: 0.6;
  cursor: pointer;
  transition: 0.2s;
}

/* ACTIVE TAB */
.tabs .active {
  opacity: 1;
  border-bottom: 2px solid white;
}

/* HOVER */
.tabs span:hover {
  opacity: 1;
}

/* ICONS */
.icons {
  display: flex;
  gap: 10px;
  font-size: 18px;
}

.icons {
  display: flex;
  gap: 14px;
  font-size: 22px;
  align-items: center;
}

.icons ion-icon {
  cursor: pointer;
  opacity: 0.8;
  transition: 0.2s;
}

.icons ion-icon:hover {
  opacity: 1;
  transform: scale(1.1);
}

</style>

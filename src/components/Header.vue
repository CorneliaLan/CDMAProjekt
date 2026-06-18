<template>
  <ion-header>
    <ion-toolbar class="custom-header">
      <div class="header-content">

        <div class="logo">LearnQube</div>

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
</script>

<style scoped>

.custom-header {
  --background: v-bind('colors.primary');
  color: white;
}

.header-content {
  /*display: flex;*/
  align-items: center;
 /* justify-content: space-between;*/
  padding: 12px;
}

/* LOGO */
.logo {
  font-weight: bold;
  font-size: 18px;
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

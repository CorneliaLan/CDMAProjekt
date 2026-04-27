<template>
  <ion-page>
    <Header />

    <ion-content :fullscreen="true"
                 :style="{ '--background': colors.background }">
      <div class="split-layout">
        <section
          class="pane left-pane"
          @pointerdown="startLongPress"
          @pointerup="cancelLongPress"
          @pointerleave="cancelLongPress"
          @pointercancel="cancelLongPress"
        >
          <div class="blueprint-list">
            <div
              v-for="blueprint in blueprints"
              :key="blueprint.id"
              class="blueprint-card"
              :style="{ backgroundColor: blueprint.color, color: blueprint.textColor }"
            >
              {{ blueprint.action }}
            </div>
          </div>
          <button class="floating-plus" @click.stop="openRadialMenu">
            <ion-icon :icon="addOutline" />
          </button>

          <div
            v-if="isRadialMenuOpen"
            class="radial-menu-overlay"
            @click.self="closeRadialMenu"
          >
            <RadialMenu @click.stop @select="addBlueprint" />
          </div>
        </section>

        <section class="pane right-pane">
          Level {{ levelId }}
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { IonContent, IonIcon, IonPage } from '@ionic/vue'
import { addOutline } from 'ionicons/icons'
import Header from '@/components/Header.vue'
import RadialMenu from '@/components/RadialMenu.vue'
import { useRadialMenu } from '@/composables/useRadialMenu'
import { colors } from '@/theme/colors'

type Blueprint = {
  id: number
  category: string
  action: string
  color: string
  textColor: string
}

const route = useRoute()

const levelId = computed(() => Number(route.params.id))

const blueprints = ref<Blueprint[]>([])

const {
  isOpen: isRadialMenuOpen,
  open: openRadialMenu,
  close: closeRadialMenu,
  startLongPress,
  cancelLongPress
} = useRadialMenu()

const addBlueprint = (payload: Omit<Blueprint, 'id'>) => {
  blueprints.value.push({
    id: Date.now(),
    ...payload
  })

  closeRadialMenu()
}
</script>

<style scoped>
.split-layout {
  display: flex;
  min-height: 100%;
}

.pane {
  padding: 24px;
  box-sizing: border-box;
  min-width: 0;
}

/* Mobile + Tablet default: 70 / 30 */
.left-pane {
  flex: 0 0 70%;
  border-right: 1px solid #dcdcdc;
}

.right-pane {
  flex: 0 0 30%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-pane p {
  margin: 0;
}

.right-pane a {
  text-decoration: none;
}

/* Desktop und größer: 60 / 40 */
@media (min-width: 1024px) {
  .left-pane {
    flex-basis: 60%;
  }

  .right-pane {
    flex-basis: 40%;
  }
}

.left-pane {
  position: relative;
  flex: 0 0 70%;
  border-right: 1px solid #dcdcdc;
  overflow: hidden;
  user-select: none;
  touch-action: manipulation;
}

.floating-plus {
  position: absolute;
  right: 24px;
  bottom: 24px;
  z-index: 30;

  width: 56px;
  height: 56px;
  border: none;
  border-radius: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: var(--ion-color-primary);
  color: #ffffff;
  font-size: 28px;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.24);
}

.radial-menu-overlay {
  position: absolute;
  inset: 0;
  z-index: 25;

  display: flex;
  align-items: flex-end;
  justify-content: flex-end;

  padding: 24px 24px 96px 24px;

  background: rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(2px);
}

.blueprint-list {
  position: absolute;
  top: 24px;
  left: 24px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  align-items: flex-start;
}

.blueprint-card {
  display: inline-block;

  padding: 6px 12px;
  border-radius: 12px;

  color: #fff;
  font-size: 14px;
  font-weight: 700;

  white-space: nowrap;
  width: fit-content;

  box-shadow: 0 3px 8px rgba(0,0,0,0.18);
}
</style>
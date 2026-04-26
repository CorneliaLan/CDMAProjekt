<template>
  <div class="radial-menu-container">
    <div class="radial-menu">
      <div class="axis vertical"></div>
      <div class="axis horizontal"></div>

      <button class="center-button">
        <ion-icon :icon="addOutline" />
      </button>

      <div
        v-for="item in items"
        :key="item.label"
        class="menu-item"
        :class="[item.position, { active: activeItem === item.label }]"
        @mouseenter="onHover(item)"
        @click="onClick(item)"
        @touchstart="onHover(item)"
      >
      <div class="main-item">
        <ion-button class="icon-button" fill="clear">
          <ion-icon :icon="item.icon" />
        </ion-button>

        <div class="label">
          {{ item.label }}
        </div>
      </div>

        <div
          v-if="activeItem === item.label"
          class="submenu"
        >
          <button
            v-for="action in item.actions"
            :key="action"
            class="submenu-button"
            @click.stop="onActionClick(item.label, action)"
          >
            {{ action }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonButton, IonIcon } from '@ionic/vue'
import {
  addOutline,
  repeatOutline,
  gitBranchOutline,
  flashOutline,
  moveOutline,
} from 'ionicons/icons'

const activeItem = ref<string | null>(null)

const items = [
  {
    label: 'Loops',
    icon: repeatOutline,
    position: 'top',
    actions: ['Repeat'],
  },
  {
    label: 'Conditions',
    icon: gitBranchOutline,
    position: 'right',
    actions: ['If Win', 'If Lose'],
  },
  {
    label: 'Events',
    icon: flashOutline,
    position: 'bottom',
    actions: ['Level Start', 'Level End'],
  },
  {
    label: 'Movement',
    icon: moveOutline,
    position: 'left',
    actions: ['Move Up', 'Move Down', 'Move Left', 'Move Right'],
  },
]

const onHover = (item: any) => {
  activeItem.value = item.label
}

const onClick = (item: any) => {
  activeItem.value = activeItem.value === item.label ? null : item.label
}

const onActionClick = (category: string, action: string) => {
  console.log('clicked:', category, action)
}
</script>

<style scoped>
.radial-menu-container {
  min-height: 50vh;
  background: #8d8d8d;
  transparent: 70%;
  border-radius: 16px;
}

.radial-menu {
  position: relative;
  width: 650px;
  height: 650px;
  border-radius: 16px;
  background: #cfcfcf;
  transparent: 70%;
  overflow: visible;
}

.axis {
  position: absolute;
  background-image: linear-gradient(
    to right,
    rgba(91, 127, 151, 0.35) 50%,
    transparent 50%
  );
  background-size: 8px 1px;
}

.axis.horizontal {
  width: 420px;
  height: 1px;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
}

.axis.vertical {
  width: 1px;
  height: 430px;
  top: 50%;
  left: 50%;
  transform: translateY(-50%);
  background-image: linear-gradient(
    to bottom,
    rgba(91, 127, 151, 0.35) 50%,
    transparent 50%
  );
  background-size: 1px 8px;
}

.center-button {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  transform: translate(-50%, -50%);
  border: none;
  border-radius: 16px;
  background: #ffffff;
  color: #526077;
  font-size: 25px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  z-index: 2;
  pointer-events: none;
}

.main-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-item {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease;
}

.menu-item.top {
  top: 98px;
  left: 50%;
  transform: translateX(-50%);
}

.menu-item.right {
  top: 280px;
  right: 75px;
}

.menu-item.bottom {
  top: 425px;
  left: 50%;
  transform: translateX(-50%);
}

.menu-item.left {
  top: 280px;
  left: 67px;
}

.icon-button {
  --padding-start: 0;
  --padding-end: 0;
  --border-radius: 20px;

  width: 70px;
  height: 78px;
  border-radius: 20px;
  background: #4a67a8;
  color: #ffffff;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.16);
  transition: all 0.2s ease;
}

.menu-item.top .icon-button {
  background: #3e3fd3;
}

.menu-item.right .icon-button {
  background: #dcd7ff;
  color: #4545d7;
}

.menu-item.left .icon-button {
  background: #535e72;
}

.icon-button ion-icon {
  font-size: 30px;
}

.label {
  margin-top: 6px;
  padding: 9px 18px;
  min-width: 88px;
  text-align: center;
  border-radius: 14px;
  background: #ffffff;
  color: #3f46d8;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(55, 70, 95, 0.18);
  transition: all 0.2s ease;
}

.menu-item.left .label,
.menu-item.bottom .label {
  color: #526077;
}

/* Active Effekt */

.menu-item {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-item.active .main-item .icon-button {
  transform: scale(1.1);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
}

.menu-item.active .main-item .label {
  transform: scale(1.05);
}

/* sub menu */

.submenu {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 100px;
  z-index: 10;
}

.submenu-button {
  border: none;
  border-radius: 18px;
  padding: 10px 20px;
  background: #ffffff;
  color: #0c2d63;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(55, 70, 95, 0.18);
}

.submenu-button:hover {
  transform: scale(1.04);
}
</style>
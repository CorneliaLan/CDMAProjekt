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
        @mouseleave="activeItem=null"
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
          @click.stop="onActionClick(item, action)"
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

const emit = defineEmits<{
  select: [payload: {
    category: string
    action: string
    color: string
    textColor?: string
  }]
}>()

const items = [
  {
    label: 'Loops',
    icon: repeatOutline,
    position: 'top',
    color: '#3e3fd3',
    actions: ['Repeat'],
  },
  {
    label: 'Conditions',
    icon: gitBranchOutline,
    position: 'right',
    color: '#dcd7ff',
    textColor: '#4545d7',
    actions: ['If Win', 'If Lose'],
  },
  {
    label: 'Events',
    icon: flashOutline,
    position: 'bottom',
    color: '#4a67a8',
   //actions: ['Level Start', 'Level End'],
    actions: ['Level End'],
  },
  {
    label: 'Movement',
    icon: moveOutline,
    position: 'left',
    color: '#535e72',
    actions: ['Move Up', 'Move Down', 'Move Left', 'Move Right'],
  },
]


const onHover = (item: any) => {
  activeItem.value = item.label
}

const onClick = (item: any) => {
  activeItem.value = activeItem.value === item.label ? null : item.label
}

const onActionClick = (item: any, action: string) => {
  emit('select', {
    category: item.label,
    action,
    color: item.color,
    textColor: item.textColor ?? '#ffffff',
  })
}
</script>

<style scoped>
.radial-menu-container {
  min-height: 50vh;
  background: rgba(141, 141, 141, 0.7);
  border-radius: 16px;
}

.radial-menu {
  position: relative;
  width: 650px;
  height: 650px;
  border-radius: 16px;
  background: rgba(141, 141, 141, 1);
  overflow: visible;
}

.axis {
  position: absolute;
  opacity: 1;
}

.axis.horizontal {
  width: 440px;
  height: 2px;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  background-image: linear-gradient(
    to right,
    rgba(55, 80, 110, 0.75) 55%,
    transparent 45%
  );
  background-size: 10px 2px;
}

.axis.vertical {
  width: 2px;
  height: 440px;
  top: 50%;
  left: 50%;
  transform: translateY(-50%);
  background-image: linear-gradient(
    to bottom,
    rgba(55, 80, 110, 0.75) 55%,
    transparent 45%
  );
  background-size: 2px 10px;
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
  /*transition: transform 0.2s ease;*/
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

/* Phone */
@media (max-width: 767px) {
  .radial-menu {
    width: 360px;
    height: 360px;
  }

  .axis.horizontal {
    width: 230px;
  }

  .axis.vertical {
    height: 230px;
  }

  .center-button {
    width: 42px;
    height: 42px;
    font-size: 22px;
  }

  .icon-button {
    width: 46px;
    height: 50px;
  }

  .icon-button ion-icon {
    font-size: 20px;
  }

  .label {
    font-size: 11px;
    min-width: 68px;
    padding: 5px 8px;
  }

  .menu-item.top {
    top: 20px;
  }

  .menu-item.right {
    top: 150px;
    right: 32px;
  }

  .menu-item.bottom {
    top: 245px;
  }

  .menu-item.bottom .submenu {
    position: absolute;
    top: 50%;
    left: 100%;
    margin-top: 0;
    margin-left: 8px;

    transform: translateY(-50%);
  }

  .menu-item.left {
    top: 150px;
    left: 32px;
  }

  .submenu {
    min-width: 70px;
    max-width: 140px;
    width: auto;
  }

  .submenu-button {
    font-size: 10px;
    padding: 5px 8px;
  }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  .radial-menu {
    width: 520px;
    height: 520px;
  }

  .axis.horizontal {
    width: 340px;
  }

  .axis.vertical {
    height: 340px;
  }

  .center-button {
    width: 46px;
    height: 46px;
    font-size: 23px;
  }

  .icon-button {
    width: 62px;
    height: 68px;
  }

  .label {
    font-size: 14px;
    min-width: 78px;
    padding: 8px 14px;
  }

  .menu-item.top {
    top: 50px;
  }

  .menu-item.right {
    top: 220px;
    right: 56px;
  }

  .menu-item.bottom {
    top: 330px;
  }

  .menu-item.left {
    top: 220px;
    left: 56px;
  }


  .submenu-button {
    font-size: 12px;
    padding: 7px 10px;
  }
}
</style>
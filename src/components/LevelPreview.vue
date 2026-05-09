<template>
  <div class="grid">
    <div v-for="(row, y) in grid" :key="y" class="row">
      <div
        v-for="(cell, x) in row"
        :key="x"
        class="cell"
        :class="getCellClass(cell)"
      >
        <!-- PLAYER -->
        <ion-icon
          v-if="playerX === x && playerY === y"
          name="person"
          class="icon player-icon"
        />

        <!-- CHEST -->
        <ion-icon
          v-else-if="isChestCell(cell)"
          name="cube-outline"
          class="icon chest-icon"
        />

        <!-- TARGET -->
        <ion-icon
          v-else-if="cell === RenderCell.Target"
          name="radio-button-on-outline"
          class="icon target-icon"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { addIcons } from 'ionicons'
import { cubeOutline, radioButtonOnOutline, person } from 'ionicons/icons'
import { colors } from '@/theme/colors'
import { RenderCell } from '@/core/engine/GameState'

addIcons({
  cubeOutline,
  radioButtonOnOutline,
  person
})

defineProps<{
  grid: number[][]
  playerX?: number
  playerY?: number
}>()

const getCellClass = (cell: number) => {
  switch (cell) {
    case RenderCell.Wall: return 'wall'
    case RenderCell.Chest: return 'chest'
    case RenderCell.Target: return 'target'
    case RenderCell.ChestOnTarget: return 'chest-on-target'
    default: return 'empty'
  }
}

const isChestCell = (cell: number) => cell === RenderCell.Chest || cell === RenderCell.ChestOnTarget
</script>

<style scoped>
.grid {
  display: inline-block;
  padding: 20px;
  border-radius: 16px;
  background: v-bind('colors.gridBackground');
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.cell {
  width: 60px;
  height: 60px;
  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

/* EMPTY */
.empty {
  background: v-bind('colors.cellEmpty');
}

/* WALL */
.wall {
  background: v-bind('colors.cellWall');
}

/* CHEST */
.chest {
  background: v-bind('colors.cellChest');
  border: 2px solid v-bind('colors.cellChestBorder');
}

.chest-on-target {
  background: v-bind('colors.cellChest');
  border: 2px solid v-bind('colors.target');
}

/* TARGET */
.target {
  background: v-bind('colors.cellEmpty');
}

/* ICON BASE */
.icon {
  font-size: 22px;
}

/* PLAYER */
.player-icon {
  color: white;
  background: v-bind('colors.player');
  padding: 6px;
  border-radius: 8px;
}

/* CHEST */
.chest-icon {
  color: v-bind('colors.cellChestBorder');
}

/* TARGET */
.target-icon {
  color: v-bind('colors.target');
}
</style>

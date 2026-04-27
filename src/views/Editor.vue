<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ subtitle }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <strong>Registered Blocks</strong>
        <ul>
          <li v-for="block in availableBlocks" :key="block.id">
            {{ block.id }} ({{ block.category }})
          </li>
        </ul>
        <p v-if="gameState">
          Player Position: ({{ gameState.playerX }}, {{ gameState.playerY }})
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { useEditorFacade } from '@/composables/useEditorFacade';
import { MoveUpBlock } from '@/core/editor/blocks/action/MoveUpBlock';

const title = 'Editor';
const subtitle = 'Editor Runtime Snapshot';
const { gameState, getAvailableBlocks, loadLevel, startGame } = useEditorFacade();

const availableBlocks = computed(() => getAvailableBlocks());

onMounted(() => {
  loadLevel(
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 3]
    ],
    1,
    2
  );

  startGame([new MoveUpBlock()]);
});
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

#container ul {
  list-style: none;
  margin: 10px 0;
  padding: 0;
}
</style>

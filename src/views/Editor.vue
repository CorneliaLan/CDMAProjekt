<template>
  <ion-page>
    <Header />
    <ion-content class="editor-page">
      <div class="editor-panel">
        <h1>{{ levelTitle }}</h1>
        <p v-if="gameState">Player Position: ({{ gameState.playerX }}, {{ gameState.playerY }})</p>
        <p v-else>Level not loaded.</p>

        <h2>Available Blocks</h2>
        <div class="block-actions">
          <ion-button
            v-for="block in availableBlocks"
            :key="block.id"
            size="small"
            @click="addBlock(block.id)"
          >
            Add {{ block.id }}
          </ion-button>
        </div>

        <h2>Program</h2>
        <ul>
          <li v-for="(block, index) in program" :key="`${index}-${block.id}`">
            {{ index + 1 }}. {{ block.id }}
            <template v-if="isRepeatBlock(block)">
              (x{{ repeatIterations(block) }})
              <ion-button size="small" fill="clear" @click="updateRepeatIterations(index, repeatIterations(block) + 1)">
                +1
              </ion-button>
            </template>
            <ion-button size="small" fill="clear" color="danger" @click="removeBlock(index)">
              Delete
            </ion-button>
          </li>
        </ul>

        <div class="actions">
          <ion-button @click="runProgram">Run Program</ion-button>
          <ion-button fill="outline" color="medium" @click="clearProgram">Clear Program</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { IonButton, IonContent, IonPage } from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import { useEditorFacade } from '@/composables/useEditorFacade';
import type { BaseBlock } from '@/core/editor/BaseBlock';
import { BlockCategory } from '@/core/editor/BlockCategories';

const route = useRoute();
const router = useRouter();
const levelId = computed(() => Number(route.params.levelId));
const {
  level,
  gameState,
  availableBlocks,
  program,
  addProgramBlock,
  setRepeatIterations,
  deleteProgramBlock,
  clearProgram,
  runProgram
} = useEditorFacade(levelId);

const levelTitle = computed(() => level.value?.title ?? 'Editor');

watch(level, (currentLevel) => {
  if (!currentLevel) {
    router.push('/map');
  }
}, { immediate: true });

const addBlock = (blockId: string) => {
  addProgramBlock(blockId);
};

const removeBlock = (index: number) => {
  deleteProgramBlock(index);
};

const isRepeatBlock = (block: BaseBlock) => {
  return block.category === BlockCategory.REPEAT;
};

const repeatIterations = (block: BaseBlock) => {
  return (block as BaseBlock & { iterations: number }).iterations;
};

const updateRepeatIterations = (index: number, iterations: number) => {
  setRepeatIterations(index, iterations);
};
</script>

<style scoped>
.editor-page {
  --padding-start: 24px;
  --padding-end: 24px;
  --padding-top: 24px;
}

.editor-panel {
  max-width: 780px;
  margin: 0 auto;
}

.block-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}
</style>

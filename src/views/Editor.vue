<template>
  <ion-page>
    <Header />
    <ion-content class="editor-page">
      <div class="editor-panel">
        <h1>{{ levelTitle }}</h1>
        <p v-if="gameState">Player Position: ({{ gameState.playerX }}, {{ gameState.playerY }})</p>
        <p v-else>Level not loaded.</p>

<<<<<<< HEAD
    <ion-content
      :fullscreen="true"
      :style="{ '--background': colors.background }"
    >
      <div class="split-layout">
        <section
          class="pane left-pane"
          @pointerdown="startLongPress"
          @pointerup="cancelLongPress"
          @pointerleave="cancelLongPress"
          @pointercancel="cancelLongPress"
        >
          <div ref="reteContainer" class="rete-editor"></div>

          <button class="floating-plus" @click.stop="openRadialMenu">
            <ion-icon :icon="addOutline" />
          </button>

          <div
            v-if="isRadialMenuOpen"
            class="radial-menu-overlay"
            @click.self="closeRadialMenu"
          >
            <RadialMenu @click.stop @select="addReteNode" />
          </div>
        </section>
=======
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
>>>>>>> main

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

        <div v-if="gameState" class="level-grid">
          <div
            v-for="(row, y) in gameState.grid"
            :key="`row-${y}`"
            class="level-grid-row"
          >
            <span
              v-for="(_, x) in row"
              :key="`cell-${x}-${y}`"
              class="level-grid-cell"
            >
              {{ cellValue(x, y) }}
            </span>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">

import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { IonContent, IonIcon, IonPage } from '@ionic/vue'
import { addOutline } from 'ionicons/icons'

import Header from '@/components/Header.vue'
import RadialMenu from '@/components/RadialMenu.vue'
import { useRadialMenu } from '@/composables/useRadialMenu'
import { colors } from '@/theme/colors'

import { NodeEditor, ClassicPreset } from 'rete'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { VuePlugin, Presets, VueArea2D } from 'rete-vue-plugin'

type Schemes = ClassicPreset.GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>

type AreaExtra = VueArea2D<Schemes>

type BlueprintPayload = {
  category: string
  action: string
  color: string
  textColor: string
}

const route = useRoute()
const levelId = computed(() => Number(route.params.id))

const reteContainer = ref<HTMLElement | null>(null)

let editor: NodeEditor<Schemes> | null = null
let area: AreaPlugin<Schemes, AreaExtra> | null = null
let nodeIndex = 0


const route = useRoute();
const router = useRouter();
const levelId = computed(() => Number(route.params.id));
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

<<<<<<< HEAD
const handlePanePointerDown = (event: PointerEvent) => {
  const target = event.target as HTMLElement

  const isReteInteraction = target.closest(
    '.node, .socket, .input, .output, .control, .connection'
  )

  const isUiInteraction = target.closest(
    '.floating-plus, .radial-menu-overlay'
  )

  if (isReteInteraction || isUiInteraction) {
    cancelLongPress()
    return
  }

  startLongPress()
}

onMounted(async () => {
  if (!reteContainer.value) return

  editor = new NodeEditor<Schemes>()
  area = new AreaPlugin<Schemes, AreaExtra>(reteContainer.value)

  const connection = new ConnectionPlugin<Schemes, AreaExtra>()
  const render = new VuePlugin<Schemes, AreaExtra>()

  render.addPreset(Presets.classic.setup())
  connection.addPreset(ConnectionPresets.classic.setup())

  editor.use(area)
  area.use(connection)
  area.use(render)

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  })

  AreaExtensions.simpleNodesOrder(area)
})

onBeforeUnmount(() => {
  area?.destroy()
  editor = null
  area = null
})

const addReteNode = async (payload: BlueprintPayload) => {
  if (!editor || !area) return

  const socket = new ClassicPreset.Socket(payload.category)
  const node = new ClassicPreset.Node(payload.action)

  const action = payload.action.toLowerCase()

  const isLevelStart = action.includes('level start')
  const isLevelEnd = action.includes('level end')

  if (!isLevelStart) {
    node.addInput('in', new ClassicPreset.Input(socket))
  }

  if (!isLevelEnd) {
    node.addOutput('out', new ClassicPreset.Output(socket))
  }

  await editor.addNode(node)

  await area.translate(node.id, {
    x: 80 + nodeIndex * 40,
    y: 80 + nodeIndex * 40
  })

  nodeIndex++
  closeRadialMenu()
}
=======
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

const cellValue = (x: number, y: number): number | string => {
  if (!gameState.value) {
    return '';
  }

  return gameState.value.playerX === x && gameState.value.playerY === y
    ? 'P'
    : gameState.value.grid[y][x];
};
>>>>>>> main
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
<<<<<<< HEAD
  min-height: 100%;
  height: 100%;
}

.pane {
  padding: 24px;
  box-sizing: border-box;
  min-width: 0;
}

.left-pane {
  position: relative;
  flex: 0 0 70%;
  border-right: 1px solid #dcdcdc;
  overflow: hidden;
  user-select: none;
}

.right-pane {
  flex: 0 0 30%;
=======
  flex-wrap: wrap;
  gap: 8px;
}

.actions {
>>>>>>> main
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.level-grid {
  margin-top: 16px;
  font-family: monospace;
}

.level-grid-row {
  display: flex;
}

.level-grid-cell {
  align-items: center;
  border: 1px solid #d0d0d0;
  display: inline-flex;
  height: 28px;
  justify-content: center;
  width: 28px;
}
<<<<<<< HEAD

.rete-editor {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

@media (min-width: 1024px) {
  .left-pane {
    flex-basis: 60%;
  }

  .right-pane {
    flex-basis: 40%;
  }
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

  background: v-bind('colors.primary');
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
</style>
=======
</style>
>>>>>>> main

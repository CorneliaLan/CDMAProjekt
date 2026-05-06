<template>
  <ion-page>
    <Header />

    <ion-content
      :fullscreen="true"
      :style="{ '--background': colors.background }"
    >
      <div class="split-layout">
        <section
          class="pane left-pane"
        >
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
          <div ref="reteContainer" class="rete-editor"></div>
            <button
              v-if="deleteButtonPosition"
              class="node-delete-button"
              :style="{
                left: `${deleteButtonPosition.x}px`,
                top: `${deleteButtonPosition.y}px`
              }"
              @click.stop="deleteSelectedNode"
            >
              🗑
            </button>
        </section>

        <section class="pane right-pane">
          Level {{ levelId }}
        </section>
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
import CustomNode from '@/components/CustomNode.vue'

import { NodeEditor, ClassicPreset } from 'rete'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { VuePlugin, Presets, VueArea2D } from 'rete-vue-plugin'
import {
  AutoArrangePlugin,
  Presets as ArrangePresets,
  ArrangeAppliers
} from 'rete-auto-arrange-plugin'

class FlowNode extends ClassicPreset.Node {
  width = 180
  height = 120

  category = 'default'
  color = '#8799f6'
  textColor = '#ffffff'
  deletable = true    
}

class FlowConnection extends ClassicPreset.Connection<FlowNode, FlowNode> {}

type Schemes = ClassicPreset.GetSchemes<FlowNode, FlowConnection>

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
let lastNode: FlowNode | null = null
let arrange: AutoArrangePlugin<Schemes, AreaExtra> | null = null

/// Delete functionality
let selectedNode: FlowNode | null = null
const deleteButtonPosition = ref<{ x: number; y: number } | null>(null)

const {
  isOpen: isRadialMenuOpen,
  open: openRadialMenu,
  close: closeRadialMenu,
} = useRadialMenu()

const createLevelStartNode = async () => {
  if (!editor || !area) return

  const socket = new ClassicPreset.Socket('level')
  const node = new FlowNode('Level Start')

  node.category = 'Events'
  node.color = '#4a67a8'
  node.textColor = '#ffffff'
  node.deletable = false

  node.addOutput('out', new ClassicPreset.Output(socket))

  await editor.addNode(node)

  await area.translate(node.id, {
    x: 80,
    y: 80
  })

  lastNode = node
  nodeIndex = 1
  await arrangeNodes()
}

onMounted(async () => {
  if (!reteContainer.value) return

  editor = new NodeEditor<Schemes>()
  area = new AreaPlugin<Schemes, AreaExtra>(reteContainer.value)

  const connection = new ConnectionPlugin<Schemes, AreaExtra>()
  const render = new VuePlugin<Schemes, AreaExtra>()

  //render.addPreset(Presets.classic.setup())
  render.addPreset(
    Presets.classic.setup({
      customize: {
        node() {
          return CustomNode

        }
      }
    })
  )
  connection.addPreset(ConnectionPresets.classic.setup())

  editor.use(area)
  area.use(connection)
  area.use(render)
  arrange = new AutoArrangePlugin<Schemes, AreaExtra>()

  arrange.addPreset(ArrangePresets.classic.setup())

  area.use(arrange)

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  })

  AreaExtensions.simpleNodesOrder(area)

  area.addPipe((context) => {
    if (context.type === 'nodepicked') {
      const node = editor?.getNode(context.data.id) as FlowNode | undefined

      if (node) {
        selectedNode = node

        if (node.deletable) {
          updateDeleteButtonPosition(node)
        } else {
          deleteButtonPosition.value = null
        }
      }
    }

    if (context.type === 'pointerdown') {
      const target = context.data.event.target as HTMLElement

      if (!target.closest('.node') && !target.closest('.node-delete-button')) {
        selectedNode = null
        deleteButtonPosition.value = null
      }
    }

    return context
  })

  await createLevelStartNode()
})

const updateDeleteButtonPosition = (node: FlowNode) => {
  if (!area || !reteContainer.value) return

  const view = area.nodeViews.get(node.id)
  if (!view) return

  const nodeElement = view.element as HTMLElement
  const nodeRect = nodeElement.getBoundingClientRect()
  const paneRect = reteContainer.value.getBoundingClientRect()

  deleteButtonPosition.value = {
    x: nodeRect.right - paneRect.left,
    y: nodeRect.top - paneRect.top
  }
}

const deleteSelectedNode = async () => {
  if (!editor || !selectedNode || !selectedNode.deletable) return

  const node = selectedNode

  const connections = editor
    .getConnections()
    .filter((connection) => {
      return (
        connection.source === node.id ||
        connection.target === node.id
      )
    })

  for (const connection of connections) {
    await editor.removeConnection(connection.id)
  }

  await editor.removeNode(node.id)

  if (lastNode?.id === node.id) {
    const nodes = editor.getNodes() as FlowNode[]
    lastNode = nodes[nodes.length - 1] ?? null
  }

  selectedNode = null
  deleteButtonPosition.value = null

  await arrangeNodes()
}

const arrangeNodes = async () => {
  if (!arrange || !area) return

  const applier = new ArrangeAppliers.TransitionApplier<Schemes, AreaExtra>({
    duration: 300,
    timingFunction: (t) => t
  })

  await arrange.layout({
    applier,
    options: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.spacing.nodeNode': 80,
      'elk.layered.spacing.nodeNodeBetweenLayers': 120
    }
  })

  await AreaExtensions.zoomAt(area, editor!.getNodes())
}

onBeforeUnmount(() => {
  area?.destroy()
  editor = null
  area = null
})

const addReteNode = async (payload: BlueprintPayload) => {
  if (!editor || !area) return

  const socket = new ClassicPreset.Socket(payload.category)
  const node = new FlowNode(payload.action)

  node.category = payload.category
  node.color = payload.color
  node.textColor = payload.textColor

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
    x: 80 + nodeIndex * 160,
    y: 80
  })

  if (lastNode && !isLevelStart) {

    const connection = new FlowConnection(
      lastNode,
      'out',
      node,
      'in'
    )

    await editor.addConnection(connection)
  }

  lastNode = node
  nodeIndex++

  await arrangeNodes()

  closeRadialMenu()
}
</script>

<style scoped>
.split-layout {
  display: flex;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

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

.node-delete-button {
  position: absolute;
  z-index: 9999;
  transform: translate(-50%, -50%);

  width: 36px;
  height: 36px;

  border: none;
  border-radius: 12px;
  background: #e53935;
  color: #ffffff;
  font-size: 18px;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
}

:deep(.node) {
  border-radius: 16px !important;
  border: 2px solid rgba(0, 0, 0, 0.22) !important;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18) !important;
}

:deep(.node .title) {
  font-weight: 700 !important;
}
</style>
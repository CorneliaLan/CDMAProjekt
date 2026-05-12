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
          :style="{ flexBasis: isRightCollapsed ? '100%' : `${leftWidth}%` }"
        >
          <button class="back-button" @click="goToMap">
            ← Back
          </button>
          <button class="floating-plus" @click.stop="openRadialMenu">
            <ion-icon :icon="addOutline" />
          </button>

          <div
            v-if="isRadialMenuOpen"
            class="radial-menu-overlay"
            @click.self="closeRadialMenu"
          >
          <RadialMenu
            :available-blocks="availableBlocks"
            @click.stop
            @select="addReteNode"
          />          </div>
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

     <div
          v-if="!isRightCollapsed"
          class="pane-resizer"
          @mousedown="startResize"
        >
          <button class="collapse-button" @click.stop="collapseRightPane">
            ›
          </button>
        </div>

        <section
          v-if="!isRightCollapsed"
          class="pane right-pane"
          :style="{ flexBasis: `${100 - leftWidth}%` }"
        >
          <Preview />

          <button class="expand-preview-button" @click="expandPreview">
            [ ]
          </button>
        </section>
        <div
          v-if="isRightCollapsed"
          class="pane-resizer collapsed-resizer"
        >
          <button class="collapse-button" @click.stop="restoreRightPane">
            ‹
          </button>
        </div>

        <div
          v-if="isPreviewExpanded"
          class="preview-fullscreen"
        >
          <button class="close-preview-button" @click="closePreview">
            ✕
          </button>

          <Preview />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
import { ScopesPlugin, Presets as ScopesPresets, type Scopes } from 'rete-scopes-plugin'
import {
  AutoArrangePlugin,
  Presets as ArrangePresets,
  ArrangeAppliers
} from 'rete-auto-arrange-plugin'
import Preview from '@/components/PreviewPanel.vue'

import { useEditorFacade } from '@/composables/useEditorFacade'

class FlowNode extends ClassicPreset.Node {
  width = 180
  height = 120
  parent?: string

  category = 'default'
  color = '#8799f6'
  textColor = '#ffffff'
  deletable = true
  blockId = ''
  blockKind: 'event' | 'action' | 'repeat' | 'ifwall' | 'branch' = 'action'
  scopeRole?: 'repeat' | 'if-true' | 'if-else'
  repeatCount = 3
  condition = 'wallAhead'
  onRepeatCountChange?: (value: number) => void
  onConditionChange?: (value: string) => void
}

class FlowConnection extends ClassicPreset.Connection<FlowNode, FlowNode> {}

type Schemes = ClassicPreset.GetSchemes<FlowNode, FlowConnection>

type AreaExtra = VueArea2D<Schemes> | Scopes

type BlueprintPayload = {
  category: string
  actionId: string
  actionLabel: string
  color: string
  textColor: string
}

const route = useRoute()
const router = useRouter()

const goToMap = () => {
  router.push('/map')
}

const levelId = computed(() => Number(route.params.id))

const {
  level,
  gameState,
  availableBlocks,
  program,
  addProgramBlock,
  deleteProgramBlock,
  runProgram
} = useEditorFacade(levelId)

const reteContainer = ref<HTMLElement | null>(null)

let editor: NodeEditor<Schemes> | null = null
let area: AreaPlugin<Schemes, AreaExtra> | null = null
let nodeIndex = 0
let lastNode: FlowNode | null = null
let arrange: AutoArrangePlugin<Schemes, AreaExtra> | null = null
let scopes: ScopesPlugin<Schemes, AreaExtra> | null = null

/// Delete functionality
let selectedNode: FlowNode | null = null
const deleteButtonPosition = ref<{ x: number; y: number } | null>(null)

const {
  isOpen: isRadialMenuOpen,
  open: openRadialMenu,
  close: closeRadialMenu,
} = useRadialMenu()

// Resize and collapse functionality
const leftWidth = ref(60)
const isResizing = ref(false)
const isRightCollapsed = ref(false)

const startResize = () => {
  isResizing.value = true

  window.addEventListener('mousemove', resizePanes)
  window.addEventListener('mouseup', stopResize)
}

const resizePanes = (event: MouseEvent) => {
  if (!isResizing.value) return

  const minLeft = 30
  const maxLeft = 85

  const newLeftWidth = (event.clientX / window.innerWidth) * 100

  leftWidth.value = Math.min(maxLeft, Math.max(minLeft, newLeftWidth))
}

const stopResize = () => {
  isResizing.value = false

  window.removeEventListener('mousemove', resizePanes)
  window.removeEventListener('mouseup', stopResize)

  window.dispatchEvent(new Event('resize'))
}

const collapseRightPane = () => {
  isRightCollapsed.value = true
  window.dispatchEvent(new Event('resize'))
}

const restoreRightPane = () => {
  isRightCollapsed.value = false
  leftWidth.value = 60
  window.dispatchEvent(new Event('resize'))
}
// Rete editor logic
const createLevelStartNode = async () => {
  if (!editor || !area) return

  const socket = new ClassicPreset.Socket('level')
  const node = new FlowNode('Level Start')

  node.category = 'Events'
  node.color = '#4a67a8'
  node.textColor = '#ffffff'
  node.deletable = false
  node.blockKind = 'event'
  node.blockId = 'level-start'

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
  scopes = new ScopesPlugin<Schemes, AreaExtra>({
    padding: (nodeId) => {
      const node = editor?.getNode(nodeId) as FlowNode | undefined

      if (node?.blockKind === 'ifwall') {
        return { top: 92, left: 24, right: 24, bottom: 24 }
      }

      if (node?.blockKind === 'repeat') {
        return { top: 58, left: 24, right: 24, bottom: 24 }
      }

      return { top: 42, left: 18, right: 18, bottom: 18 }
    },
    size: (nodeId, size) => {
      const node = editor?.getNode(nodeId) as FlowNode | undefined

      if (node?.blockKind === 'ifwall') {
        return {
          width: Math.max(size.width, 540),
          height: Math.max(size.height, 360)
        }
      }

      if (node?.blockKind === 'repeat') {
        return {
          width: Math.max(size.width, 260),
          height: Math.max(size.height, 190)
        }
      }

      if (node?.blockKind === 'branch') {
        return {
          width: Math.max(size.width, 240),
          height: Math.max(size.height, 150)
        }
      }

      return size
    }
  })
  scopes.addPreset(ScopesPresets.classic.setup())

  editor.use(area)
  area.use(connection)
  area.use(render)
  area.use(scopes)
  arrange = new AutoArrangePlugin<Schemes, AreaExtra>()

  arrange.addPreset(ArrangePresets.classic.setup())

  area.use(arrange)

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  })

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

    if (context.type === 'nodetranslated' && selectedNode?.id === context.data.id) {
      updateDeleteButtonPosition(selectedNode)
    }

    return context
  })

  await createLevelStartNode()
})

const hasOutput = (node: FlowNode) => {
  return Boolean(node.outputs.out)
}

const addOutputIfMissing = (node: FlowNode) => {
  if (hasOutput(node)) return

  const socket = new ClassicPreset.Socket(node.category || 'flow')
  node.addOutput('out', new ClassicPreset.Output(socket))
}

const removeOutputIfExists = (node: FlowNode) => {
  if (!hasOutput(node)) return

  node.removeOutput('out')
}

// Update delete button position when a node is moved
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

const collectDescendants = (nodeId: string): FlowNode[] => {
  if (!editor) return []

  const descendants: FlowNode[] = []
  const children = (editor.getNodes() as FlowNode[]).filter((node) => node.parent === nodeId)

  for (const child of children) {
    descendants.push(...collectDescendants(child.id))
    descendants.push(child)
  }

  return descendants
}

const removeConnectionsForNodes = async (nodeIds: Set<string>) => {
  if (!editor) return

  const connections = editor
    .getConnections()
    .filter((connection) => {
      return nodeIds.has(connection.source) || nodeIds.has(connection.target)
    })

  for (const connection of connections) {
    await editor.removeConnection(connection.id)
  }
}

const deleteSelectedNode = async () => {
  if (!editor || !selectedNode || !selectedNode.deletable) return

  const node = selectedNode
  const descendants = collectDescendants(node.id)
  const nodesToRemove = [...descendants, node]
  const nodeIds = new Set(nodesToRemove.map((entry) => entry.id))

  await removeConnectionsForNodes(nodeIds)

  for (const entry of nodesToRemove) {
    await editor.removeNode(entry.id)
  }

  if (lastNode?.id === node.id) {
    const nodes = (editor.getNodes() as FlowNode[]).filter((entry) => entry.blockKind !== 'branch')
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
  scopes = null
})

const getBlockKind = (blockId: string): FlowNode['blockKind'] => {
  if (blockId === 'repeat-x') return 'repeat'
  if (blockId === 'if-wall') return 'ifwall'
  return 'action'
}

const createFlowNode = (payload: BlueprintPayload) => {
  const node = new FlowNode(payload.actionLabel)
  const socket = new ClassicPreset.Socket(payload.category)

  node.category = payload.category
  node.color = payload.color
  node.textColor = payload.textColor
  node.blockId = payload.actionId
  node.blockKind = getBlockKind(payload.actionId)

  if (node.blockKind === 'repeat') {
    node.width = 260
    node.height = 190
    node.scopeRole = 'repeat'
    node.repeatCount = 3
    node.onRepeatCountChange = (value: number) => {
      node.repeatCount = value
    }
  }

  if (node.blockKind === 'ifwall') {
    node.width = 540
    node.height = 360
    node.condition = 'wallAhead'
    node.onConditionChange = (value: string) => {
      node.condition = value
    }
  }

  node.addInput('in', new ClassicPreset.Input(socket))
  node.addOutput('out', new ClassicPreset.Output(socket))

  return node
}

const canContainChildren = (node: FlowNode) => {
  return node.blockKind === 'repeat' || node.blockKind === 'branch'
}

const getInsertionScope = () => {
  if (!editor || !selectedNode) return null

  if (canContainChildren(selectedNode)) {
    return selectedNode
  }

  if (!selectedNode.parent) {
    return null
  }

  return editor.getNode(selectedNode.parent) as FlowNode | undefined ?? null
}

const getNodePosition = (node: FlowNode) => {
  return area?.nodeViews.get(node.id)?.position ?? { x: 80, y: 80 }
}

const getScopedChildren = (scopeId: string) => {
  if (!editor) return []

  return (editor.getNodes() as FlowNode[])
    .filter((node) => node.parent === scopeId && node.blockKind !== 'branch')
}

const getLastScopedNode = (scopeId: string) => {
  const scopedChildren = getScopedChildren(scopeId)

  return scopedChildren[scopedChildren.length - 1] ?? null
}

const updateScopeChain = async (node: FlowNode | null) => {
  if (!editor || !scopes || !node) return

  let current: FlowNode | null = node

  while (current) {
    await scopes.update(current.id)
    current = current.parent ? (editor.getNode(current.parent) as FlowNode | undefined ?? null) : null
  }
}

const createBranchScopeNode = (label: string, role: 'if-true' | 'if-else', parent: FlowNode) => {
  const node = new FlowNode(label)

  node.parent = parent.id
  node.category = 'CONTROL'
  node.color = role === 'if-true' ? '#f1fff7' : '#fff7ef'
  node.textColor = role === 'if-true' ? '#1d4f33' : '#704013'
  node.deletable = false
  node.blockId = role
  node.blockKind = 'branch'
  node.scopeRole = role
  node.width = 240
  node.height = 150

  return node
}

const connectAfterLastNode = async (node: FlowNode) => {
  if (!editor || !area || !lastNode) return

  if (!lastNode.outputs.out) {
    const lastSocket = new ClassicPreset.Socket(lastNode.category)
    lastNode.addOutput('out', new ClassicPreset.Output(lastSocket))
    await area.update('node', lastNode.id)
  }

  const connection = new FlowConnection(
    lastNode,
    'out',
    node,
    'in'
  )

  await editor.addConnection(connection)
}

const connectAfterScopedNode = async (node: FlowNode, previousNode: FlowNode | null) => {
  if (!editor || !area || !previousNode) return

  if (!previousNode.outputs.out) {
    const previousSocket = new ClassicPreset.Socket(previousNode.category)
    previousNode.addOutput('out', new ClassicPreset.Output(previousSocket))
    await area.update('node', previousNode.id)
  }

  if (!node.inputs.in) return

  const connection = new FlowConnection(
    previousNode,
    'out',
    node,
    'in'
  )

  await editor.addConnection(connection)
}

const addIfWallBranches = async (node: FlowNode, x: number, y: number) => {
  if (!editor || !area || !scopes) return

  const trueBranch = createBranchScopeNode('True Branch', 'if-true', node)
  const elseBranch = createBranchScopeNode('Else Branch', 'if-else', node)

  await editor.addNode(trueBranch)
  await editor.addNode(elseBranch)

  await area.translate(trueBranch.id, {
    x: x + 30,
    y: y + 104
  })
  await area.translate(elseBranch.id, {
    x: x + 280,
    y: y + 104
  })
  await scopes.update(node.id)
}

const addReteNode = async (payload: BlueprintPayload) => {
  if (!editor || !area) return

  const targetScope = getInsertionScope()
  const previousScopedNode = targetScope ? getLastScopedNode(targetScope.id) : null
  const node = createFlowNode(payload)
  const scopePosition = targetScope ? getNodePosition(targetScope) : null
  const scopedIndex = targetScope ? getScopedChildren(targetScope.id).length : 0
  const x = scopePosition ? scopePosition.x + 28 + scopedIndex * 150 : 80 + nodeIndex * 190
  const y = scopePosition ? scopePosition.y + 70 : 80

  if (targetScope) {
    node.parent = targetScope.id
  }

  await editor.addNode(node)
  await area.translate(node.id, { x, y })

  if (targetScope) {
    await connectAfterScopedNode(node, previousScopedNode)
  } else {
    await connectAfterLastNode(node)
  }

  if (node.blockKind === 'ifwall') {
    await addIfWallBranches(node, x, y)
  }

  if (!targetScope) {
    lastNode = node
  }
  nodeIndex++

  if (targetScope) {
    await updateScopeChain(targetScope)
    await AreaExtensions.zoomAt(area, editor.getNodes())
  } else if (node.blockKind === 'ifwall' || node.blockKind === 'repeat') {
    await AreaExtensions.zoomAt(area, editor.getNodes())
  } else {
    await arrangeNodes()
  }

  closeRadialMenu()
}

// Preview expansion logic

const isPreviewExpanded = ref(false)

const expandPreview = () => {
  isPreviewExpanded.value = true
}

const closePreview = () => {
  isPreviewExpanded.value = false
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
  overflow: hidden;
  user-select: none;
}

.right-pane {
  position: relative;
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

.expand-preview-button {
  position: absolute;
  top: 28px;
  right: 24px;
  z-index: 10;

  border: none;
  border-radius: 12px;
  width: 44px;
  height: 44px;

  background: v-bind('colors.primary');
  color: white;
  cursor: pointer;
  font-size: 20px;
}

.preview-fullscreen {
  position: fixed;
  inset: 0;
  z-index: 10000;

  background: v-bind('colors.background');

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;
  box-sizing: border-box;
}

.close-preview-button {
  position: absolute;
  top: 84px;
  right: 24px;
  z-index: 10001;

  width: 44px;
  height: 44px;

  border: none;
  border-radius: 12px;

  background: v-bind('colors.primary');
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.back-button {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 30;

  border: none;
  border-radius: 12px;

  padding: 10px 16px;

  background: v-bind('colors.primary');
  color: white;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  transition: 0.2s;
}

.back-button:hover {
  transform: translateY(-1px);
}

.left-pane {
  position: relative;
}

.pane-resizer {
  position: relative;
  flex: 0 0 8px;
  cursor: col-resize;
  background: #dcdcdc;
  z-index: 50;
}

.pane-resizer:hover {
  background: v-bind('colors.primary');
}

.collapse-button {
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);

  width: 28px;
  height: 48px;

  border: none;
  border-radius: 12px;

  background: v-bind('colors.primary');
  color: white;

  cursor: pointer;
  font-size: 22px;
  z-index: 60;
}

.collapsed-resizer {
  position: absolute;
  top: 0;
  right: 8px;
  bottom: 0;
}

.restore-preview-button {
  position: absolute;
  top: 92px;
  right: 24px;
  z-index: 100;

  border: none;
  border-radius: 12px;

  padding: 10px 16px;

  background: v-bind('colors.primary');
  color: white;

  font-weight: 600;
  cursor: pointer;
}

@media (min-width: 1024px) {
  .left-pane {
    flex-basis: 60%;
  }

  .right-pane {
    flex-basis: 40%;
  }
}
@media (max-width: 768px) {
  .pane-resizer,
  .right-pane {
    display: none;
  }

  .left-pane {
    flex-basis: 100% !important;
  }
}
</style>

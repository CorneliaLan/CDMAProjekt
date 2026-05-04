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
let lastNode: ClassicPreset.Node | null = null

const {
  isOpen: isRadialMenuOpen,
  open: openRadialMenu,
  close: closeRadialMenu,
} = useRadialMenu()

const createLevelStartNode = async () => {
  if (!editor || !area) return

  const socket = new ClassicPreset.Socket('level')
  const node = new ClassicPreset.Node('Level Start')

  node.addOutput('out', new ClassicPreset.Output(socket))

  await editor.addNode(node)

  await area.translate(node.id, {
    x: 80,
    y: 80
  })

  lastNode = node
  nodeIndex = 1
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

  await createLevelStartNode()
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
    x: 80 + nodeIndex * 160,
    y: 80
  })

  if (lastNode && !isLevelStart) {
    const connection = new ClassicPreset.Connection(
      lastNode,
      'out',
      node,
      'in'
    )

    await editor.addConnection(connection)
  }

  lastNode = node
  nodeIndex++
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
</style>
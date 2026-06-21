import { ref } from 'vue'
import { getLevelStatus } from '@/composables/useLevelProgress'
import { LEVEL_DEFINITIONS } from '@/core/levels/levelCatalog'

export type NodeStatus = 'complete' | 'active' | 'locked'

export type NodeType = {
  id: number
  title: string
  status: NodeStatus
  complexity: number
  x: number
  y: number
}

function getCenter() {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 4 // header offset
  }
}

function getOffsetX() {
  return window.innerWidth * 0.25 // 25% screen width
}

export function Maps() {
  const nodes = ref<NodeType[]>([])
  const connections = ref<number[][]>([])

  const recalcNodes = () => {
    const c = getCenter()
    const offset = getOffsetX()

    // =========================
    // NODES
    // =========================
    const orderedLevelIds = LEVEL_DEFINITIONS.map((level) => level.id)

    nodes.value = LEVEL_DEFINITIONS.map((level, i) => ({
      id: level.id,
      title: level.title,
      status: getLevelStatus(level.id, orderedLevelIds),
      complexity: Math.min(3, i + 1),

      x: c.x + (i % 2 === 0 ? -offset : offset),
      y: c.y + i * 120
    }))

    // =========================
    // CONNECTIONS (SAFE)
    // =========================
    connections.value = nodes.value
      .slice(0, -1)
      .map((node, i) => [
        node.id,
        nodes.value[i + 1].id
      ])
  }

  const getNode = (id: number) => {
    return nodes.value.find(n => n.id === id) || { x: 0, y: 0 }
  }

  return {
    nodes,
    connections,
    getNode,
    recalcNodes
  }
}

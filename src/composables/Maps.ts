import { LEVEL_DEFINITIONS } from '@/core/levels/levelCatalog';

export type NodeStatus = 'complete' | 'active' | 'locked'

export type NodeType = {
  id: number
  title: string
  status: NodeStatus
  x: number
  y: number
}

export function Maps() {

  const nodes: NodeType[] = LEVEL_DEFINITIONS.map((level, i) => ({
    id: level.id,
    title: level.title,
    // Progression is intentionally disabled for now; all levels stay selectable.
    status: 'active',
    x: i % 2 === 0 ? -150 : 150,
    y: -200 + i * 140
  }))

  const connections = nodes.slice(0, -1).map((node, index) => [node.id, nodes[index + 1].id])

  const getNode = (id: number) => {
    return nodes.find(n => n.id === id) || { x: 0, y: 0 }
  }

  return {
    nodes,
    connections,
    getNode
  }
}

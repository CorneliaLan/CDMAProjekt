export type NodeStatus = 'complete' | 'active' | 'locked'

export type NodeType = {
  id: number
  title: string
  status: NodeStatus
  complexity: number
  x: number
  y: number
}

export function Maps() {

  const nodes: NodeType[] = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    title: `Level ${i + 1}`,
    status: i < 2 ? 'complete' : i === 2 ? 'active' : 'locked',
    complexity: Math.min(3, i + 1),
    x: i % 2 === 0 ? -150 : 150,
    y: -200 + i * 140
  }))

  const connections = [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5]
  ]

  const getNode = (id: number) => {
    return nodes.find(n => n.id === id) || { x: 0, y: 0 }
  }

  return {
    nodes,
    connections,
    getNode
  }
}
import { ClassicPreset } from 'rete'
import type { NodeEditor } from 'rete'
import type { AreaPlugin } from 'rete-area-plugin'
import { AreaExtensions } from 'rete-area-plugin'
import type { ScopesPlugin } from 'rete-scopes-plugin'
import type { Ref, MaybeRef } from 'vue'
import { unref } from 'vue'
import { FlowNode, FlowConnection, isScopeNode, type Schemes, type AreaExtra } from '@/types/FlowNodes'
import type { AvailableBlock } from '@/composables/useEditorFacade'

export interface SerializedNode {
  id: string
  label: string
  blockId: string | null
  nodeKind: 'start' | 'block' | 'end'
  blockKind: 'event' | 'action' | 'repeat' | 'if' | 'branch'
  category: string
  color: string
  textColor: string
  width: number
  height: number
  deletable: boolean
  parent?: string
  scopeRole?: 'repeat' | 'if-true' | 'if-else'
  repeatCount: number
  condition: string
  customDx: number
  customDy: number
  position: { x: number; y: number }
}

export interface SerializedConnection {
  source: string
  target: string
}

export interface SerializedEditorState {
  version: 1
  levelId: number
  nodeIndex: number
  lastNodeId: string | null
  nodes: SerializedNode[]
  connections: SerializedConnection[]
}

interface PersistenceAccessors {
  editor: () => NodeEditor<Schemes> | null
  area: () => AreaPlugin<Schemes, AreaExtra> | null
  scopes: () => ScopesPlugin<Schemes, AreaExtra> | null
  getLastNode: () => FlowNode | null
  setLastNode: (node: FlowNode | null) => void
  getNodeIndex: () => number
  setNodeIndex: (n: number) => void
}

const SPECIAL_BLOCK_IDS = new Set(['level-start', 'if-true', 'if-else'])

export function useEditorPersistence(
  levelId: MaybeRef<number>,
  availableBlocks: Ref<AvailableBlock[]>,
  access: PersistenceAccessors
) {
  let _debounceTimer: ReturnType<typeof setTimeout> | null = null

  const storageKey = () => `cdma_editor_${unref(levelId)}`

  const getNodeDepth = (node: FlowNode): number => {
    const editor = access.editor()
    if (!editor) return 0
    let depth = 0
    let current: FlowNode | null = node
    while (current?.parent) {
      const parent = editor.getNode(current.parent) as FlowNode | undefined
      if (!parent) break
      depth++
      current = parent
    }
    return depth
  }

  const serializeEditorState = (): SerializedEditorState | null => {
    const editor = access.editor()
    const area = access.area()
    if (!editor || !area) return null

    const nodes: SerializedNode[] = (editor.getNodes() as FlowNode[]).map((node) => ({
      id: node.id,
      label: node.label,
      blockId: node.blockId,
      nodeKind: node.nodeKind,
      blockKind: node.blockKind,
      category: node.category,
      color: node.color,
      textColor: node.textColor,
      width: node.width,
      height: node.height,
      deletable: node.deletable,
      parent: node.parent,
      scopeRole: node.scopeRole,
      repeatCount: node.repeatCount,
      condition: node.condition,
      customDx: node.customDx,
      customDy: node.customDy,
      position: area.nodeViews.get(node.id)?.position ?? { x: 80, y: 80 }
    }))

    const connections: SerializedConnection[] = editor.getConnections().map((conn) => ({
      source: conn.source,
      target: conn.target
    }))

    return {
      version: 1,
      levelId: unref(levelId),
      nodeIndex: access.getNodeIndex(),
      lastNodeId: access.getLastNode()?.id ?? null,
      nodes,
      connections
    }
  }

  const saveEditorState = () => {
    const state = serializeEditorState()
    if (!state) return
    try {
      localStorage.setItem(storageKey(), JSON.stringify(state))
    } catch (e) {
      console.warn('[cdma] Failed to persist editor state', e)
    }
  }

  const saveEditorStateDebounced = () => {
    if (_debounceTimer !== null) clearTimeout(_debounceTimer)
    _debounceTimer = setTimeout(() => {
      _debounceTimer = null
      saveEditorState()
    }, 300)
  }

  const reconstructFlowNode = (sn: SerializedNode): FlowNode => {
    const node = new FlowNode(sn.label)
    ;(node as any).id = sn.id
    node.blockId = sn.blockId
    node.nodeKind = sn.nodeKind
    node.blockKind = sn.blockKind
    node.category = sn.category
    node.color = sn.color
    node.textColor = sn.textColor
    node.width = sn.width
    node.height = sn.height
    node.deletable = sn.deletable
    node.repeatCount = sn.repeatCount
    node.condition = sn.condition
    node.customDx = sn.customDx
    node.customDy = sn.customDy
    if (sn.parent !== undefined) node.parent = sn.parent
    if (sn.scopeRole !== undefined) node.scopeRole = sn.scopeRole

    if (node.blockKind === 'repeat') {
      node.onRepeatCountChange = (value: number) => {
        node.repeatCount = value
        saveEditorStateDebounced()
      }
    }
    if (node.blockKind === 'if') {
      node.onConditionChange = (value: string) => {
        node.condition = value
        saveEditorStateDebounced()
      }
      node.onCustomDxChange = (value: number) => {
        node.customDx = value
        saveEditorStateDebounced()
      }
      node.onCustomDyChange = (value: number) => {
        node.customDy = value
        saveEditorStateDebounced()
      }
    }

    const socket = new ClassicPreset.Socket(node.category || 'flow')
    if (sn.nodeKind === 'start') {
      node.addOutput('out', new ClassicPreset.Output(socket))
    } else if (sn.blockKind !== 'branch') {
      node.addInput('in', new ClassicPreset.Input(socket))
      if (sn.nodeKind !== 'end') {
        node.addOutput('out', new ClassicPreset.Output(socket))
      }
    }

    return node
  }

  const findLastNodeFromStart = (): FlowNode | null => {
    const editor = access.editor()
    if (!editor) return null
    const startNode = (editor.getNodes() as FlowNode[]).find((n) => n.nodeKind === 'start')
    if (!startNode) return null
    let current: FlowNode = startNode
    const visited = new Set<string>()
    while (true) {
      visited.add(current.id)
      const nextConn = editor.getConnections().find((c) => c.source === current.id)
      if (!nextConn) return current
      const next = editor.getNode(nextConn.target) as FlowNode | undefined
      if (!next || visited.has(next.id)) return current
      current = next
    }
  }

  const loadEditorState = async (state: SerializedEditorState): Promise<boolean> => {
    const editor = access.editor()
    const area = access.area()
    const scopes = access.scopes()
    if (!editor || !area || !scopes) return false
    if (state.version !== 1) return false
    if (state.nodes.length === 0) return false

    const validBlockIds = new Set(availableBlocks.value.map((b) => b.id))
    for (const sn of state.nodes) {
      if (sn.blockId !== null && !validBlockIds.has(sn.blockId) && !SPECIAL_BLOCK_IDS.has(sn.blockId)) {
        return false
      }
    }

    // Topological sort: parents before children
    const ordered: SerializedNode[] = []
    const inserted = new Set<string>()
    let remaining = [...state.nodes]
    while (remaining.length > 0) {
      const before = remaining.length
      remaining = remaining.filter((sn) => {
        if (!sn.parent || inserted.has(sn.parent)) {
          ordered.push(sn)
          inserted.add(sn.id)
          return false
        }
        return true
      })
      if (remaining.length === before) break
    }

    for (const sn of ordered) {
      const node = reconstructFlowNode(sn)
      await editor.addNode(node)
      await area.translate(node.id, sn.position)
    }

    for (const sc of state.connections) {
      const sourceNode = editor.getNode(sc.source) as FlowNode | undefined
      const targetNode = editor.getNode(sc.target) as FlowNode | undefined
      if (!sourceNode || !targetNode) continue
      const conn = new FlowConnection(sourceNode, 'out', targetNode, 'in')
      await editor.addConnection(conn)
    }

    const scopeNodes = (editor.getNodes() as FlowNode[])
      .filter(isScopeNode)
      .sort((a, b) => getNodeDepth(b) - getNodeDepth(a))

    for (const node of scopeNodes) {
      await scopes.update(node.id)
    }

    access.setNodeIndex(state.nodeIndex)
    const restoredLast = state.lastNodeId
      ? ((editor.getNode(state.lastNodeId) as FlowNode | undefined) ?? null)
      : null
    access.setLastNode(restoredLast ?? findLastNodeFromStart())

    await AreaExtensions.zoomAt(area, editor.getNodes())
    return true
  }

  const flushAndSave = () => {
    if (_debounceTimer !== null) {
      clearTimeout(_debounceTimer)
      _debounceTimer = null
    }
    saveEditorState()
  }

  const tryLoadFromStorage = async (): Promise<boolean> => {
    const raw = localStorage.getItem(storageKey())
    if (!raw) return false
    try {
      return await loadEditorState(JSON.parse(raw) as SerializedEditorState)
    } catch {
      console.warn('[cdma] Corrupt editor state, starting fresh')
      return false
    }
  }

  return {
    saveEditorState,
    saveEditorStateDebounced,
    loadEditorState,
    tryLoadFromStorage,
    flushAndSave
  }
}

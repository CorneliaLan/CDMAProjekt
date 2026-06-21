import { ClassicPreset, type GetSchemes } from 'rete'
import type { VueArea2D } from 'rete-vue-plugin'
import type { Scopes } from 'rete-scopes-plugin'

export class FlowNode extends ClassicPreset.Node {
  width = 180
  height = 120
  parent?: string

  blockId: string | null = null
  nodeKind: 'start' | 'block' | 'end' = 'block'
  category = 'default'
  color = '#8799f6'
  textColor = '#ffffff'
  deletable = true
  debugActive = false
  debugErrorActive = false
  blockKind: 'event' | 'action' | 'repeat' | 'if' | 'branch' = 'action'
  scopeRole?: 'repeat' | 'if-true' | 'if-else'
  repeatCount = 3
  condition = 'wallUp'
  customDx = 0
  customDy = 0
  onRepeatCountChange?: (value: number) => void
  onConditionChange?: (value: string) => void
  onCustomDxChange?: (value: number) => void
  onCustomDyChange?: (value: number) => void
}

export class FlowConnection extends ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node> {}

export type Schemes = GetSchemes<FlowNode, FlowConnection>

export type AreaExtra = VueArea2D<Schemes> | Scopes

export type BlueprintPayload = {
  category: string
  actionId: string
  actionLabel: string
  color: string
  textColor: string
}

export type ScopeBlockKind = 'if' | 'repeat' | 'branch'

export const isScopeNode = (
  node: FlowNode | undefined | null
): node is FlowNode & { blockKind: ScopeBlockKind } => {
  return node?.blockKind === 'if' || node?.blockKind === 'repeat' || node?.blockKind === 'branch'
}

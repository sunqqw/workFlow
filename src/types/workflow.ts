export interface WorkflowNode {
  id: string
  type: 'start' | 'end' | 'approval' | 'api' | 'branch' | 'custom'
  position: { x: number; y: number }
  data: {
    label: string
    config: Record<string, any>
    schema: Record<string, any>
  }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  type?: string
  label?: string
  markerEnd?: any
  animated?: boolean
  style?: any
  class?: string
}

export interface Workflow {
  id: string
  name: string
  description?: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  viewport: { x: number; y: number; zoom: number }
  createdAt: number
  updatedAt: number
}

export interface ValidationError {
  type: 'isolated' | 'required'
  nodeId: string
  field?: string
}

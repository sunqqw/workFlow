import { defineStore } from 'pinia'
import type { Workflow, WorkflowNode, WorkflowEdge, ValidationError } from '@/types/workflow'

export const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    currentWorkflow: null as Workflow | null,
    selectedNode: null as WorkflowNode | null,
    history: [] as Workflow[],
    historyIndex: -1
  }),
  actions: {
    initWorkflow() {
      const id = Date.now().toString()
      this.currentWorkflow = {
        id,
        name: 'New Workflow',
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      this.history = [JSON.parse(JSON.stringify(this.currentWorkflow))]
      this.historyIndex = 0
    },

    setWorkflow(workflow: Workflow) {
      this.currentWorkflow = workflow
      this.history = [JSON.parse(JSON.stringify(workflow))]
      this.historyIndex = 0
    },

    selectNode(node: WorkflowNode | null) {
      this.selectedNode = node
    },

    updateNodePosition(nodeId: string, position: { x: number, y: number }) {
      if (!this.currentWorkflow) return
      const node = this.currentWorkflow.nodes.find(n => n.id === nodeId)
      if (node) {
        node.position = position
        this.currentWorkflow.updatedAt = Date.now()
      }
    },

    addNode(node: WorkflowNode) {
      if (!this.currentWorkflow) return
      this.currentWorkflow.nodes.push(node)
      this.currentWorkflow.updatedAt = Date.now()
      this.saveHistory()
    },

    removeNode(nodeId: string) {
      if (!this.currentWorkflow) return
      this.currentWorkflow.nodes = this.currentWorkflow.nodes.filter(n => n.id !== nodeId)
      this.currentWorkflow.edges = this.currentWorkflow.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
      if (this.selectedNode?.id === nodeId) {
        this.selectedNode = null
      }
      this.currentWorkflow.updatedAt = Date.now()
      this.saveHistory()
    },

    addEdge(edge: WorkflowEdge) {
      if (!this.currentWorkflow) return
      this.currentWorkflow.edges.push(edge)
      this.currentWorkflow.updatedAt = Date.now()
      this.saveHistory()
    },

    removeEdge(edgeId: string) {
      if (!this.currentWorkflow) return
      this.currentWorkflow.edges = this.currentWorkflow.edges.filter(e => e.id !== edgeId)
      this.currentWorkflow.updatedAt = Date.now()
      this.saveHistory()
    },

    updateNodeConfig(nodeId: string, config: any) {
      if (!this.currentWorkflow) return
      const node = this.currentWorkflow.nodes.find(n => n.id === nodeId)
      if (node) {
        node.data.config = config
        this.currentWorkflow.updatedAt = Date.now()
      }
    },

    updateNodeLabel(nodeId: string, label: string) {
      if (!this.currentWorkflow) return
      const node = this.currentWorkflow.nodes.find(n => n.id === nodeId)
      if (node) {
        node.data.label = label
        this.currentWorkflow.updatedAt = Date.now()
      }
    },

    saveHistory() {
        if (!this.currentWorkflow) return
        // Remove future history if we are not at the end
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1)
        }
        this.history.push(JSON.parse(JSON.stringify(this.currentWorkflow)))
        this.historyIndex = this.history.length - 1
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift()
            this.historyIndex--
        }
    },

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--
            this.currentWorkflow = JSON.parse(JSON.stringify(this.history[this.historyIndex]))
            // Restore selection if possible, or clear it
            this.selectedNode = null 
        }
    },

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++
            this.currentWorkflow = JSON.parse(JSON.stringify(this.history[this.historyIndex]))
            this.selectedNode = null
        }
    }
  }
})

import { defineStore } from 'pinia'
import type { Workflow, WorkflowNode, WorkflowEdge, ValidationError } from '@/types/workflow'
import api from '@/api'

export const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    currentWorkflow: null as Workflow | null,
    selectedNode: null as WorkflowNode | null,
    history: [] as Workflow[],
    historyIndex: -1,
    workflows: [] as Workflow[],
    loading: false
  }),
  actions: {
    async fetchWorkflows() {
      this.loading = true
      try {
        const res = await api.get('/workflows')
        this.workflows = res.data
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async fetchWorkflow(id: string) {
      this.loading = true
      try {
        const res = await api.get(`/workflows/${id}`)
        this.setWorkflow(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async createWorkflow(name: string = 'New Workflow') {
      this.loading = true
      try {
        const payload = {
            name,
            nodes: [],
            edges: [],
            viewport: { x: 0, y: 0, zoom: 1 }
        }
        const res = await api.post('/workflows', payload)
        this.setWorkflow(res.data)
        return res.data
      } catch (err) {
        console.error(err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async saveWorkflow() {
        if (!this.currentWorkflow) return
        try {
            const res = await api.patch(`/workflows/${this.currentWorkflow.id}`, this.currentWorkflow)
            // Update current workflow with server response (e.g. updated timestamp)
            // Preserve selection
            const selectedId = this.selectedNode?.id
            this.currentWorkflow = res.data
            if (selectedId) {
                this.selectedNode = this.currentWorkflow?.nodes.find(n => n.id === selectedId) || null
            }
            return res.data
        } catch (err) {
            console.error(err)
            throw err
        }
    },

    // Local state management for designer
    initWorkflow() {
      // Used for client-side only initialization if needed, or cleared
      this.currentWorkflow = null
      this.history = []
      this.historyIndex = -1
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

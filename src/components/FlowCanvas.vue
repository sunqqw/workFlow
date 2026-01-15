<script setup lang="ts">
import { VueFlow, useVueFlow, MarkerType } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { useWorkflowStore } from '@/stores/workflow'
import { computed } from 'vue'
import CustomNode from './CustomNode.vue'

const store = useWorkflowStore()
const { project } = useVueFlow()

const nodes = computed({
  get: () => store.currentWorkflow?.nodes || [],
  set: (val) => {
    if (store.currentWorkflow) store.currentWorkflow.nodes = val
  }
})

const edges = computed({
  get: () => store.currentWorkflow?.edges || [],
  set: (val) => {
    if (store.currentWorkflow) store.currentWorkflow.edges = val
  }
})

const onConnect = (params: any) => {
  const edge = {
    ...params,
    id: `e${params.source}-${params.target}`,
    markerEnd: MarkerType.ArrowClosed,
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#2563eb', strokeWidth: 2 },
  }
  store.addEdge(edge)
}

const onNodeDragStop = (event: any) => {
  store.saveHistory()
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const onDrop = (event: DragEvent) => {
  const type = event.dataTransfer?.getData('application/vueflow')
  if (!type) return

  const { left, top } = (event.currentTarget as HTMLElement).getBoundingClientRect()
  
  const position = project({
    x: event.clientX - left,
    y: event.clientY - top,
  })

  // Basic node structure
  const newNode: any = {
    id: Date.now().toString(),
    position,
    type: 'custom', // Use custom node component
    data: { 
        label: type.charAt(0).toUpperCase() + type.slice(1) + ' Node',
        type: type, // Pass original type for icon/style
        config: {},
        schema: {} 
    },
  }
  
  if (type === 'start') {
    newNode.data.label = 'Start'
  } else if (type === 'end') {
    newNode.data.label = 'End'
  }

  // Pre-fill schema based on type (mock logic for now)
  if (type === 'api') {
      newNode.data.schema = {
          type: 'object',
          properties: {
              url: { type: 'string', title: 'API URL', format: 'uri' },
              method: { type: 'string', title: 'Method', enum: ['GET', 'POST', 'PUT', 'DELETE'], default: 'GET' }
          },
          required: ['url']
      }
  } else if (type === 'approval') {
      newNode.data.schema = {
          type: 'object',
          properties: {
              approver: { type: 'string', title: 'Approver' },
              timeout: { type: 'number', title: 'Timeout (hours)', default: 24 }
          }
      }
  }

  store.addNode(newNode)
}

const onNodeClick = (event: any) => {
    store.selectNode(event.node)
}

const onPaneClick = () => {
    store.selectNode(null)
}
</script>

<template>
  <div class="h-full w-full" @drop="onDrop" @dragover="onDragOver">
    <VueFlow
      v-if="store.currentWorkflow"
      v-model:nodes="nodes"
      v-model:edges="edges"
      @node-click="onNodeClick"
      @pane-click="onPaneClick"
      @connect="onConnect"
      @node-drag-stop="onNodeDragStop"
      fit-view-on-init
      class="bg-gray-50"
    >
      <template #node-custom="nodeProps">
        <CustomNode v-bind="nodeProps" />
      </template>
      <Background />
      <Controls />
      <MiniMap />
    </VueFlow>
    <div v-else class="flex items-center justify-center h-full text-gray-400">
      Loading...
    </div>
  </div>
</template>

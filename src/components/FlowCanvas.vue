<script setup lang="ts">
import { VueFlow, useVueFlow, MarkerType } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { useWorkflowStore } from '@/stores/workflow'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import CustomNode from './CustomNode.vue'

const store = useWorkflowStore()
const { project, addSelectedElements, onNodesChange } = useVueFlow()

const contextMenu = ref({
    visible: false,
    x: 0,
    y: 0,
    type: null as 'node' | 'edge' | null,
    id: null as string | string[] | null // Support multiple IDs
})

// Enable multi-selection box
const selectionMode = ref(true)
const selectionKeyCode = 'Shift' // Hold Shift to enable selection box

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
  // Validate connection: only allow Right handle (source) to Left handle (target)
  if (params.sourceHandle !== 'source' || params.targetHandle !== 'target') {
      return
  }

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
    hideContextMenu()
}

const onEdgeClick = (event: any) => {
    store.selectEdge(event.edge) // Assuming we add this to store or handle locally
    hideContextMenu()
}

const onPaneClick = () => {
    store.selectNode(null)
    hideContextMenu()
}

const onNodeContextMenu = (event: any) => {
    event.event.preventDefault()
    showContextMenu(event.event.clientX, event.event.clientY, 'node', event.node.id)
}

const onEdgeContextMenu = (event: any) => {
    event.event.preventDefault()
    showContextMenu(event.event.clientX, event.event.clientY, 'edge', event.edge.id)
}

const showContextMenu = (x: number, y: number, type: 'node' | 'edge', id: string) => {
    contextMenu.value = {
        visible: true,
        x,
        y,
        type,
        id
    }
}

const hideContextMenu = () => {
    contextMenu.value.visible = false
}

const handleDelete = () => {
    if (Array.isArray(contextMenu.value.id)) {
        // Not used yet for context menu, but ready for batch context actions
        store.removeNodes(contextMenu.value.id)
    } else if (contextMenu.value.type === 'node' && contextMenu.value.id) {
        store.removeNode(contextMenu.value.id)
    } else if (contextMenu.value.type === 'edge' && contextMenu.value.id) {
        store.removeEdge(contextMenu.value.id)
    }
    hideContextMenu()
}

// Close context menu on global click
const onGlobalClick = () => {
    if (contextMenu.value.visible) {
        hideContextMenu()
    }
}

onMounted(() => {
    window.addEventListener('click', onGlobalClick)
})

onUnmounted(() => {
    window.removeEventListener('click', onGlobalClick)
})
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
      @edge-click="onEdgeClick"
      @edge-context-menu="onEdgeContextMenu"
      @node-context-menu="onNodeContextMenu"
      :selection-key-code="selectionKeyCode"
      :multi-selection-key-code="selectionKeyCode"
      :delete-key-code="'Backspace'"
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

    <!-- Context Menu -->
    <div 
        v-if="contextMenu.visible" 
        class="fixed z-50 bg-white border border-gray-200 shadow-lg rounded-md py-1 min-w-[120px]"
        :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
    >
        <div 
            class="px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer flex items-center gap-2"
            @click="handleDelete"
        >
            <span>Delete</span>
        </div>
    </div>

    <div v-else-if="!store.currentWorkflow" class="flex items-center justify-center h-full text-gray-400">
      Loading...
    </div>
  </div>
</template>

<style>
/* Selection box style */
.vue-flow__selection {
    background-color: rgba(0, 89, 220, 0.08);
    border: 1px solid rgba(0, 89, 220, 0.8);
    border-radius: 4px;
    z-index: 1000; /* Ensure it's above other elements */
}
</style>

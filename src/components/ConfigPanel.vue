<script setup lang="ts">
import { computed } from 'vue'
import { useWorkflowStore } from '@/stores/workflow'
import SimpleSchemaForm from './SimpleSchemaForm.vue'
import { Delete } from '@element-plus/icons-vue'

const store = useWorkflowStore()

const selectedNode = computed(() => store.selectedNode)

const nodeLabel = computed({
  get: () => selectedNode.value?.data.label || '',
  set: (val) => {
    if (selectedNode.value) {
      store.updateNodeLabel(selectedNode.value.id, val)
      store.saveHistory()
    }
  }
})

const schema = computed(() => selectedNode.value?.data.schema || {})
const formData = computed({
  get: () => selectedNode.value?.data.config || {},
  set: (val) => {
    if (selectedNode.value) {
      store.updateNodeConfig(selectedNode.value.id, val)
      // Save history after config change
      store.saveHistory()
    }
  }
})

const handleDelete = () => {
    if (selectedNode.value) {
        store.removeNode(selectedNode.value.id)
    }
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="p-4 border-b border-gray-200 bg-gray-50">
      <h3 class="font-bold text-gray-700">Configuration</h3>
      <div v-if="selectedNode" class="mt-3">
        <label class="text-xs font-medium text-gray-500 block mb-1">Node Name</label>
        <el-input v-model="nodeLabel" size="default" class="mb-2" />
        <div class="text-xs text-gray-400">
            ID: {{ selectedNode.id }} <br>
            Type: {{ selectedNode.type }}
        </div>
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="selectedNode">
        <div v-if="Object.keys(schema).length > 0 || (schema.properties && Object.keys(schema.properties).length > 0)">
            <SimpleSchemaForm
                v-model="formData"
                :schema="schema"
            />
        </div>
        <div v-else class="text-gray-400 text-center py-4">
            No configuration options for this node.
        </div>
      </div>
      <div v-else class="text-gray-400 text-center py-10">
        Select a node to configure
      </div>
    </div>

    <div v-if="selectedNode" class="p-4 border-t border-gray-200 bg-gray-50">
        <el-button type="danger" :icon="Delete" class="w-full" @click="handleDelete">Delete Node</el-button>
    </div>
  </div>
</template>

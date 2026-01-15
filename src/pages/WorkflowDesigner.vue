<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useWorkflowStore } from '@/stores/workflow'
import NodeLibrary from '@/components/NodeLibrary.vue'
import FlowCanvas from '@/components/FlowCanvas.vue'
import ConfigPanel from '@/components/ConfigPanel.vue'
import { ArrowLeft, ArrowRight, Download, RefreshLeft, RefreshRight } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const store = useWorkflowStore()
const router = useRouter()
const route = useRoute()

const handleKeyDown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
    event.preventDefault()
    if (event.shiftKey) {
      store.redo()
    } else {
      store.undo()
    }
  } else if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
    event.preventDefault()
    store.redo()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  const id = route.params.id as string
  if (id) {
      const saved = localStorage.getItem(`workflow_${id}`)
      if (saved) {
          try {
            store.setWorkflow(JSON.parse(saved))
          } catch (e) {
            console.error('Failed to load workflow', e)
            store.initWorkflow()
          }
      } else {
          store.initWorkflow()
      }
  } else {
    store.initWorkflow()
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const goBack = () => {
    router.push('/')
}

const handleSave = () => {
    if (store.currentWorkflow) {
        localStorage.setItem(`workflow_${store.currentWorkflow.id}`, JSON.stringify(store.currentWorkflow))
        ElMessage.success('Workflow saved successfully')
    }
}

const handleUndo = () => store.undo()
const handleRedo = () => store.redo()

</script>

<template>
  <div class="flex flex-col h-screen w-screen overflow-hidden">
    <!-- Toolbar -->
    <div class="h-14 bg-white border-b border-gray-200 flex items-center px-4 justify-between z-10 relative shadow-sm">
        <div class="flex items-center gap-4">
            <el-button link :icon="ArrowLeft" @click="goBack">Back</el-button>
            <h1 class="font-bold text-gray-700">{{ store.currentWorkflow?.name || 'Untitled Workflow' }}</h1>
        </div>
        <div class="flex items-center gap-2">
            <el-button-group>
                <el-button :icon="RefreshLeft" @click="handleUndo" :disabled="store.historyIndex <= 0" title="Undo" />
                <el-button :icon="RefreshRight" @click="handleRedo" :disabled="store.historyIndex >= store.history.length - 1" title="Redo" />
            </el-button-group>
            <el-divider direction="vertical" />
            <el-button type="primary" :icon="Download" @click="handleSave">Save</el-button>
        </div>
    </div>

    <div class="flex flex-1 overflow-hidden">
        <!-- Left Sidebar: Node Library -->
        <div class="w-64 flex-shrink-0">
        <NodeLibrary />
        </div>

        <!-- Center: Canvas -->
        <div class="flex-1 bg-gray-100 relative">
        <FlowCanvas />
        </div>

        <!-- Right Sidebar: Configuration -->
        <div class="w-80 flex-shrink-0 bg-white border-l border-gray-200">
        <ConfigPanel />
        </div>
    </div>
  </div>
</template>

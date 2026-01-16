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
      store.fetchWorkflow(id)
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

const handleSave = async () => {
    try {
        await store.saveWorkflow()
        ElMessage.success('Workflow saved successfully')
    } catch (error) {
        ElMessage.error('Failed to save workflow')
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
            <el-button type="primary" :icon="Download" @click="handleSave" :loading="store.loading">Save</el-button>
        </div>
    </div>

    <div class="flex flex-1 overflow-hidden">
        <!-- Left Sidebar: Node Library -->
        <div class="w-64 flex-shrink-0">
        <NodeLibrary />
        </div>

        <!-- Center: Canvas -->
        <div class="flex-1 bg-gray-100 relative">
        <div v-if="store.loading && !store.currentWorkflow" class="absolute inset-0 flex items-center justify-center z-50 bg-white/50">
            Loading...
        </div>
        <FlowCanvas v-else />
        </div>

        <!-- Right Sidebar: Configuration -->
        <div class="w-80 flex-shrink-0 bg-white border-l border-gray-200" v-if="store.selectedNode">
        <ConfigPanel />
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, DataBoard, SwitchButton } from '@element-plus/icons-vue'
import { useWorkflowStore } from '@/stores/workflow'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const workflowStore = useWorkflowStore()
const authStore = useAuthStore()

onMounted(() => {
  workflowStore.fetchWorkflows()
})

const createNew = async () => {
  try {
    const newWorkflow = await workflowStore.createWorkflow()
    router.push(`/designer/${newWorkflow.id}`)
  } catch (error) {
    console.error('Failed to create workflow', error)
  }
}

const openWorkflow = (id: string) => {
  router.push(`/designer/${id}`)
}

const goToFormBuilder = () => {
    router.push('/form-builder')
}

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800">My Workflows</h1>
            <div class="flex gap-3 items-center">
                <span class="text-gray-500 mr-2">Welcome, {{ authStore.user?.username }}</span>
                <el-button @click="goToFormBuilder" :icon="Plus">Forms</el-button>
                <el-button type="primary" size="large" :icon="Plus" @click="createNew">Create Workflow</el-button>
                <el-button type="danger" circle :icon="SwitchButton" @click="handleLogout" title="Logout" />
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <!-- New Workflow Card -->
        <div 
            class="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all h-64"
            @click="createNew"
        >
            <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-blue-500">
                <el-icon :size="32"><Plus /></el-icon>
            </div>
            <span class="font-medium text-gray-600">Create New Workflow</span>
        </div>

        <!-- Workflow List -->
        <div 
            v-for="workflow in workflowStore.workflows" 
            :key="workflow.id"
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer h-64 flex flex-col"
            @click="openWorkflow(workflow.id)"
        >
            <div class="flex-1">
                <h3 class="font-bold text-lg text-gray-800 mb-2 truncate">{{ workflow.name }}</h3>
                <p class="text-gray-500 text-sm line-clamp-3">{{ workflow.description || 'No description' }}</p>
            </div>
            <div class="text-xs text-gray-400 mt-4 border-t pt-4">
                Updated: {{ new Date(workflow.updatedAt).toLocaleDateString() }}
            </div>
        </div>
        </div>
    </div>
  </div>
</template>

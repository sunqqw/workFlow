<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Plus, DataBoard } from '@element-plus/icons-vue'

const router = useRouter()

const createNew = () => {
  router.push('/designer')
}

const goToFormBuilder = () => {
    router.push('/form-builder')
}
</script>

<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800">My Workflows</h1>
            <div class="flex gap-3">
                <el-button @click="goToFormBuilder" :icon="Plus">Forms</el-button>
                <el-button type="primary" size="large" :icon="Plus" @click="createNew">Create Workflow</el-button>
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
        </div>
    </div>
  </div>
</template>

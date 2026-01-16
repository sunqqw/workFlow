<script setup lang="ts">
import { onMounted } from 'vue'
import { useFormStore } from '@/stores/form'
import ComponentLibrary from './components/ComponentLibrary.vue'
import FormCanvas from './components/FormCanvas.vue'
import FormConfigPanel from './components/FormConfigPanel.vue'
import { ArrowLeft, View, Download } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const store = useFormStore()
const router = useRouter()

onMounted(() => {
  store.initForm()
})

const goBack = () => {
    router.push('/')
}

const handleSave = () => {
    console.log('Save form', store.currentForm)
}
</script>

<template>
  <div class="flex flex-col h-screen w-screen overflow-hidden">
    <!-- Toolbar -->
    <div class="h-14 bg-white border-b border-gray-200 flex items-center px-4 justify-between z-10 relative shadow-sm">
        <div class="flex items-center gap-4">
            <el-button link :icon="ArrowLeft" @click="goBack">Back</el-button>
            <h1 class="font-bold text-gray-700">{{ store.currentForm?.name || 'Untitled Form' }}</h1>
        </div>
        <div class="flex items-center gap-2">
            <el-button :icon="View">Preview</el-button>
            <el-divider direction="vertical" />
            <el-button type="primary" :icon="Download" @click="handleSave">Save</el-button>
        </div>
    </div>

    <div class="flex flex-1 overflow-hidden">
        <!-- Left: Component Library -->
        <div class="w-64 flex-shrink-0">
            <ComponentLibrary />
        </div>

        <!-- Center: Canvas -->
        <div class="flex-1 bg-gray-100 relative overflow-hidden">
            <FormCanvas />
        </div>

        <!-- Right: Configuration -->
        <div class="w-80 flex-shrink-0 bg-white border-l border-gray-200">
            <FormConfigPanel />
        </div>
    </div>
  </div>
</template>

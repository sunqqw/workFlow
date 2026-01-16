<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useFormStore } from '@/stores/form'
import ComponentLibrary from './components/ComponentLibrary.vue'
import FormCanvas from './components/FormCanvas.vue'
import FormConfigPanel from './components/FormConfigPanel.vue'
import FormPreview from './components/FormPreview.vue'
import { ArrowLeft, View, Download } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const store = useFormStore()
const router = useRouter()
const route = useRoute()
const previewVisible = ref(false)

onMounted(() => {
  const id = route.params.id as string
  if (id) {
      store.fetchForm(id)
  } else {
      store.initForm()
  }
})

const goBack = () => {
    router.push('/')
}

const handlePreview = () => {
    previewVisible.value = true
}

const handleSave = async () => {
    try {
        if (store.currentForm?.id && store.currentForm.id.length > 10) {
             // Assume ID length check or check if we are in create mode
             // For simplicity, if we loaded from ID, update.
             await store.saveForm()
        } else {
             // Create
             const newForm = await store.createForm(store.currentForm?.name)
             router.push(`/form-builder/${newForm.id}`)
        }
        ElMessage.success('Form saved successfully')
    } catch (error) {
        ElMessage.error('Failed to save form')
    }
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
            <el-button :icon="View" @click="handlePreview">Preview</el-button>
            <el-divider direction="vertical" />
            <el-button type="primary" :icon="Download" @click="handleSave" :loading="store.loading">Save</el-button>
        </div>
    </div>

    <div class="flex flex-1 overflow-hidden">
        <!-- Left: Component Library -->
        <div class="w-64 flex-shrink-0">
            <ComponentLibrary />
        </div>

        <!-- Center: Canvas -->
        <div class="flex-1 bg-gray-100 relative overflow-hidden">
            <div v-if="store.loading && !store.currentForm" class="absolute inset-0 flex items-center justify-center z-50 bg-white/50">
                Loading...
            </div>
            <FormCanvas v-else />
        </div>

        <!-- Right: Configuration -->
        <div class="w-80 flex-shrink-0 bg-white border-l border-gray-200">
            <FormConfigPanel />
        </div>
    </div>
    
    <FormPreview v-model="previewVisible" :form="store.currentForm" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, DataBoard, SwitchButton, MoreFilled, Delete, Edit } from '@element-plus/icons-vue'
import { useWorkflowStore } from '@/stores/workflow'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const workflowStore = useWorkflowStore()
const authStore = useAuthStore()

const editDialogVisible = ref(false)
const editingWorkflow = ref<{ id: string, name: string, description: string } | null>(null)

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

const handleEdit = (event: Event, workflow: any) => {
    event.stopPropagation()
    editingWorkflow.value = {
        id: workflow.id,
        name: workflow.name,
        description: workflow.description || ''
    }
    editDialogVisible.value = true
}

const handleDelete = (event: Event, id: string) => {
    event.stopPropagation()
    ElMessageBox.confirm(
        'Are you sure you want to delete this workflow? This action cannot be undone.',
        'Warning',
        {
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    ).then(async () => {
        try {
            await workflowStore.deleteWorkflow(id)
            ElMessage.success('Workflow deleted')
        } catch (error) {
            ElMessage.error('Failed to delete workflow')
        }
    })
}

const saveEdit = async () => {
    if (!editingWorkflow.value) return
    try {
        await workflowStore.updateWorkflow(editingWorkflow.value.id, {
            name: editingWorkflow.value.name,
            description: editingWorkflow.value.description
        })
        editDialogVisible.value = false
        ElMessage.success('Workflow updated')
    } catch (error) {
        ElMessage.error('Failed to update workflow')
    }
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
            class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer h-64 flex flex-col group relative"
            @click="openWorkflow(workflow.id)"
        >
            <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10" @click.stop>
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link p-2 hover:bg-gray-100 rounded-full block">
                        <el-icon><MoreFilled /></el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item :icon="Edit" @click="handleEdit($event, workflow)">Edit</el-dropdown-item>
                            <el-dropdown-item :icon="Delete" class="text-red-500" @click="handleDelete($event, workflow.id)">Delete</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>

            <div class="flex-1">
                <h3 class="font-bold text-lg text-gray-800 mb-2 truncate pr-8">{{ workflow.name }}</h3>
                <p class="text-gray-500 text-sm line-clamp-3">{{ workflow.description || 'No description' }}</p>
            </div>
            <div class="text-xs text-gray-400 mt-4 border-t pt-4">
                Updated: {{ new Date(workflow.updatedAt).toLocaleDateString() }}
            </div>
        </div>
        </div>
    </div>

    <!-- Edit Dialog -->
    <el-dialog v-model="editDialogVisible" title="Edit Workflow" width="500px">
        <el-form v-if="editingWorkflow" label-position="top">
            <el-form-item label="Name">
                <el-input v-model="editingWorkflow.name" />
            </el-form-item>
            <el-form-item label="Description">
                <el-input v-model="editingWorkflow.description" type="textarea" rows="3" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="editDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="saveEdit">Save</el-button>
            </span>
        </template>
    </el-dialog>
  </div>
</template>

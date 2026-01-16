<script setup lang="ts">
import { computed } from 'vue'
import { useFormStore } from '@/stores/form'
import SimpleSchemaForm from '@/components/SimpleSchemaForm.vue'
import { Delete } from '@element-plus/icons-vue'

const store = useFormStore()

const selectedField = computed(() => store.selectedField)
const currentForm = computed(() => store.currentForm)

// Schema for field configuration
const fieldConfigSchema = computed(() => {
    if (!selectedField.value) return {}
    
    const baseProps = {
        label: { type: 'string', title: 'Label' },
        field: { type: 'string', title: 'Field Key' },
        required: { type: 'boolean', title: 'Required' },
        placeholder: { type: 'string', title: 'Placeholder' },
        width: { type: 'string', title: 'Width', enum: ['100%', '75%', '66%', '50%', '33%', '25%'] }
    }

    return {
        type: 'object',
        properties: baseProps
    }
})

// Schema for global form configuration
const formConfigSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', title: 'Form Name' },
        submitText: { type: 'string', title: 'Submit Button Text' },
        labelPosition: { type: 'string', title: 'Label Position', enum: ['top', 'left', 'right'] }
    }
}

const fieldFormData = computed({
    get: () => {
        if (!selectedField.value) return {}
        return {
            ...selectedField.value,
            width: selectedField.value.layout?.width || '100%'
        }
    },
    set: (val) => {
        if (selectedField.value) {
            const { width, ...rest } = val
            store.updateFieldConfig(selectedField.value.id, {
                ...rest,
                layout: { width }
            })
        }
    }
})

const formFormData = computed({
    get: () => {
        if (!currentForm.value) return {}
        return {
            name: currentForm.value.name,
            ...currentForm.value.config
        }
    },
    set: (val: any) => {
        if (currentForm.value) {
            currentForm.value.name = val.name
            store.updateFormConfig({
                submitText: val.submitText,
                labelPosition: val.labelPosition
            })
        }
    }
})

const handleDelete = () => {
    if (selectedField.value) {
        store.removeField(selectedField.value.id)
    }
}
</script>

<template>
  <div class="h-full flex flex-col bg-white">
    <div class="p-4 border-b border-gray-200 bg-gray-50">
      <h3 class="font-bold text-gray-700">
          {{ selectedField ? 'Field Configuration' : 'Form Settings' }}
      </h3>
    </div>
    
    <div class="flex-1 overflow-y-auto p-4">
      <!-- Field Config -->
      <div v-if="selectedField">
        <div class="text-xs text-gray-400 mb-4">
            Type: {{ selectedField.type }} <br>
            ID: {{ selectedField.id }}
        </div>
        
        <SimpleSchemaForm
            v-model="fieldFormData"
            :schema="fieldConfigSchema"
        />

        <div class="mt-6 pt-4 border-t">
             <el-button type="danger" :icon="Delete" class="w-full" @click="handleDelete">Delete Field</el-button>
        </div>
      </div>

      <!-- Global Form Config -->
      <div v-else-if="currentForm">
          <SimpleSchemaForm
            v-model="formFormData"
            :schema="formConfigSchema"
        />
      </div>
    </div>
  </div>
</template>

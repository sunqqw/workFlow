<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'
import { useFormStore } from '@/stores/form'
import { Delete, DocumentCopy } from '@element-plus/icons-vue'
import type { FormField } from '@/types/form'

const store = useFormStore()

const fields = computed({
    get: () => store.currentForm?.fields || [],
    set: (val) => {
        if (store.currentForm) store.currentForm.fields = val
    }
})

const onAdd = (evt: any) => {
    // If it's a new item from library (has isNew flag), we replace it with proper store initialization
    if (evt.item._underlying_vm_ && evt.item._underlying_vm_.isNew) {
        // Remove the temporary item added by draggable
        const newIndex = evt.newIndex
        const type = evt.item._underlying_vm_.type
        
        // Remove the temp item from array
        store.currentForm?.fields.splice(newIndex, 1)
        
        // Add real field via store
        store.addField(type)
        
        // Move the newly added item (which is at end) to correct index if needed
        // For simplicity, addField pushes to end. If we want precise drop, we need more logic.
        // But for MVP, appending is fine or we can reorder.
    }
}

const onSelect = (field: FormField) => {
    store.selectField(field)
}

const onDelete = (e: Event, id: string) => {
    e.stopPropagation()
    store.removeField(id)
}
</script>

<template>
  <div class="h-full w-full bg-gray-100 p-8 overflow-y-auto">
    <div 
        class="bg-white shadow-sm min-h-[600px] p-8 max-w-3xl mx-auto rounded-lg"
        @click="store.selectField(null)"
    >
        <div v-if="!store.currentForm" class="text-center text-gray-400 py-20">Loading...</div>
        
        <div v-else>
            <h1 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">{{ store.currentForm.name }}</h1>
            
            <draggable
                v-model="fields"
                group="form-builder"
                item-key="id"
                class="space-y-4 min-h-[200px]"
                ghost-class="opacity-50"
                @add="onAdd"
            >
                <template #item="{ element }">
                    <div 
                        class="relative p-4 border rounded group hover:border-blue-400 cursor-pointer transition-colors bg-white"
                        :class="{'ring-2 ring-blue-500 border-blue-500': store.selectedField?.id === element.id, 'border-gray-200': store.selectedField?.id !== element.id}"
                        @click.stop="onSelect(element)"
                    >
                        <!-- Field Rendering -->
                        <div class="mb-2">
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                {{ element.label }}
                                <span v-if="element.required" class="text-red-500">*</span>
                            </label>
                            
                            <!-- Preview Inputs (Read-only) -->
                            <el-input v-if="element.type === 'input'" disabled placeholder="Text input" />
                            <el-input-number v-else-if="element.type === 'number'" disabled class="w-full" />
                            <el-select v-else-if="element.type === 'select'" disabled placeholder="Select option" class="w-full" />
                            <el-checkbox v-else-if="element.type === 'checkbox'" disabled>Checkbox</el-checkbox>
                            <el-radio v-else-if="element.type === 'radio'" disabled label="1">Radio</el-radio>
                            <el-date-picker v-else-if="element.type === 'date'" disabled type="date" class="w-full" />
                            <div v-else-if="element.type === 'upload'" class="border border-dashed p-4 text-center text-gray-400 rounded">Upload Area</div>
                            <div v-else-if="element.type === 'group'" class="border p-4 rounded bg-gray-50 min-h-[50px]">
                                <span class="text-xs text-gray-400 uppercase font-bold">Group Container</span>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <el-button type="danger" circle size="small" :icon="Delete" @click="(e) => onDelete(e, element.id)" />
                        </div>
                    </div>
                </template>
            </draggable>

            <div class="mt-8 flex justify-end" v-if="fields.length > 0">
                <el-button type="primary">{{ store.currentForm.config.submitText }}</el-button>
            </div>
            
            <div v-if="fields.length === 0" class="text-center text-gray-400 py-10 border-2 border-dashed rounded-lg">
                Drag components here
            </div>
        </div>
    </div>
  </div>
</template>

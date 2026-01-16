<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { useFormStore } from '@/stores/form'
import { Type, Hash, List, CheckSquare, CircleDot, Calendar, Upload, Folder } from 'lucide-vue-next'

const store = useFormStore()

const fieldTypes = [
  { type: 'input', label: 'Input', icon: Type },
  { type: 'number', label: 'Number', icon: Hash },
  { type: 'select', label: 'Select', icon: List },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'radio', label: 'Radio', icon: CircleDot },
  { type: 'date', label: 'Date', icon: Calendar },
  { type: 'upload', label: 'Upload', icon: Upload },
  { type: 'group', label: 'Group', icon: Folder },
]

const cloneField = (typeObj: any) => {
    // This is called when dragging from library to canvas
    // We return a dummy object, actual creation happens in store.addField
    // But draggable needs an object
    return {
        id: Date.now().toString(),
        type: typeObj.type,
        label: typeObj.label,
        isNew: true // Flag to identify new items
    }
}
</script>

<template>
  <div class="p-4 border-r border-gray-200 h-full bg-white flex flex-col">
    <h3 class="font-bold mb-4 text-gray-700">Components</h3>
    
    <draggable
      :list="fieldTypes"
      :group="{ name: 'form-builder', pull: 'clone', put: false }"
      :clone="cloneField"
      item-key="type"
      class="grid gap-3"
    >
      <template #item="{ element }">
        <div class="p-3 border rounded cursor-move hover:shadow-md transition-shadow bg-gray-50 flex items-center gap-2 select-none hover:bg-blue-50 hover:border-blue-200">
          <component :is="element.icon" class="w-4 h-4 text-gray-500" />
          <span class="text-sm text-gray-700">{{ element.label }}</span>
        </div>
      </template>
    </draggable>
  </div>
</template>

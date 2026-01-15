<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  schema: any
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue'])

const formData = computed({
  get: () => props.modelValue || {},
  set: (val) => emit('update:modelValue', val)
})

const updateField = (key: string, value: any) => {
  const newData = { ...formData.value, [key]: value }
  emit('update:modelValue', newData)
}
</script>

<template>
  <div class="space-y-4">
    <div v-if="!schema.properties" class="text-gray-400 text-sm">No properties defined in schema</div>
    <div v-else v-for="(prop, key) in schema.properties" :key="key">
      <div class="mb-1 text-sm font-medium text-gray-700 flex items-center gap-1">
        {{ prop.title || key }}
        <span v-if="schema.required?.includes(key)" class="text-red-500">*</span>
      </div>
      
      <!-- Enum Select -->
      <el-select
        v-if="prop.enum"
        :model-value="formData[key] ?? prop.default"
        @update:model-value="(val: any) => updateField(key as string, val)"
        class="w-full"
        placeholder="Select"
      >
        <el-option v-for="opt in prop.enum" :key="opt" :label="opt" :value="opt" />
      </el-select>

      <!-- Boolean Switch -->
      <div v-else-if="prop.type === 'boolean'">
          <el-switch
            :model-value="formData[key] ?? prop.default"
            @update:model-value="(val: boolean) => updateField(key as string, val)"
          />
      </div>

      <!-- Number Input -->
      <el-input-number
        v-else-if="prop.type === 'number' || prop.type === 'integer'"
        :model-value="formData[key] ?? prop.default"
        @update:model-value="(val: number) => updateField(key as string, val)"
        class="w-full"
      />

      <!-- String Input -->
      <el-input
        v-else
        :model-value="formData[key] ?? prop.default"
        @update:model-value="(val: string) => updateField(key as string, val)"
        type="text"
        :placeholder="prop.description || ''"
      />
      
      <div v-if="prop.description" class="text-xs text-gray-400 mt-1">{{ prop.description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FormTemplate } from '@/types/form'

const props = defineProps<{
  modelValue: boolean
  form: FormTemplate | null
}>()

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <el-dialog v-model="visible" title="Form Preview" width="800px" destroy-on-close>
    <div v-if="form" class="p-4">
      <div class="flex flex-wrap -mx-2">
        <div 
            v-for="element in form.fields" 
            :key="element.id" 
            :style="{ width: element.layout?.width || '100%' }"
            class="px-2 mb-4"
        >
            <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ element.label }}
                    <span v-if="element.required" class="text-red-500">*</span>
                </label>
                
                <el-input v-if="element.type === 'input'" :placeholder="element.placeholder" />
                <el-input-number v-else-if="element.type === 'number'" class="w-full" />
                <el-select v-else-if="element.type === 'select'" :placeholder="element.placeholder" class="w-full">
                    <el-option v-for="opt in element.options" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
                <el-checkbox-group v-else-if="element.type === 'checkbox'">
                    <el-checkbox v-for="opt in element.options" :key="opt.value" :label="opt.value">{{ opt.label }}</el-checkbox>
                </el-checkbox-group>
                <el-radio-group v-else-if="element.type === 'radio'">
                    <el-radio v-for="opt in element.options" :key="opt.value" :label="opt.value">{{ opt.label }}</el-radio>
                </el-radio-group>
                <el-date-picker v-else-if="element.type === 'date'" type="date" class="w-full" :placeholder="element.placeholder" />
                <el-upload v-else-if="element.type === 'upload'" drag action="#" multiple>
                    <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
                </el-upload>
                <div v-else-if="element.type === 'group'" class="border p-4 rounded bg-gray-50">
                    <div class="text-xs text-gray-400 uppercase font-bold mb-2">Group: {{ element.label }}</div>
                    <!-- Nested recursive rendering would go here, simplified for now -->
                     <div class="text-sm text-gray-500 italic">Nested content support coming soon</div>
                </div>
            </div>
        </div>
      </div>
      
      <div class="mt-8 flex justify-end border-t pt-4">
          <el-button type="primary">{{ form.config.submitText }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

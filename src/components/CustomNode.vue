<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { computed } from 'vue'
import { Play, Square, UserCheck, Globe, GitFork, MoreHorizontal, FileText, Cpu, Mic } from 'lucide-vue-next'

const props = defineProps<{
  id: string
  data: {
    label: string
    config: any
    schema: any
    type?: string
  }
  selected?: boolean
}>()

const nodeIcon = computed(() => {
  const type = props.data.type || 'default'
  switch (type) {
    case 'start': return Play
    case 'end': return Square
    case 'approval': return UserCheck
    case 'api': return Globe
    case 'branch': return GitFork
    case 'model': return Cpu
    case 'audio': return Mic
    default: return FileText
  }
})

const headerColor = computed(() => {
    const type = props.data.type || 'default'
    switch (type) {
        case 'start': return 'bg-blue-100 text-blue-600'
        case 'end': return 'bg-gray-100 text-gray-600'
        case 'branch': return 'bg-cyan-100 text-cyan-600'
        case 'model': return 'bg-purple-100 text-purple-600'
        default: return 'bg-gray-100 text-gray-600'
    }
})
</script>

<template>
  <div 
    class="custom-node bg-white rounded-lg shadow-sm border min-w-[240px] transition-all duration-200"
    :class="[selected ? 'border-blue-500 shadow-md ring-1 ring-blue-500' : 'border-gray-200 hover:shadow-md']"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-3 border-b border-gray-100">
      <div class="flex items-center gap-3">
         <div class="w-8 h-8 rounded-md flex items-center justify-center" :class="headerColor">
            <component :is="nodeIcon" class="w-5 h-5" />
         </div>
         <div class="flex flex-col">
             <span class="font-semibold text-gray-800 text-sm">{{ data.label }}</span>
             <span class="text-[10px] text-gray-400 font-mono">{{ id }}</span>
         </div>
      </div>
      <div class="p-1 hover:bg-gray-100 rounded cursor-pointer text-gray-400">
          <MoreHorizontal class="w-4 h-4" />
      </div>
    </div>

    <!-- Body -->
    <div class="p-3 space-y-3">
        <!-- Mock Input Section -->
        <div class="flex items-center gap-2">
            <div class="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">
                Input
            </div>
            <div class="h-[1px] flex-1 bg-gray-100"></div>
        </div>

        <!-- Content Area (Mock) -->
        <div class="text-xs text-gray-500 space-y-1">
            <div v-if="data.type === 'start'" class="flex items-center justify-between">
                <span>Entry Point</span>
            </div>
            <div v-else class="flex items-center justify-between">
                <span>Params</span>
                <span class="font-mono text-gray-400">...</span>
            </div>
            
            <div class="pt-2 flex items-center gap-1 text-[10px] text-gray-400">
                <span v-if="data.type === 'model'" class="text-green-600 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Ready
                </span>
                <span v-else>Configured</span>
            </div>
        </div>

        <!-- Mock Output Section -->
        <div class="flex items-center gap-2">
            <div class="h-[1px] flex-1 bg-gray-100"></div>
            <div class="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">
                Output
            </div>
        </div>
    </div>

    <!-- Handles -->
    <Handle 
        id="target" 
        type="target" 
        :position="Position.Left" 
        class="!w-3 !h-3 !bg-blue-500 !border-2 !border-white !-ml-1.5 hover:!w-4 hover:!h-4 transition-all" 
    />
    <Handle 
        id="source" 
        type="source" 
        :position="Position.Right" 
        class="!w-3 !h-3 !bg-blue-500 !border-2 !border-white !-mr-1.5 hover:!w-4 hover:!h-4 transition-all" 
    />
  </div>
</template>

<style scoped>
.custom-node {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>

<script setup lang="ts">
import { Play, Square, UserCheck, Globe, GitFork } from 'lucide-vue-next'

const nodeTypes = [
  { type: 'start', label: 'Start Node', icon: Play },
  { type: 'end', label: 'End Node', icon: Square },
  { type: 'approval', label: 'Approval', icon: UserCheck },
  { type: 'api', label: 'API Request', icon: Globe },
  { type: 'branch', label: 'Branch', icon: GitFork }
]

const onDragStart = (event: DragEvent, type: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', type)
    event.dataTransfer.effectAllowed = 'move'
  }
}
</script>

<template>
  <div class="p-4 border-r border-gray-200 h-full bg-white flex flex-col">
    <h3 class="font-bold mb-4 text-gray-700">Node Library</h3>
    <div class="grid gap-3">
      <div
        v-for="node in nodeTypes"
        :key="node.type"
        class="p-3 border rounded cursor-move hover:shadow-md transition-shadow bg-gray-50 flex items-center gap-2 select-none"
        :draggable="true"
        @dragstart="(event) => onDragStart(event, node.type)"
      >
        <component :is="node.icon" class="w-4 h-4 text-gray-500" />
        <span class="text-sm text-gray-700">{{ node.label }}</span>
      </div>
    </div>
  </div>
</template>

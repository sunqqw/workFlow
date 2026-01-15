import { createRouter, createWebHistory } from 'vue-router'
import WorkflowDesigner from '@/pages/WorkflowDesigner.vue'
import WorkflowList from '@/pages/WorkflowList.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: WorkflowList
    },
    {
      path: '/designer',
      component: WorkflowDesigner
    },
    {
      path: '/designer/:id',
      component: WorkflowDesigner
    }
  ]
})

export default router

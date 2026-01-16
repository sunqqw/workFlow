import { createRouter, createWebHistory } from 'vue-router'
import WorkflowDesigner from '@/pages/WorkflowDesigner.vue'
import WorkflowList from '@/pages/WorkflowList.vue'
import FormBuilder from '@/views/form-builder/FormBuilder.vue'

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
    },
    {
      path: '/form-builder',
      component: FormBuilder
    },
    {
      path: '/form-builder/:id',
      component: FormBuilder
    }
  ]
})

export default router

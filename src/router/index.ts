import { createRouter, createWebHistory } from 'vue-router'
import WorkflowDesigner from '@/pages/WorkflowDesigner.vue'
import WorkflowList from '@/pages/WorkflowList.vue'
import FormBuilder from '@/views/form-builder/FormBuilder.vue'
import Login from '@/pages/Login.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: WorkflowList,
      meta: { requiresAuth: true }
    },
    {
      path: '/designer',
      component: WorkflowDesigner,
      meta: { requiresAuth: true }
    },
    {
      path: '/designer/:id',
      component: WorkflowDesigner,
      meta: { requiresAuth: true }
    },
    {
      path: '/form-builder',
      component: FormBuilder,
      meta: { requiresAuth: true }
    },
    {
      path: '/form-builder/:id',
      component: FormBuilder,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router

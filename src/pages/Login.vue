<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const authStore = useAuthStore()
const username = ref('admin')
const password = ref('password')
const loading = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    ElMessage.warning('Please enter username and password')
    return
  }
  
  loading.value = true
  try {
    await authStore.login(username.value, password.value)
    ElMessage.success('Login successful')
  } catch (error) {
    ElMessage.error('Login failed. Please check your credentials.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Flow2</h1>
        <p class="text-gray-500 mt-2">Low-Code Platform</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <el-input
            v-model="username"
            placeholder="Username"
            :prefix-icon="User"
            size="large"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <el-input
            v-model="password"
            type="password"
            placeholder="Password"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </div>
        
        <el-button
          type="primary"
          native-type="submit"
          class="w-full"
          size="large"
          :loading="loading"
        >
          Sign In
        </el-button>
        
        <div class="text-center text-xs text-gray-400 mt-4">
          Demo Credentials: admin / password
        </div>
      </form>
    </div>
  </div>
</template>

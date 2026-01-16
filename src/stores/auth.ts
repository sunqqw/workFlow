import { defineStore } from 'pinia'
import api from '@/api'
import router from '@/router'

interface User {
  userId: number
  username: string
}

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(username: string, password: string) {
      try {
        const response = await api.post('/auth/login', { username, password })
        this.token = response.data.access_token
        localStorage.setItem('token', this.token!)
        
        // Fetch user profile
        const profileResponse = await api.get('/auth/profile')
        this.user = profileResponse.data
        localStorage.setItem('user', JSON.stringify(this.user))
        
        router.push('/')
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      router.push('/login')
    },
  },
})

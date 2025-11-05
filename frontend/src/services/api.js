import axios from 'axios'
import { useAuthStore } from '../utils/store'

const API_URL = 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth endpoints
export const auth = {
  login: (data) => api.post('/auth/login', new URLSearchParams(data), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  register: (type, data) => api.post(`/auth/register/${type}`, data),
  me: () => api.get('/auth/me'),
}

// Elections endpoints
export const elections = {
  getAll: (params) => api.get('/elections', { params }),
  getOne: (id) => api.get(`/elections/${id}`),
  create: (data) => api.post('/elections', data),
  update: (id, data) => api.put(`/elections/${id}`, data),
  delete: (id) => api.delete(`/elections/${id}`),
}

// Voters endpoints
export const voters = {
  getAll: (params) => api.get('/voters', { params }),
  getOne: (id) => api.get(`/voters/${id}`),
  update: (id, data) => api.put(`/voters/${id}`, data),
  delete: (id) => api.delete(`/voters/${id}`),
}

// Parties endpoints
export const parties = {
  getAll: (params) => api.get('/parties', { params }),
  getOne: (id) => api.get(`/parties/${id}`),
  update: (id, data) => api.put(`/parties/${id}`, data),
  delete: (id) => api.delete(`/parties/${id}`),
}

// Staff endpoints
export const staff = {
  getAll: (params) => api.get('/staff', { params }),
  getOne: (id) => api.get(`/staff/${id}`),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
}

// Votes endpoints
export const votes = {
  getAll: (params) => api.get('/votes', { params }),
  getOne: (id) => api.get(`/votes/${id}`),
  create: (data) => api.post('/votes', data),
  delete: (id) => api.delete(`/votes/${id}`),
}

// Complaints endpoints
export const complaints = {
  getAll: (params) => api.get('/complaints', { params }),
  getOne: (id) => api.get(`/complaints/${id}`),
  create: (data) => api.post('/complaints', data),
  update: (id, data) => api.put(`/complaints/${id}`, data),
  delete: (id) => api.delete(`/complaints/${id}`),
}

// Results endpoints
export const results = {
  getAll: (params) => api.get('/results', { params }),
  getOne: (id) => api.get(`/results/${id}`),
  create: (data) => api.post('/results', data),
  update: (id, data) => api.put(`/results/${id}`, data),
  delete: (id) => api.delete(`/results/${id}`),
}

export default api

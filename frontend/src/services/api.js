import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }),
  getMe: () => api.get('/auth/me'),
};

// Polls API
export const pollsAPI = {
  getAll: (skip = 0, limit = 100) => api.get(`/polls?skip=${skip}&limit=${limit}`),
  getOne: (id) => api.get(`/polls/${id}`),
  getById: (id) => api.get(`/polls/${id}`),
  create: (data) => api.post('/polls', data),
  update: (id, data) => api.put(`/polls/${id}`, data),
  delete: (id) => api.delete(`/polls/${id}`),
};

// Teams API
export const teamsAPI = {
  getAll: (skip = 0, limit = 100) => api.get(`/teams?skip=${skip}&limit=${limit}`),
  getOne: (id) => api.get(`/teams/${id}`),
  create: (data) => api.post('/teams', data),
  update: (id, data) => api.put(`/teams/${id}`, data),
  delete: (id) => api.delete(`/teams/${id}`),
};

// Votes API
export const votesAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.poll_id) queryParams.append('poll_id', params.poll_id);
    if (params.skip !== undefined) queryParams.append('skip', params.skip);
    if (params.limit !== undefined) queryParams.append('limit', params.limit);
    return api.get(`/votes?${queryParams.toString()}`);
  },
  getOne: (id) => api.get(`/votes/${id}`),
  create: (data) => api.post('/votes', data),
  getResults: (pollId) => api.get(`/votes/poll/${pollId}/results`),
};

// Feedback API
export const feedbackAPI = {
  getAll: (skip = 0, limit = 100) => api.get(`/feedback?skip=${skip}&limit=${limit}`),
  getOne: (id) => api.get(`/feedback/${id}`),
  create: (data) => api.post('/feedback', data),
  update: (id, data) => api.put(`/feedback/${id}`, data),
  delete: (id) => api.delete(`/feedback/${id}`),
};

export default api;

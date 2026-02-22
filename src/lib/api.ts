import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Admin API
export const adminAPI = {
  // Auth
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  // Users Management
  getAllUsers: () => api.get('/users'),
  
  updateUserRole: (userId: string, role: 'USER' | 'SUPER_ADMIN') =>
    api.patch(`/users/${userId}/role`, { role }),

  deleteUser: (userId: string) => api.delete(`/users/${userId}`),

  // AI Prompts Management
  getAllPrompts: () => api.get('/ai-prompts'),

  createPrompt: (data: {
    promptKey: string;
    promptText: string;
    promptType: 'TEXT' | 'IMAGE';
    templateKey: string;
  }) => api.post('/ai-prompts', data),

  updatePrompt: (
    id: string,
    data: {
      promptText?: string;
      promptType?: 'TEXT' | 'IMAGE';
    }
  ) => api.put(`/ai-prompts/${id}`, data),

  deletePrompt: (id: string) => api.delete(`/ai-prompts/${id}`),

  // Domains (view all)
  getAllDomains: () => api.get('/domains'),

  // Leads (view all)
  getAllLeads: () => api.get('/leads'),

  // Statistics
  getStats: async () => {
    const [users, domains, leads, prompts] = await Promise.all([
      api.get('/users'),
      api.get('/domains'),
      api.get('/leads'),
      api.get('/ai-prompts'),
    ]);

    return {
      totalUsers: users.data.length,
      totalDomains: domains.data.length,
      totalLeads: leads.data.length,
      totalPrompts: prompts.data.length,
    };
  },
};


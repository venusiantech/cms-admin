import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminAPI = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  // ── Stats ─────────────────────────────────────────────────────────────────
  getStats: () => api.get('/admin/stats'),

  // ── Users ─────────────────────────────────────────────────────────────────
  getAllUsers: () => api.get('/admin/users'),
  updateUserRole: (userId: string, role: 'USER' | 'SUPER_ADMIN') =>
    api.patch(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),

  // ── AI Prompts ────────────────────────────────────────────────────────────
  getAllPrompts: (templateKey?: string) =>
    api.get('/admin/ai-prompts', { params: templateKey ? { templateKey } : {} }),
  createPrompt: (data: {
    promptKey: string;
    promptText: string;
    promptType: 'TEXT' | 'IMAGE';
    templateKey: string;
  }) => api.post('/admin/ai-prompts', data),
  updatePrompt: (id: string, data: { promptText?: string; promptType?: 'TEXT' | 'IMAGE' }) =>
    api.put(`/admin/ai-prompts/${id}`, data),
  deletePrompt: (id: string) => api.delete(`/admin/ai-prompts/${id}`),

  // ── Websites ──────────────────────────────────────────────────────────────
  getAllWebsites: () => api.get('/admin/websites'),
  getWebsite: (id: string) => api.get(`/admin/websites/${id}`),
  updateWebsiteSettings: (id: string, data: Record<string, any>) =>
    api.put(`/admin/websites/${id}/settings`, data),
  approveAds: (id: string, approved: boolean) =>
    api.put(`/admin/websites/${id}/approve-ads`, { approved }),

  // ── Domains ───────────────────────────────────────────────────────────────
  getAllDomains: () => api.get('/admin/domains'),
  getDomain: (id: string) => api.get(`/admin/domains/${id}`),
  deleteDomain: (id: string) => api.delete(`/admin/domains/${id}`),

  // ── Leads ─────────────────────────────────────────────────────────────────
  getAllLeads: () => api.get('/admin/leads'),
  deleteLead: (id: string) => api.delete(`/admin/leads/${id}`),

  // ── Storage ───────────────────────────────────────────────────────────────
  getStorageOverview: () => api.get('/admin/storage'),
  getWebsiteStorage: (websiteId: string) => api.get(`/admin/storage/${websiteId}`),
  deleteBlogSection: (sectionId: string) => api.delete(`/admin/storage/section/${sectionId}`),
  deleteBlock: (blockId: string) => api.delete(`/admin/storage/block/${blockId}`),
  deleteAllWebsiteContent: (websiteId: string) => api.delete(`/admin/storage/${websiteId}/all-content`),
};

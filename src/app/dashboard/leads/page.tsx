'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { Trash2, Search, Mail, Building2 } from 'lucide-react';

export default function LeadsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['admin-leads'],
    queryFn: async () => {
      const res = await adminAPI.getAllLeads();
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteLead(id),
    onSuccess: () => {
      toast.success('Lead deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      setDeletingId(null);
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const filtered = leads.filter((l: any) =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.email?.toLowerCase().includes(search.toLowerCase()) ||
    l.website?.domain?.domainName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
          <p className="text-sm text-gray-500 mt-1">{leads.length} total contact submissions</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((lead: any) => (
            <div key={lead.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">{lead.name}</span>
                    {lead.company && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Building2 size={11} /> {lead.company}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
                      <Mail size={11} /> {lead.email}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{lead.message}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span>
                      From: <span className="font-mono text-gray-600">{lead.website?.domain?.domainName}</span>
                    </span>
                    <span>Owner: {lead.website?.domain?.user?.email}</span>
                    <span>{new Date(lead.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <button
                  onClick={() => setDeletingId(lead.id)}
                  className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm bg-white rounded-xl border border-gray-200">
              No leads found
            </div>
          )}
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Lead?</h3>
            <p className="text-sm text-gray-600 mb-5">This will permanently delete this contact submission.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deletingId)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

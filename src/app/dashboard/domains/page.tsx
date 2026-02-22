'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { Trash2, CheckCircle2, Clock, Search, AlertCircle } from 'lucide-react';

export default function DomainsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: domains = [], isLoading } = useQuery({
    queryKey: ['admin-domains'],
    queryFn: async () => {
      const res = await adminAPI.getAllDomains();
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteDomain(id),
    onSuccess: () => {
      toast.success('Domain deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-domains'] });
      setDeletingId(null);
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to delete'),
  });

  const filtered = domains.filter((d: any) =>
    d.domainName?.toLowerCase().includes(search.toLowerCase()) ||
    d.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Domains</h2>
          <p className="text-sm text-gray-500 mt-1">{domains.length} total domains</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search domain or user..."
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Domain', 'Owner', 'Status', 'DNS Status', 'Nameservers', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((domain: any) => (
                <tr key={domain.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-gray-900">{domain.domainName}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{domain.user?.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      domain.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {domain.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {domain.nameServersStatus === 'active' ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    ) : domain.nameServersStatus ? (
                      <span className="flex items-center gap-1 text-xs text-yellow-600 font-medium">
                        <Clock size={12} /> Pending
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <AlertCircle size={12} /> Not set
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {domain.nameServers?.length > 0 ? (
                      <div className="text-xs text-gray-500 font-mono space-y-0.5">
                        {domain.nameServers.slice(0, 2).map((ns: string, i: number) => (
                          <div key={i}>{ns}</div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setDeletingId(domain.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete domain"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">No domains found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Domain?</h3>
            <p className="text-sm text-gray-600 mb-5">
              This will permanently delete the domain and all associated websites, pages, and content. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deletingId)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
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

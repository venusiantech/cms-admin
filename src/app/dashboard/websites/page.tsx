'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { ExternalLink, CheckCircle2, XCircle, Settings, X, Save, Loader2, Search } from 'lucide-react';

export default function WebsitesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [editingWebsite, setEditingWebsite] = useState<any>(null);
  const [editForm, setEditForm] = useState<Record<string, any>>({});

  const { data: websites = [], isLoading } = useQuery({
    queryKey: ['admin-websites'],
    queryFn: async () => {
      const res = await adminAPI.getAllWebsites();
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminAPI.updateWebsiteSettings(id, data),
    onSuccess: () => {
      toast.success('Website settings updated!');
      queryClient.invalidateQueries({ queryKey: ['admin-websites'] });
      setEditingWebsite(null);
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to update'),
  });

  const adsMutation = useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) =>
      adminAPI.approveAds(id, approved),
    onSuccess: (_data, vars) => {
      toast.success(vars.approved ? 'Ads approved!' : 'Ads rejected');
      queryClient.invalidateQueries({ queryKey: ['admin-websites'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const openEdit = (website: any) => {
    setEditingWebsite(website);
    setEditForm({
      templateKey: website.templateKey,
      contactFormEnabled: website.contactFormEnabled,
      adsEnabled: website.adsEnabled,
      metaTitle: website.metaTitle || '',
      metaDescription: website.metaDescription || '',
      metaKeywords: website.metaKeywords || '',
      metaAuthor: website.metaAuthor || '',
      instagramUrl: website.instagramUrl || '',
      facebookUrl: website.facebookUrl || '',
      twitterUrl: website.twitterUrl || '',
      contactEmail: website.contactEmail || '',
      contactPhone: website.contactPhone || '',
      googleAnalyticsId: website.googleAnalyticsId || '',
      logoDisplayMode: website.logoDisplayMode || 'logo_only',
    });
  };

  const filtered = websites.filter((w: any) =>
    w.domain?.domainName?.toLowerCase().includes(search.toLowerCase()) ||
    w.domain?.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Websites</h2>
          <p className="text-sm text-gray-500 mt-1">{websites.length} total websites</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by domain or user..."
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
                {['Domain', 'Owner', 'Template', 'Ads', 'Contact Form', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((website: any) => (
                <tr key={website.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-gray-900">{website.domain?.domainName}</span>
                      <a
                        href={`https://${website.domain?.domainName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-indigo-600"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">{website.subdomain}.jaal.com</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{website.domain?.user?.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">{website.templateKey}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        website.adsApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {website.adsApproved ? 'Approved' : 'Pending'}
                      </span>
                      {!website.adsApproved ? (
                        <button
                          onClick={() => adsMutation.mutate({ id: website.id, approved: true })}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Approve ads"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => adsMutation.mutate({ id: website.id, approved: false })}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                          title="Revoke ads approval"
                        >
                          <XCircle size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      website.contactFormEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {website.contactFormEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openEdit(website)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Settings size={12} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">No websites found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit modal */}
      {editingWebsite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Edit Website Settings</h3>
                <p className="text-sm text-gray-500 font-mono">{editingWebsite.domain?.domainName}</p>
              </div>
              <button onClick={() => setEditingWebsite(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Toggles */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: 'adsEnabled', label: 'Ads Enabled' },
                  { key: 'contactFormEnabled', label: 'Contact Form' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editForm[key]}
                      onChange={(e) => setEditForm({ ...editForm, [key]: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </label>
                ))}
              </div>

              {/* Template Key */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Template</label>
                <select
                  value={editForm.templateKey}
                  onChange={(e) => setEditForm({ ...editForm, templateKey: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="templateA">Template A</option>
                  <option value="modernNews">Modern News</option>
                </select>
              </div>

              {/* Logo display mode */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Logo Display</label>
                <select
                  value={editForm.logoDisplayMode}
                  onChange={(e) => setEditForm({ ...editForm, logoDisplayMode: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="logo_only">Logo Only</option>
                  <option value="text_only">Text Only</option>
                  <option value="both">Both</option>
                </select>
              </div>

              {/* Text fields */}
              {[
                { key: 'metaTitle', label: 'Meta Title' },
                { key: 'metaDescription', label: 'Meta Description' },
                { key: 'metaKeywords', label: 'Meta Keywords' },
                { key: 'metaAuthor', label: 'Meta Author' },
                { key: 'instagramUrl', label: 'Instagram URL' },
                { key: 'facebookUrl', label: 'Facebook URL' },
                { key: 'twitterUrl', label: 'Twitter URL' },
                { key: 'contactEmail', label: 'Contact Email' },
                { key: 'contactPhone', label: 'Contact Phone' },
                { key: 'googleAnalyticsId', label: 'Google Analytics ID' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">{label}</label>
                  <input
                    type="text"
                    value={editForm[key] ?? ''}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setEditingWebsite(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => updateMutation.mutate({ id: editingWebsite.id, data: editForm })}
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {updateMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

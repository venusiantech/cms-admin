'use client';

import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import { Users, Globe, Inbox, FileText, Layout, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await adminAPI.getStats();
      return res.data;
    },
  });

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? '—', icon: Users, color: 'bg-blue-50 text-blue-600', link: '/dashboard/users' },
    { label: 'Total Domains', value: stats?.totalDomains ?? '—', icon: Globe, color: 'bg-purple-50 text-purple-600', link: '/dashboard/domains' },
    { label: 'Total Websites', value: stats?.totalWebsites ?? '—', icon: Layout, color: 'bg-green-50 text-green-600', link: '/dashboard/websites' },
    { label: 'Total Leads', value: stats?.totalLeads ?? '—', icon: Inbox, color: 'bg-orange-50 text-orange-600', link: '/dashboard/leads' },
    { label: 'AI Prompts', value: stats?.totalPrompts ?? '—', icon: FileText, color: 'bg-indigo-50 text-indigo-600', link: '/dashboard/prompts' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Platform overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.link}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? <span className="animate-pulse text-gray-300">···</span> : card.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{card.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock size={16} className="text-gray-400" /> Recent Users
            </h3>
            <Link href="/dashboard/users" className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
            ))}</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {stats?.recentUsers?.map((u: any) => (
                <li key={u.id} className="py-2.5 flex items-center justify-between">
                  <span className="text-sm text-gray-800 truncate max-w-[200px]">{u.email}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    u.role === 'SUPER_ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
                  }`}>{u.role}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Domains */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-gray-400" /> Recent Domains
            </h3>
            <Link href="/dashboard/domains" className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">{[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
            ))}</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {stats?.recentDomains?.map((d: any) => (
                <li key={d.id} className="py-2.5 flex items-center justify-between">
                  <span className="text-sm font-mono text-gray-800">{d.domainName}</span>
                  <span className="text-xs text-gray-500 truncate max-w-[120px]">{d.user?.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

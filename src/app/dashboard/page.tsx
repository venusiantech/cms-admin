'use client';

import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api';
import { Users, Globe, Mail, FileText } from 'lucide-react';

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => adminAPI.getStats(),
  });

  if (isLoading) {
    return <div className="text-center py-12">Loading statistics...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">Platform overview and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={<Users className="w-8 h-8" />}
          color="blue"
        />
        <StatCard
          title="Total Domains"
          value={stats?.totalDomains || 0}
          icon={<Globe className="w-8 h-8" />}
          color="green"
        />
        <StatCard
          title="Total Leads"
          value={stats?.totalLeads || 0}
          icon={<Mail className="w-8 h-8" />}
          color="purple"
        />
        <StatCard
          title="AI Prompts"
          value={stats?.totalPrompts || 0}
          icon={<FileText className="w-8 h-8" />}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/dashboard/users"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="w-6 h-6 text-primary-600 mb-2" />
            <h3 className="font-semibold">Manage Users</h3>
            <p className="text-sm text-gray-600">
              View, edit, and manage user accounts
            </p>
          </a>
          <a
            href="/dashboard/prompts"
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-6 h-6 text-primary-600 mb-2" />
            <h3 className="font-semibold">AI Prompts</h3>
            <p className="text-sm text-gray-600">
              Manage AI prompts for content generation
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  }[color];

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses}`}>{icon}</div>
      </div>
    </div>
  );
}


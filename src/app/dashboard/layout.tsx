'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import {
  LogOut,
  BarChart3,
  Users,
  Layout,
  Globe,
  Inbox,
  HardDrive,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

const navLinks: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/dashboard',          label: 'Overview',  icon: BarChart3  },
  { href: '/dashboard/users',    label: 'Users',     icon: Users      },
  { href: '/dashboard/websites', label: 'Websites',  icon: Layout     },
  { href: '/dashboard/domains',  label: 'Domains',   icon: Globe      },
  { href: '/dashboard/leads',    label: 'Leads',     icon: Inbox      },
];

const storageDropdown = {
  label: 'Storage',
  icon: HardDrive,
  children: [
    { href: '/dashboard/storage/provider', label: 'Provider' },
    { href: '/dashboard/storage', label: 'Websites Storage' },
  ],
};

function StorageNavDropdown({ pathname }: { pathname: string }) {
  const isStorageActive = pathname.startsWith('/dashboard/storage');
  const [open, setOpen] = useState(isStorageActive);

  // Keep dropdown open when on a storage sub-route
  const isOpen = open || isStorageActive;
  const Icon = storageDropdown.icon;

  return (
    <div className="space-y-0.5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          w-full group flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium
          transition-colors duration-100
          ${isStorageActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
          }
        `}
      >
        <span className="flex items-center gap-2.5">
          <Icon
            size={16}
            className={isStorageActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary transition-colors'}
          />
          {storageDropdown.label}
        </span>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`}
        />
      </button>
      {isOpen && (
        <div className="pl-4 ml-2 border-l border-sidebar-border space-y-0.5">
          {storageDropdown.children.map(({ href, label }) => {
            const exact = href === '/dashboard/storage';
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors
                  ${isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
                  }
                `}
              >
                {label}
                {isActive && <ChevronRight size={12} className="text-muted-foreground ml-auto" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout, admin } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated()) return null;

  const handleLogout = () => { logout(); router.push('/login'); };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside className="flex flex-col w-64 flex-shrink-0 bg-sidebar border-r border-sidebar-border">

        {/* Logo */}
        <div className="flex flex-col items-center gap-1 px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <Image
              src="/img/logo.png"
              alt="Fastofy logo"
              width={100}
              height={100}
              className="flex-shrink-0"
            />
            <p className="text-2xl text-foreground" style={{ fontFamily: 'Arial, sans-serif' }}>
              FASTOFY
            </p>
          </div>
          <p className="text-[20px] text-muted-foreground tracking-widest uppercase">Admin</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const exact = href === '/dashboard';
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`
                  group flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium
                  transition-colors duration-100
                  ${isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
                  }
                `}
              >
                <span className="flex items-center gap-2.5">
                  <Icon
                    size={16}
                    className={isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary transition-colors'}
                  />
                  {label}
                </span>
                {isActive && <ChevronRight size={13} className="text-muted-foreground" />}
              </Link>
            );
          })}

          {/* Storage dropdown */}
          <StorageNavDropdown pathname={pathname} />
        </nav>

        {/* Footer – user info + logout */}
        <div className="border-t border-sidebar-border px-4 py-4">
          <div className="flex items-center gap-2.5 mb-2 px-1">
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">
                {admin?.email?.[0]?.toUpperCase() ?? 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{admin?.email}</p>
              <p className="text-[10px] text-primary truncate">Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive-foreground hover:bg-destructive/20 transition-colors"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 flex items-center px-6 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {navLinks.map(({ href, label }) => {
              const exact = href === '/dashboard';
              const isActive = exact ? pathname === href : pathname.startsWith(href);
              if (!isActive) return null;
              return (
                <span key={href} className="text-foreground font-medium">{label}</span>
              );
            })}
            {pathname.startsWith('/dashboard/storage') && (
              <span className="text-foreground font-medium">
                {pathname === '/dashboard/storage/provider' ? 'Storage › Provider' : 'Storage › Websites Storage'}
              </span>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

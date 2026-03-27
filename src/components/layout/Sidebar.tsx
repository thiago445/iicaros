'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, MessageCircle, BookOpen, LogOut, Flame } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/feed', icon: Home, label: 'Feed' },
  { href: '/profile', icon: User, label: 'Perfil' },
  { href: '/chat', icon: MessageCircle, label: 'Chat' },
  { href: '/api-docs', icon: BookOpen, label: 'API Docs' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { profile, logout } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 h-screen sticky top-0 border-r border-zinc-800 px-4 py-6">
      {/* Logo */}
      <Link href="/feed" className="flex items-center gap-3 px-2 mb-8">
        <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
          <Flame size={20} className="text-white" />
        </div>
        <span
          className="text-xl font-bold text-white tracking-tight"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          Icaros
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              )}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-zinc-800 pt-4">
        <div className="flex items-center gap-3 px-2 mb-3">
          <Avatar
            src={profile?.urlProfile}
            name={profile?.nickName || 'Usuário'}
            size="sm"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {profile?.nickName || 'Usuário'}
            </p>
            <p className="text-xs text-zinc-500 truncate">{profile?.city || ''}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
}

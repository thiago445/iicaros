import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
}

export function AppLayout({ children, rightPanel }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      <Sidebar />

      <main className="flex-1 min-w-0 border-r border-zinc-800 pb-20 lg:pb-0">
        {children}
      </main>

      {rightPanel && (
        <aside className="hidden xl:block w-80 px-4 py-6 sticky top-0 h-screen overflow-y-auto">
          {rightPanel}
        </aside>
      )}

      <BottomNav />
    </div>
  );
}

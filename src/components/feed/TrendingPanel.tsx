import React from 'react';
import { TrendingUp, Music } from 'lucide-react';
import { MUSICAL_GENRES_LIST } from '@/types';

export function TrendingPanel() {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar no Icaros..."
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30"
        />
      </div>

      {/* Trending genres */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-orange-400" />
          <h3 className="font-semibold text-sm text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            Gêneros em alta
          </h3>
        </div>
        <div className="space-y-2">
          {MUSICAL_GENRES_LIST.map(({ value, label }, i) => (
            <div
              key={value}
              className="flex items-center justify-between py-1.5 cursor-pointer hover:text-orange-400 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-600 w-4">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-orange-400 transition-colors">
                    #{label.toLowerCase()}
                  </p>
                </div>
              </div>
              <Music size={14} className="text-zinc-600 group-hover:text-orange-400 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Roles */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <h3 className="font-semibold text-sm text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
          Comunidade
        </h3>
        <div className="space-y-2">
          {[
            { label: 'Músicos', count: '1.2k', color: 'text-orange-400' },
            { label: 'Produtores', count: '840', color: 'text-blue-400' },
            { label: 'Amantes', count: '3.5k', color: 'text-green-400' },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">{label}</span>
              <span className={`text-sm font-semibold ${color}`}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

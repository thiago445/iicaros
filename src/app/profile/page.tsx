'use client';
import React from 'react';
import { MapPin, Music, User, LogOut, Edit3 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { ProfileSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { USER_ROLES } from '@/types';

export default function ProfilePage() {
  const { isLoading: authLoading } = useRequireAuth();
  const { profile, logout } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const roleLabel = USER_ROLES.find((r) => r.value === profile?.role)?.label;

  return (
    <AppLayout>
      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-xl border-b border-zinc-800 px-4 py-3"
        style={{ background: 'rgba(10,10,11,0.9)' }}
      >
        <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
          Meu Perfil
        </h1>
      </div>

      {!profile ? (
        <ProfileSkeleton />
      ) : (
        <div className="animate-fade-in">
          {/* Cover */}
          <div className="relative h-40 bg-gradient-to-br from-orange-500/30 via-zinc-800 to-zinc-900">
            {profile.coverPhotoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.coverPhotoUrl}
                alt="capa"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />
          </div>

          {/* Avatar & Actions */}
          <div className="px-4 pb-4 relative">
            <div className="flex items-end justify-between -mt-8 mb-4">
              <div className="border-4 border-zinc-950 rounded-full">
                <Avatar src={profile.urlProfile} name={profile.nickName} size="xl" />
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="secondary" size="sm">
                  <Edit3 size={14} />
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={logout}>
                  <LogOut size={14} />
                  Sair
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-3">
              <div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {profile.nickName}
                </h2>
                {profile.name && (
                  <p className="text-zinc-500 text-sm">@{profile.name.toLowerCase().replace(/\s+/g, '')}</p>
                )}
              </div>

              {profile.bio && (
                <p className="text-zinc-300 text-sm leading-relaxed">{profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-3 text-sm text-zinc-500">
                {profile.city && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-orange-400" />
                    <span>{profile.city}</span>
                  </div>
                )}
                {roleLabel && (
                  <div className="flex items-center gap-1.5">
                    <User size={14} className="text-orange-400" />
                    <span>{roleLabel}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {profile.musicalGenre && profile.musicalGenre.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Music size={14} className="text-orange-400" />
                  {profile.musicalGenre.map((g) => (
                    <Badge key={g} variant="orange">
                      #{g}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex gap-6 pt-2 border-t border-zinc-800">
                {[
                  { label: 'Posts', value: '0' },
                  { label: 'Seguidores', value: '0' },
                  { label: 'Seguindo', value: '0' },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="text-white font-bold text-lg">{value}</p>
                    <p className="text-zinc-500 text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Empty posts state */}
          <div className="border-t border-zinc-800 flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-3">
              <span className="text-xl">🎵</span>
            </div>
            <p className="text-zinc-300 font-medium text-sm">Nenhum post ainda</p>
            <p className="text-zinc-600 text-xs mt-1">Seus posts aparecerão aqui</p>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

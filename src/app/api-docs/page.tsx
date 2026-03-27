'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lock, Globe, BookOpen } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { USER_ROLES, MUSICAL_GENRES_LIST } from '@/types';

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-500/10 text-green-400 border border-green-500/20',
  POST: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  PUT: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  DELETE: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

interface Endpoint {
  method: string;
  path: string;
  title: string;
  description: string;
  auth: boolean;
  request?: string;
  response?: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    method: 'POST',
    path: '/user',
    title: 'Cadastrar usuário',
    description: 'Cria um novo usuário na plataforma.',
    auth: false,
    request: JSON.stringify(
      { name: 'string', cpf: 'string', email: 'string', musicalGenre: ['string'], role: 'string', password: 'string' },
      null, 2
    ),
    response: JSON.stringify({ message: 'Usuário criado com sucesso', userId: 'uuid' }, null, 2),
  },
  {
    method: 'POST',
    path: '/login',
    title: 'Autenticar usuário',
    description: 'Realiza o login e retorna um token JWT.',
    auth: false,
    request: JSON.stringify({ email: 'string', password: 'string' }, null, 2),
    response: JSON.stringify({ accessToken: 'eyJhbGci...', expiresIn: 86400 }, null, 2),
  },
  {
    method: 'POST',
    path: '/create',
    title: 'Criar perfil',
    description: 'Cria o perfil do usuário autenticado. Enviar como multipart/form-data.',
    auth: true,
    request: 'multipart/form-data:\n  profileData (JSON): { "nickName": "string", "bio": "string", "city": "string" }\n  profilePicture (file, obrigatório)\n  coverPhoto (file, opcional)',
    response: JSON.stringify({ message: 'Perfil criado com sucesso' }, null, 2),
  },
  {
    method: 'GET',
    path: '/profile',
    title: 'Obter perfil',
    description: 'Retorna os dados do perfil do usuário autenticado.',
    auth: true,
    response: JSON.stringify(
      { urlProfile: 'https://...', nickName: 'string', coverPhotoUrl: 'https://...', bio: 'string', city: 'string' },
      null, 2
    ),
  },
  {
    method: 'POST',
    path: '/tweet/create',
    title: 'Criar tweet',
    description: 'Publica um novo tweet. Enviar como multipart/form-data.',
    auth: true,
    request: 'multipart/form-data:\n  tweetData (JSON): { "title": "string", "messageContent": "string" }\n  media (file, opcional)',
    response: JSON.stringify({ message: 'Tweet criado com sucesso', tweetId: 'uuid' }, null, 2),
  },
  {
    method: 'GET',
    path: '/tweet/alltweets',
    title: 'Listar tweets',
    description: 'Retorna todos os tweets da plataforma.',
    auth: true,
    response: JSON.stringify(
      [{ title: 'string', messageContent: 'string', mediaUrl: 'string', creationTimesTamp: '2024-01-01T00:00:00Z', Creator: { name: 'string', nickName: 'string', urlProfile: 'string' } }],
      null, 2
    ),
  },
  {
    method: 'POST',
    path: '/api/files/upload/post',
    title: 'Upload de arquivo',
    description: 'Faz upload de um arquivo de mídia.',
    auth: true,
    request: 'multipart/form-data:\n  file (arquivo a ser enviado)',
    response: JSON.stringify({ url: 'https://cdn.icaros.app/media/arquivo.jpg' }, null, 2),
  },
];

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 hover:bg-zinc-800/50 transition-colors text-left"
      >
        <span className={cn('px-2 py-0.5 rounded-md text-xs font-bold font-mono', METHOD_COLORS[endpoint.method])}>
          {endpoint.method}
        </span>
        <code className="text-orange-300 text-sm font-mono flex-1">{endpoint.path}</code>
        <div className="flex items-center gap-2">
          {endpoint.auth ? (
            <Badge variant="orange"><Lock size={10} className="mr-1" />JWT</Badge>
          ) : (
            <Badge variant="green"><Globe size={10} className="mr-1" />Público</Badge>
          )}
          {open ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-zinc-800 p-4 space-y-4 bg-zinc-900/50">
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Descrição</h4>
            <p className="text-sm text-zinc-300">{endpoint.description}</p>
          </div>
          {endpoint.request && (
            <div>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Request Body</h4>
              <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 overflow-x-auto">
                {endpoint.request}
              </pre>
            </div>
          )}
          {endpoint.response && (
            <div>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Response</h4>
              <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-green-400 overflow-x-auto">
                {endpoint.response}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type TabType = 'endpoints' | 'roles' | 'genres';

export default function ApiDocsPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const [tab, setTab] = useState<TabType>('endpoints');

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AppLayout>
      {/* Sticky header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-xl border-b border-zinc-800"
        style={{ background: 'rgba(10,10,11,0.9)' }}
      >
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={18} className="text-orange-400" />
            <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              Icaros API
            </h1>
          </div>
          <p className="text-zinc-500 text-sm">Documentação Completa</p>
          <p className="text-xs text-zinc-600 mt-1 font-mono">https://icaros-app-java.azurewebsites.net</p>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-zinc-800">
          {(['endpoints', 'roles', 'genres'] as TabType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex-1 py-3 text-sm font-medium transition-colors capitalize border-b-2',
                tab === t
                  ? 'text-orange-400 border-orange-500'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
              )}
            >
              {t === 'endpoints' ? 'Endpoints' : t === 'roles' ? 'Roles' : 'Gêneros'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {tab === 'endpoints' && (
          <>
            <p className="text-xs text-zinc-500 mb-4">
              {ENDPOINTS.length} endpoints disponíveis · Clique para expandir
            </p>
            {ENDPOINTS.map((ep) => (
              <EndpointCard key={`${ep.method}-${ep.path}`} endpoint={ep} />
            ))}
          </>
        )}

        {tab === 'roles' && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500 mb-4">Papéis disponíveis para cadastro de usuários</p>
            {USER_ROLES.map(({ value, label }) => (
              <div key={value} className="border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <span className="text-lg">{value === 'musician' ? '🎵' : value === 'producer' ? '🎚️' : '❤️'}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{label}</p>
                  <code className="text-orange-400 text-xs font-mono">{value}</code>
                </div>
                <Badge variant="orange" className="ml-auto">role</Badge>
              </div>
            ))}
          </div>
        )}

        {tab === 'genres' && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500 mb-4">Gêneros musicais suportados pela plataforma</p>
            {MUSICAL_GENRES_LIST.map(({ value, label }) => (
              <div key={value} className="border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <span className="text-lg">🎶</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{label}</p>
                  <code className="text-zinc-400 text-xs font-mono">{value}</code>
                </div>
                <Badge variant="default" className="ml-auto">genre</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

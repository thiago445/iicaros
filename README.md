# 🔥 Icaros — Rede Social Musical

Aplicação front-end completa integrada à API Icaros, construída com **Next.js 14 (App Router)**, **React**, **TypeScript** e **TailwindCSS**.

---

## 🚀 Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 📁 Estrutura do projeto

```
src/
├── app/                     # Páginas (App Router)
│   ├── login/               # Tela de login
│   ├── register/            # Tela de cadastro
│   ├── complete-profile/    # Completar perfil após login
│   ├── feed/                # Timeline principal
│   ├── profile/             # Perfil do usuário
│   ├── chat/                # Chat (mock + estrutura pronta)
│   ├── api-docs/            # Documentação da API
│   ├── layout.tsx           # Root layout com AuthProvider
│   ├── page.tsx             # Redirect automático
│   └── globals.css          # Estilos globais
│
├── components/
│   ├── ui/                  # Button, Input, Avatar, Badge, Skeleton, Modal
│   ├── layout/              # Sidebar, BottomNav, AppLayout
│   └── feed/                # TweetCard, CreateTweetForm, TrendingPanel
│
├── context/
│   └── AuthContext.tsx      # Estado global de autenticação
│
├── hooks/
│   └── useRequireAuth.ts    # Hook de proteção de rotas
│
├── services/
│   └── api.ts               # Axios + interceptors + services
│
├── types/
│   └── index.ts             # Tipos TypeScript
│
├── lib/
│   └── utils.ts             # Utilitários (cn, formatDate, etc.)
│
└── middleware.ts            # Proteção de rotas no servidor
```

---

## 🔐 Fluxo de Autenticação

1. Usuário faz login → token JWT salvo em **cookie** + **localStorage**
2. `middleware.ts` protege rotas privadas no servidor
3. `AuthContext` valida estado no cliente
4. Se perfil não existe → redireciona para `/complete-profile`
5. Se perfil existe → redireciona para `/feed`
6. Logout limpa token e redireciona para `/login`

---

## 🌐 API Base

```
https://icaros-app-java.azurewebsites.net
```

---

## 📄 Páginas

| Rota               | Descrição                          | Auth |
|--------------------|-------------------------------------|------|
| `/login`           | Tela de login                       | ❌   |
| `/register`        | Cadastro de conta                   | ❌   |
| `/complete-profile`| Criar perfil após primeiro login    | ✅   |
| `/feed`            | Timeline com posts                  | ✅   |
| `/profile`         | Perfil do usuário logado            | ✅   |
| `/chat`            | Mensagens (mock + estrutura pronta) | ✅   |
| `/api-docs`        | Documentação da API                 | ✅   |

---

## 🎨 Design

- **Tema:** Dark com laranja como cor principal (`#f97316`)
- **Fontes:** Syne (display) + DM Sans (corpo)
- **Layout:** Sidebar no desktop, Bottom Navigation no mobile
- **Componentes:** Skeleton loading, Toasts, Preview de imagens, Badges

---

## 🧪 Tecnologias

- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **TailwindCSS**
- **Axios** (com interceptors JWT)
- **React Hook Form** + **Zod** (validação)
- **react-hot-toast** (notificações)
- **js-cookie** (persistência de token)
- **lucide-react** (ícones)

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  name: string;
  cpf: string;
  email: string;
  musicalGenre: string[];
  role: string;
  password: string;
}

// Profile
export interface ProfileData {
  nickName: string;
  bio: string;
  city: string;
}

export interface Profile {
  urlProfile: string;
  nickName: string;
  coverPhotoUrl: string;
  bio: string;
  city: string;
  name?: string;
  email?: string;
  role?: string;
  musicalGenre?: string[];
}

// Tweet
export interface TweetCreator {
  name: string;
  nickName?: string;
  urlProfile?: string;
  role?: string;
}

export interface Tweet {
  id?: string;
  title: string;
  messageContent: string;
  mediaUrl?: string;
  creationTimesTamp: string;
  Creator: TweetCreator;
}

export interface CreateTweetData {
  title: string;
  messageContent: string;
}

// Chat (mock types)
export interface ChatConversation {
  id: string;
  user: {
    name: string;
    avatar?: string;
    online: boolean;
  };
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  isOwn: boolean;
}

// Roles & Genres
export type UserRole = 'musician' | 'producer' | 'lover';

export const MUSICAL_GENRES = [
  'samba',
  'pagode',
  'forro',
  'sertanejo',
  'funk',
] as const;

export type MusicalGenre = typeof MUSICAL_GENRES[number];

export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 'musician', label: 'Músico' },
  { value: 'producer', label: 'Produtor' },
  { value: 'lover', label: 'Amante da Música' },
];

export const MUSICAL_GENRES_LIST: { value: MusicalGenre; label: string }[] = [
  { value: 'samba', label: 'Samba' },
  { value: 'pagode', label: 'Pagode' },
  { value: 'forro', label: 'Forró' },
  { value: 'sertanejo', label: 'Sertanejo' },
  { value: 'funk', label: 'Funk' },
];

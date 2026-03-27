import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'https://icaros-app-java.azurewebsites.net';

const TOKEN_KEY = 'icaros_token';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string, expiresIn?: number): void => {
  if (typeof window === 'undefined') return;
  const expiresInDays = expiresIn ? expiresIn / 86400 : 7;
  Cookies.set(TOKEN_KEY, token, { expires: expiresInDays, secure: false, sameSite: 'lax' });
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  Cookies.remove(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
  });

  instance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        removeToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const api = createApiInstance();

// Auth
export const authService = {
  login: (email: string, password: string) =>
    api.post('/login', { email, password }),

  register: (data: {
    name: string;
    cpf: string;
    email: string;
    musicalGenre: string[];
    role: string;
    password: string;
  }) => api.post('/user', data),
};

// Profile
export const profileService = {
  getProfile: () => api.get('/profile'),

  createProfile: (
    profileData: { nickName: string; bio: string; city: string },
    profilePicture: File,
    coverPhoto?: File
  ) => {
    const formData = new FormData();

    formData.append(
      'profileData',
      new Blob([JSON.stringify(profileData)], { type: 'application/json' })
    );

    formData.append('profilePicture', profilePicture);

    if (coverPhoto) {
      formData.append('coverPhoto', coverPhoto);
    }

    return api.post('/create', formData); // ❌ sem headers
  },
};

// Tweets
export const tweetService = {
  getAllTweets: () => api.get('/tweet/alltweets'),

  createTweet: (
    tweetData: { title: string; messageContent: string },
    media?: File
  ) => {
    const formData = new FormData();

    // ✅ JSON como Blob (ESSENCIAL)
    formData.append(
      'tweetData',
      new Blob([JSON.stringify(tweetData)], { type: 'application/json' })
    );

    // ✅ arquivo
    if (media) {
      formData.append('media', media);
    }

    // ❌ NÃO colocar headers
    return api.post('/tweet/create', formData);
  },
};

// Files
export const fileService = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/files/upload/post', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

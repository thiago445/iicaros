'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, MapPin, FileText, User, Flame, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { profileService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  nickName: z.string().min(2, 'Mínimo 2 caracteres').max(30, 'Máximo 30 caracteres'),
  bio: z.string().max(160, 'Máximo 160 caracteres').optional(),
  city: z.string().min(2, 'Informe sua cidade'),
});

type FormData = z.infer<typeof schema>;

export default function CompleteProfilePage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const profileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'profile' | 'cover'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'profile') {
        setProfilePic(file);
        setProfilePreview(reader.result as string);
      } else {
        setCoverPhoto(file);
        setCoverPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: FormData) => {
    if (!profilePic) {
      toast.error('Foto de perfil é obrigatória');
      return;
    }
    setIsLoading(true);
    try {
      await profileService.createProfile(
        { nickName: data.nickName, bio: data.bio || '', city: data.city },
        profilePic,
        coverPhoto || undefined
      );
      await refreshProfile();
      toast.success('Perfil criado com sucesso!');
      router.push('/feed');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Erro ao criar perfil';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 py-8"
      style={{ background: 'var(--bg)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(249,115,22,0.10) 0%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-sm relative">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-xl shadow-orange-500/30 mb-3">
            <Flame size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            Complete seu perfil
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Deixe outros te descobrirem</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          {/* Cover preview */}
          <div
            className="relative h-28 rounded-xl bg-zinc-800 border border-zinc-700 mb-12 overflow-hidden cursor-pointer group"
            onClick={() => coverRef.current?.click()}
          >
            {coverPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverPreview} alt="capa" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center gap-2 text-zinc-500 group-hover:text-zinc-400 transition-colors">
                <Upload size={18} />
                <span className="text-sm">Foto de capa (opcional)</span>
              </div>
            )}
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'cover')}
              className="hidden"
            />

            {/* Profile pic */}
            <div
              className="absolute -bottom-8 left-4 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); profileRef.current?.click(); }}
            >
              <div className="w-16 h-16 rounded-full border-4 border-zinc-900 bg-zinc-800 overflow-hidden flex items-center justify-center relative group">
                {profilePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profilePreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={22} className="text-zinc-500" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                  <Camera size={16} className="text-white" />
                </div>
              </div>
              <input
                ref={profileRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'profile')}
                className="hidden"
              />
            </div>
          </div>

          <p className="text-xs text-zinc-500 mb-4">* Foto de perfil obrigatória</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register('nickName')}
              label="Nome de usuário"
              placeholder="@seunome"
              error={errors.nickName?.message}
              leftIcon={<User size={16} />}
            />

            <Textarea
              {...register('bio')}
              label="Bio"
              placeholder="Fale um pouco sobre você..."
              rows={3}
              error={errors.bio?.message}
            />

            <Input
              {...register('city')}
              label="Cidade"
              placeholder="São Paulo, SP"
              error={errors.city?.message}
              leftIcon={<MapPin size={16} />}
            />

            <Button type="submit" fullWidth size="lg" isLoading={isLoading} className="mt-2">
              <FileText size={16} />
              Criar perfil
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

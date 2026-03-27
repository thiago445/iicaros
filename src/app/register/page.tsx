'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, CreditCard, Eye, EyeOff, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@/services/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { USER_ROLES, MUSICAL_GENRES_LIST } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  cpf: z.string().min(11, 'CPF inválido').max(14, 'CPF inválido'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  role: z.string().min(1, 'Selecione uma função'),
  musicalGenre: z.array(z.string()).min(1, 'Selecione ao menos um gênero'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { musicalGenre: [] },
  });

  const selectedGenres = watch('musicalGenre') || [];

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setValue('musicalGenre', selectedGenres.filter((g) => g !== genre), { shouldValidate: true });
    } else {
      setValue('musicalGenre', [...selectedGenres, genre], { shouldValidate: true });
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      toast.success('Conta criada! Faça login para continuar.');
      router.push('/login');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Erro ao criar conta. Verifique os dados.';
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
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-xl shadow-orange-500/30 mb-3">
            <Flame size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            Criar conta
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Junte-se à comunidade Icaros</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register('name')}
              label="Nome completo"
              placeholder="Seu nome"
              error={errors.name?.message}
              leftIcon={<User size={16} />}
            />

            <Input
              {...register('cpf')}
              label="CPF"
              placeholder="000.000.000-00"
              error={errors.cpf?.message}
              leftIcon={<CreditCard size={16} />}
            />

            <Input
              {...register('email')}
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              leftIcon={<Mail size={16} />}
            />

            <Input
              {...register('password')}
              label="Senha"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.password?.message}
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-zinc-500 hover:text-zinc-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Função</label>
              <div className="grid grid-cols-3 gap-2">
                {USER_ROLES.map(({ value, label }) => {
                  const selected = watch('role') === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue('role', value, { shouldValidate: true })}
                      className={`py-2 px-1 rounded-xl text-xs font-medium border transition-all ${
                        selected
                          ? 'bg-orange-500/10 border-orange-500/40 text-orange-400'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {errors.role && <p className="mt-1 text-xs text-red-400">{errors.role.message}</p>}
            </div>

            {/* Genres */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Gêneros musicais</label>
              <div className="flex flex-wrap gap-2">
                {MUSICAL_GENRES_LIST.map(({ value, label }) => {
                  const selected = selectedGenres.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleGenre(value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selected
                          ? 'bg-orange-500/10 border-orange-500/40 text-orange-400'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {errors.musicalGenre && (
                <p className="mt-1 text-xs text-red-400">{errors.musicalGenre.message}</p>
              )}
            </div>

            <Button type="submit" fullWidth size="lg" isLoading={isLoading} className="mt-2">
              Criar conta
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-4">
          Já tem conta?{' '}
          <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

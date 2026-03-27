'use client';
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Image, X, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { tweetService } from '@/services/api';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
  title: z.string().max(100, 'Título muito longo').optional(),
  messageContent: z.string().min(1, 'Escreva algo').max(500, 'Máximo 500 caracteres'),
});

type FormData = z.infer<typeof schema>;

interface CreateTweetFormProps {
  onTweetCreated?: () => void;
}

export function CreateTweetForm({ onTweetCreated }: CreateTweetFormProps) {
  const { profile } = useAuth();
  const [media, setMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const content = watch('messageContent') || '';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Somente imagens são permitidas');
      return;
    }
    setMedia(file);
    const reader = new FileReader();
    reader.onload = () => setMediaPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await tweetService.createTweet(
        { title: data.title || '', messageContent: data.messageContent },
        media || undefined
      );
      toast.success('Post publicado!');
      reset();
      removeMedia();
      onTweetCreated?.();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erro ao publicar';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border-b border-zinc-800">
      <div className="flex gap-3">
        <Avatar src={profile?.urlProfile} name={profile?.nickName} size="md" />
        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register('title')}
              placeholder="Título (opcional)"
              className="w-full bg-transparent text-sm text-zinc-400 placeholder:text-zinc-600 mb-1 outline-none"
            />
            <textarea
              {...register('messageContent')}
              placeholder="O que está acontecendo na música?"
              rows={3}
              className="w-full bg-transparent text-base text-zinc-100 placeholder:text-zinc-600 resize-none outline-none"
            />
            {errors.messageContent && (
              <p className="text-xs text-red-400 mt-1">{errors.messageContent.message}</p>
            )}

            {/* Image preview */}
            {mediaPreview && (
              <div className="relative mt-2 rounded-xl overflow-hidden border border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mediaPreview} alt="preview" className="w-full max-h-48 object-cover" />
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="p-2 rounded-full text-orange-400 hover:bg-orange-500/10 transition-colors"
                >
                  <Image size={18} />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className={`text-xs ${content.length > 450 ? 'text-red-400' : 'text-zinc-600'}`}>
                  {content.length}/500
                </span>
              </div>
              <Button
                type="submit"
                size="sm"
                isLoading={isSubmitting}
                disabled={!content.trim()}
              >
                <Send size={15} />
                Publicar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

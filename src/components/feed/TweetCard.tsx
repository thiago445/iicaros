import React from 'react';
import { Tweet } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';
import { Heart, MessageCircle, Share2, Repeat2 } from 'lucide-react';

interface TweetCardProps {
  tweet: Tweet;
}

export function TweetCard({ tweet }: TweetCardProps) {
  return (
    <article className="tweet-card border-b border-zinc-800 p-4 flex gap-3 cursor-pointer">
      <Avatar
        src={tweet.Creator?.urlProfile}
        name={tweet.Creator?.name || tweet.Creator?.nickName}
        size="md"
      />
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-white text-sm">
            {tweet.Creator?.nickName || tweet.Creator?.name || 'Usuário'}
          </span>
          {tweet.Creator?.name && tweet.Creator?.nickName && (
            <span className="text-zinc-500 text-sm">@{tweet.Creator.name.toLowerCase().replace(/\s+/g, '')}</span>
          )}
          <span className="text-zinc-600 text-xs">·</span>
          <span className="text-zinc-500 text-xs">{formatDate(tweet.creationTimesTamp)}</span>
        </div>

        {/* Title */}
        {tweet.title && (
          <p className="text-sm font-semibold text-zinc-100 mt-0.5">{tweet.title}</p>
        )}

        {/* Content */}
        <p className="text-sm text-zinc-300 mt-1 leading-relaxed whitespace-pre-wrap break-words">
          {tweet.messageContent}
        </p>

        {/* Media */}
        {tweet.mediaUrl && (
          <div className="mt-3 rounded-xl overflow-hidden border border-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tweet.mediaUrl}
              alt="mídia do post"
              className="w-full max-h-80 object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-6 mt-3">
          <button className="flex items-center gap-1.5 text-zinc-500 hover:text-orange-400 transition-colors group">
            <span className="p-1.5 rounded-full group-hover:bg-orange-500/10 transition-colors">
              <Heart size={16} />
            </span>
            <span className="text-xs">0</span>
          </button>
          <button className="flex items-center gap-1.5 text-zinc-500 hover:text-blue-400 transition-colors group">
            <span className="p-1.5 rounded-full group-hover:bg-blue-500/10 transition-colors">
              <MessageCircle size={16} />
            </span>
            <span className="text-xs">0</span>
          </button>
          <button className="flex items-center gap-1.5 text-zinc-500 hover:text-green-400 transition-colors group">
            <span className="p-1.5 rounded-full group-hover:bg-green-500/10 transition-colors">
              <Repeat2 size={16} />
            </span>
            <span className="text-xs">0</span>
          </button>
          <button className="flex items-center gap-1.5 text-zinc-500 hover:text-orange-400 transition-colors group ml-auto">
            <span className="p-1.5 rounded-full group-hover:bg-orange-500/10 transition-colors">
              <Share2 size={16} />
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

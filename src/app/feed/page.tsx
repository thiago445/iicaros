'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { tweetService } from '@/services/api';
import { Tweet } from '@/types';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { TweetCard } from '@/components/feed/TweetCard';
import { CreateTweetForm } from '@/components/feed/CreateTweetForm';
import { TweetSkeleton } from '@/components/ui/Skeleton';
import { TrendingPanel } from '@/components/feed/TrendingPanel';

export default function FeedPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTweets = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      const res = await tweetService.getAllTweets();
      const data = Array.isArray(res.data) ? res.data : [];
      setTweets(data.reverse());
    } catch {
      setTweets([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) fetchTweets();
  }, [authLoading, fetchTweets]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AppLayout rightPanel={<TrendingPanel />}>
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl border-b border-zinc-800 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(10,10,11,0.9)' }}
      >
        <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
          Feed
        </h1>
        <button
          onClick={() => fetchTweets(true)}
          disabled={isRefreshing}
          className="p-2 rounded-full text-zinc-500 hover:text-orange-400 hover:bg-zinc-800 transition-all"
        >
          <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      <CreateTweetForm onTweetCreated={() => fetchTweets(true)} />

      {/* Tweets */}
      <div>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <TweetSkeleton key={i} />)
        ) : tweets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
              <span className="text-2xl">🎵</span>
            </div>
            <p className="text-zinc-300 font-medium">Nenhum post ainda</p>
            <p className="text-zinc-600 text-sm mt-1">Seja o primeiro a compartilhar algo!</p>
          </div>
        ) : (
          tweets.map((tweet, i) => <TweetCard key={tweet.id || i} tweet={tweet} />)
        )}
      </div>
    </AppLayout>
  );
}

'use client'

import Link from 'next/link'
import { Heart, MessageCircle, Pin } from 'lucide-react'
import type { PostWithAuthor } from '@/types/database'
import { timeAgo } from '@/lib/utils/time'

interface PostCardProps {
  post: PostWithAuthor
  onLike: (postId: string) => void
}

const categoryColors = {
  general: 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300',
  pregunta: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  recurso: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  logro: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  presentacion: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
}

const categoryLabels = {
  general: 'General',
  pregunta: 'Pregunta',
  recurso: 'Recurso',
  logro: 'Logro',
  presentacion: 'Presentación',
}

export function PostCard({ post, onLike }: PostCardProps) {
  function handleLike(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    onLike(post.id)
  }

  return (
    <Link
      href={`/comunidad/${post.id}`}
      className="block bg-white dark:bg-slate-800 rounded-xl border border-border-light dark:border-slate-700 shadow-card hover:shadow-card-hover transition-all duration-200 p-6 group"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {post.author.avatar_url ? (
            <img
              src={post.author.avatar_url}
              alt={post.author.full_name || 'Usuario'}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {(post.author.full_name || 'U')[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Author Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-foreground dark:text-slate-100 truncate">
              {post.author.full_name || 'Usuario'}
            </p>
            <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-full">
              Nivel {post.author.level}
            </span>
            {post.is_pinned && (
              <Pin className="w-4 h-4 text-primary-500 fill-primary-500" />
            )}
          </div>
          <p className="text-sm text-foreground-secondary dark:text-slate-400">
            {timeAgo(post.created_at)}
          </p>
        </div>

        {/* Category Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
            categoryColors[post.category]
          }`}
        >
          {categoryLabels[post.category]}
        </span>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground dark:text-slate-100 mb-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
          {post.title}
        </h3>
        <p className="text-foreground-secondary dark:text-slate-400 line-clamp-2">
          {post.content}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 text-foreground-secondary dark:text-slate-400">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 hover:text-error-500 transition-colors group/like"
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              post.has_liked
                ? 'fill-error-500 text-error-500'
                : 'group-hover/like:scale-110'
            }`}
          />
          <span className="text-sm font-medium">{post.likes_count}</span>
        </button>

        {/* Comments */}
        <div className="flex items-center gap-1.5 hover:text-primary-500 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{post.comments_count}</span>
        </div>
      </div>
    </Link>
  )
}

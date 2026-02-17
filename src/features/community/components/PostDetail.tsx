'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, MessageCircle, Send, Reply } from 'lucide-react'
import { getPostById, getComments, toggleLike, createComment } from '@/actions/community'
import type { PostWithAuthor, CommentWithAuthor } from '@/types/database'
import { timeAgo } from '@/lib/utils/time'

interface PostDetailProps {
  postId: string
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

export function PostDetail({ postId }: PostDetailProps) {
  const [post, setPost] = useState<PostWithAuthor | null>(null)
  const [comments, setComments] = useState<CommentWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  useEffect(() => {
    loadPostAndComments()
  }, [postId])

  async function loadPostAndComments() {
    setLoading(true)
    setError(null)

    const [postResult, commentsResult] = await Promise.all([
      getPostById(postId),
      getComments(postId)
    ])

    if (postResult.error) {
      setError(postResult.error)
      setLoading(false)
      return
    }

    if (commentsResult.error) {
      setError(commentsResult.error)
      setLoading(false)
      return
    }

    setPost(postResult.data)
    setComments(commentsResult.data || [])
    setLoading(false)
  }

  async function handleLike() {
    if (!post) return

    // Optimistic update
    const previousState = { ...post }
    setPost({
      ...post,
      has_liked: !post.has_liked,
      likes_count: post.has_liked ? post.likes_count - 1 : post.likes_count + 1,
    })

    const result = await toggleLike(postId)

    if (result.error) {
      // Revert on error
      setPost(previousState)
    }
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim() || submittingComment) return

    setSubmittingComment(true)
    const result = await createComment(postId, newComment.trim())

    if (result.error) {
      alert(result.error)
    } else {
      setNewComment('')
      await loadPostAndComments()
    }

    setSubmittingComment(false)
  }

  async function handleSubmitReply(e: React.FormEvent, parentId: string) {
    e.preventDefault()
    if (!replyContent.trim() || submittingComment) return

    setSubmittingComment(true)
    const result = await createComment(postId, replyContent.trim(), parentId)

    if (result.error) {
      alert(result.error)
    } else {
      setReplyContent('')
      setReplyingTo(null)
      await loadPostAndComments()
    }

    setSubmittingComment(false)
  }

  function toggleReply(commentId: string) {
    if (replyingTo === commentId) {
      setReplyingTo(null)
      setReplyContent('')
    } else {
      setReplyingTo(commentId)
      setReplyContent('')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-border-light dark:border-slate-700 shadow-card p-6 animate-pulse">
            <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700"></div>
              <div className="flex-1">
                <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-3 w-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-slate-700 rounded mb-3"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-border-light dark:border-slate-700 shadow-card p-6 text-center">
            <p className="text-foreground-secondary dark:text-slate-400 mb-4">
              {error || 'Post no encontrado'}
            </p>
            <Link
              href="/comunidad"
              className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a la comunidad
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Button */}
        <Link
          href="/comunidad"
          className="inline-flex items-center gap-2 text-foreground-secondary dark:text-slate-400 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la comunidad
        </Link>

        {/* Post Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-border-light dark:border-slate-700 shadow-card p-6">
          {/* Category Badge */}
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
              categoryColors[post.category]
            }`}
          >
            {categoryLabels[post.category]}
          </span>

          {/* Author Info */}
          <div className="flex items-start gap-3 mb-4">
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

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-foreground dark:text-slate-100">
                  {post.author.full_name || 'Usuario'}
                </p>
                <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-full">
                  Nivel {post.author.level}
                </span>
              </div>
              <p className="text-sm text-foreground-secondary dark:text-slate-400">
                {timeAgo(post.created_at)}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground dark:text-slate-100 mb-3">
              {post.title}
            </h1>
            <p className="text-foreground dark:text-slate-100 whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-border-light dark:border-slate-700">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 hover:text-error-500 transition-colors group/like"
            >
              <Heart
                className={`w-5 h-5 transition-all ${
                  post.has_liked
                    ? 'fill-error-500 text-error-500'
                    : 'text-foreground-secondary dark:text-slate-400 group-hover/like:scale-110'
                }`}
              />
              <span className="text-sm font-medium text-foreground-secondary dark:text-slate-400">
                {post.likes_count}
              </span>
            </button>

            <div className="flex items-center gap-1.5 text-foreground-secondary dark:text-slate-400">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.comments_count}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-border-light dark:border-slate-700 shadow-card p-6">
          <h2 className="text-lg font-semibold text-foreground dark:text-slate-100 mb-4">
            Comentarios ({comments.length})
          </h2>

          {/* New Comment Input */}
          <form onSubmit={handleSubmitComment} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-slate-900 border border-border-light dark:border-slate-700 rounded-xl text-foreground dark:text-slate-100 placeholder-foreground-secondary dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!newComment.trim() || submittingComment}
                className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {submittingComment ? 'Enviando...' : 'Comentar'}
              </button>
            </div>
          </form>

          {/* Comments List */}
          {comments.length === 0 ? (
            <p className="text-center text-foreground-secondary dark:text-slate-400 py-8">
              No hay comentarios todavía. ¡Sé el primero en comentar!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  {/* Top-level comment */}
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      {comment.author.avatar_url ? (
                        <img
                          src={comment.author.avatar_url}
                          alt={comment.author.full_name || 'Usuario'}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            {(comment.author.full_name || 'U')[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-foreground dark:text-slate-100">
                          {comment.author.full_name || 'Usuario'}
                        </p>
                        <span className="px-1.5 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-full">
                          Nivel {comment.author.level}
                        </span>
                        <span className="text-xs text-foreground-secondary dark:text-slate-400">
                          {timeAgo(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-foreground dark:text-slate-100 text-sm mb-2 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                      <button
                        onClick={() => toggleReply(comment.id)}
                        className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 transition-colors"
                      >
                        <Reply className="w-3 h-3" />
                        Responder
                      </button>

                      {/* Reply Input */}
                      {replyingTo === comment.id && (
                        <form
                          onSubmit={(e) => handleSubmitReply(e, comment.id)}
                          className="mt-3"
                        >
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Escribe una respuesta..."
                            className="w-full px-3 py-2 bg-[#F8FAFC] dark:bg-slate-900 border border-border-light dark:border-slate-700 rounded-lg text-sm text-foreground dark:text-slate-100 placeholder-foreground-secondary dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                            rows={2}
                            autoFocus
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              type="submit"
                              disabled={!replyContent.trim() || submittingComment}
                              className="px-3 py-1.5 bg-primary-500 text-white text-xs rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submittingComment ? 'Enviando...' : 'Responder'}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleReply(comment.id)}
                              className="px-3 py-1.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-8 pl-4 border-l-2 border-primary-200 dark:border-primary-900/30 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3">
                          <div className="relative flex-shrink-0">
                            {reply.author.avatar_url ? (
                              <img
                                src={reply.author.avatar_url}
                                alt={reply.author.full_name || 'Usuario'}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                                <span className="text-white font-semibold text-xs">
                                  {(reply.author.full_name || 'U')[0].toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-sm text-foreground dark:text-slate-100">
                                {reply.author.full_name || 'Usuario'}
                              </p>
                              <span className="px-1.5 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium rounded-full">
                                Nivel {reply.author.level}
                              </span>
                              <span className="text-xs text-foreground-secondary dark:text-slate-400">
                                {timeAgo(reply.created_at)}
                              </span>
                            </div>
                            <p className="text-foreground dark:text-slate-100 text-sm whitespace-pre-wrap">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

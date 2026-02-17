'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { getPosts, toggleLike } from '@/actions/community'
import type { PostCategory, PostWithAuthor } from '@/types/database'
import { PostCard } from './PostCard'
import { CreatePostModal } from './CreatePostModal'

const categories = [
  { value: null, label: 'Todos' },
  { value: 'general' as PostCategory, label: 'General' },
  { value: 'pregunta' as PostCategory, label: 'Preguntas' },
  { value: 'recurso' as PostCategory, label: 'Recursos' },
  { value: 'logro' as PostCategory, label: 'Logros' },
  { value: 'presentacion' as PostCategory, label: 'Presentaciones' },
]

export function CommunityFeed() {
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [activeCategory, setActiveCategory] = useState<PostCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [activeCategory])

  async function loadPosts() {
    setLoading(true)
    const result = await getPosts(activeCategory || undefined)
    if (result.data) {
      setPosts(result.data)
    }
    setLoading(false)
  }

  async function handleLike(postId: string) {
    // Optimistic update
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const wasLiked = post.has_liked
          return {
            ...post,
            has_liked: !wasLiked,
            likes_count: wasLiked ? post.likes_count - 1 : post.likes_count + 1,
          }
        }
        return post
      })
    )

    // Server update
    const result = await toggleLike(postId)
    if (result.error) {
      // Revert on error
      loadPosts()
    }
  }

  function handlePostCreated() {
    setShowCreateModal(false)
    loadPosts()
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-display-sm text-[#0F172A] dark:text-slate-100 font-heading">
              Comunidad
            </h1>
            <p className="text-foreground-secondary dark:text-slate-400 mt-1">
              Conecta, comparte y aprende junto a otros estudiantes
            </p>
          </div>
          {/* Desktop create button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Crear Post
          </button>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {categories.map(cat => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.value)}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm transition-all
                  ${
                    activeCategory === cat.value
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-foreground-secondary dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 border border-border-light dark:border-slate-700'
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-xl border border-border-light dark:border-slate-700 shadow-card p-6 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-border-light dark:border-slate-700 shadow-card p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/20 mb-4">
              <Plus className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground dark:text-slate-100 mb-2">
              No hay posts todavía
            </h3>
            <p className="text-foreground-secondary dark:text-slate-400 mb-6">
              Sé el primero en compartir algo con la comunidad
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Crear Post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard key={post.id} post={post} onLike={handleLike} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="sm:hidden fixed bottom-20 right-4 w-14 h-14 bg-primary-500 text-white rounded-full shadow-elevated hover:bg-primary-600 transition-all flex items-center justify-center z-40 active:scale-95"
        aria-label="Crear post"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handlePostCreated}
      />
    </div>
  )
}

'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import { updateLesson } from '@/actions/lessons'
import { uploadLessonImage } from '@/actions/upload-image'
import { RichLessonContent } from '@/features/courses/components/lesson/RichLessonContent'
import { Button } from '@/components/ui'
import { Modal } from '@/components/ui/modal'
import type { Lesson } from '@/types/database'
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ImageIcon,
  Youtube as YoutubeIcon,
  BookOpen,
  Rocket,
  Eye,
  EyeOff,
  Save,
  Undo2,
  Redo2,
  Loader2,
  ArrowLeft,
  Check,
  Columns2,
} from 'lucide-react'

interface LessonEditorProps {
  lesson: Lesson
  courseSlug: string
  moduleId: string
  onBack: () => void
}

type ViewMode = 'edit' | 'preview' | 'split'

export function LessonEditor({ lesson, courseSlug, moduleId, onBack }: LessonEditorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [showYoutubeModal, setShowYoutubeModal] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [lastSavedContent, setLastSavedContent] = useState(lesson.content || '')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const handleSaveRef = useRef<() => void>(() => {})

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'lesson-editor-image',
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'video-embed',
        },
        width: 0,
        height: 0,
      }),
      Placeholder.configure({
        placeholder: 'Empieza a escribir el contenido de la leccion...',
      }),
    ],
    content: lesson.content || '',
    editorProps: {
      attributes: {
        class: 'lesson-editor-content focus:outline-none min-h-[400px] p-6',
      },
    },
    onUpdate: ({ editor: ed }) => {
      // Auto-save with debounce
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }

      autoSaveTimerRef.current = setTimeout(() => {
        const currentHtml = ed.getHTML()
        const normalizedHtml = currentHtml === '<p></p>' ? '' : currentHtml

        // Only auto-save if content has changed
        if (normalizedHtml !== lastSavedContent) {
          handleSaveRef.current()
        }
      }, 2000)
    },
  })

  // ---- Save ----
  const handleSave = useCallback(async () => {
    if (!editor) return

    setIsSaving(true)
    setSaveStatus('saving')

    try {
      const html = editor.getHTML()
      const formData = new FormData()
      formData.append('title', lesson.title)
      formData.append('content', html === '<p></p>' ? '' : html)
      formData.append('video_url', lesson.video_url || '')
      formData.append('duration_minutes', String(lesson.duration_minutes || 0))
      formData.append('module_id', moduleId)

      const result = await updateLesson(lesson.id, formData)

      if (result?.error) {
        setSaveStatus('error')
      } else {
        setLastSavedContent(html === '<p></p>' ? '' : html)
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      }
    } catch {
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }, [editor, lesson, moduleId])

  // Keep ref in sync with latest handleSave
  handleSaveRef.current = handleSave

  // Cleanup auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [])

  // Keyboard shortcut: Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  // ---- Image Upload ----
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('courseSlug', courseSlug)
      formData.append('lessonId', lesson.id)

      const result = await uploadLessonImage(formData)

      if (result.error) {
        alert(result.error)
      } else if (result.url) {
        editor.chain().focus().setImage({ src: result.url, alt: file.name }).run()
      }
    } catch {
      alert('Error al subir la imagen')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [editor, courseSlug, lesson.id])

  // ---- YouTube Embed ----
  const handleInsertYoutube = useCallback(() => {
    if (!editor || !youtubeUrl.trim()) return

    const match = youtubeUrl.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )

    if (!match) {
      alert('URL de YouTube no valida')
      return
    }

    const videoId = match[1]
    const embedHtml = `<div class="video-embed"><iframe src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" title="Video de YouTube"></iframe></div>`
    editor.chain().focus().insertContent(embedHtml).run()

    setYoutubeUrl('')
    setShowYoutubeModal(false)
  }, [editor, youtubeUrl])

  // ---- Practice Block ----
  const handleInsertPracticaBlock = useCallback(() => {
    if (!editor) return
    editor.chain().focus().insertContent(
      `<div class="practica-block"><p><strong>Ejercicio:</strong> Describe el ejercicio aqui...</p><ul><li>Paso 1</li><li>Paso 2</li><li>Paso 3</li></ul></div><p></p>`
    ).run()
  }, [editor])

  // ---- CTA Sinsajo ----
  const handleInsertCtaSinsajo = useCallback(() => {
    if (!editor) return
    editor.chain().focus().insertContent(
      `<div class="cta-sinsajo"><p>Texto del CTA aqui. <a href="#">Enlace de accion</a></p></div><p></p>`
    ).run()
  }, [editor])

  if (!editor) return null

  const currentHtml = editor.getHTML()

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {lesson.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Editor de contenido</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === 'edit'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 text-sm font-medium transition-colors border-x border-gray-200 dark:border-gray-700 ${
                  viewMode === 'split'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Columns2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Preview
              </button>
            </div>

            {/* Mobile: simple toggle */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setViewMode(viewMode === 'preview' ? 'edit' : 'preview')}
              className="md:hidden"
            >
              {viewMode === 'preview' ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {viewMode === 'preview' ? 'Editar' : 'Preview'}
            </Button>

            {/* Auto-save status */}
            {saveStatus !== 'idle' && (
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                {saveStatus === 'saving' && (
                  <span className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Guardando...
                  </span>
                )}
                {saveStatus === 'saved' && (
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <Check className="w-3 h-3" />
                    Guardado
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-red-600 dark:text-red-400">
                    Error
                  </span>
                )}
              </span>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : saveStatus === 'saved' ? (
                <Check className="w-4 h-4 mr-2 text-green-200" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              <span className="hidden sm:inline">{isSaving ? 'Guardando...' : 'Guardar'}</span>
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'preview' ? (
        /* ---- Preview Mode ---- */
        <div className="flex-1 overflow-auto bg-white dark:bg-gray-950 p-6 lg:p-10">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
              Vista previa - Asi se vera la leccion para los estudiantes
            </div>
            <RichLessonContent html={currentHtml} />
          </div>
        </div>
      ) : viewMode === 'split' ? (
        /* ---- Split Mode ---- */
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Editor */}
          <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
              <div className="flex flex-wrap items-center gap-1">
                {/* Text Formatting */}
                <ToolbarGroup>
                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Negrita"
                  >
                    <Bold className="w-4 h-4" />
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Cursiva"
                  >
                    <Italic className="w-4 h-4" />
                  </ToolbarButton>
                </ToolbarGroup>

                <ToolbarDivider />

                {/* Headings */}
                <ToolbarGroup>
                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Titulo H2"
                  >
                    <Heading2 className="w-4 h-4" />
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    title="Subtitulo H3"
                  >
                    <Heading3 className="w-4 h-4" />
                  </ToolbarButton>
                </ToolbarGroup>

                <ToolbarDivider />

                {/* Lists */}
                <ToolbarGroup>
                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Lista con puntos"
                  >
                    <List className="w-4 h-4" />
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Lista numerada"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </ToolbarButton>
                </ToolbarGroup>

                <ToolbarDivider />

                {/* Undo/Redo */}
                <ToolbarGroup>
                  <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Deshacer"
                  >
                    <Undo2 className="w-4 h-4" />
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Rehacer"
                  >
                    <Redo2 className="w-4 h-4" />
                  </ToolbarButton>
                </ToolbarGroup>

                <ToolbarDivider />

                {/* Custom Blocks */}
                <ToolbarGroup>
                  <ToolbarButton
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    title="Insertar imagen"
                    className="text-blue-600 dark:text-blue-400"
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ImageIcon className="w-4 h-4" />
                    )}
                    <span className="ml-1 text-xs hidden sm:inline">Imagen</span>
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => setShowYoutubeModal(true)}
                    title="Insertar video YouTube"
                    className="text-red-600 dark:text-red-400"
                  >
                    <YoutubeIcon className="w-4 h-4" />
                    <span className="ml-1 text-xs hidden sm:inline">YouTube</span>
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={handleInsertPracticaBlock}
                    title="Insertar bloque de practica"
                    className="text-emerald-600 dark:text-emerald-400"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="ml-1 text-xs hidden sm:inline">Practica</span>
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={handleInsertCtaSinsajo}
                    title="Insertar CTA Sinsajo"
                    className="text-violet-600 dark:text-violet-400"
                  >
                    <Rocket className="w-4 h-4" />
                    <span className="ml-1 text-xs hidden sm:inline">CTA</span>
                  </ToolbarButton>
                </ToolbarGroup>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Editor Area */}
            <div className="flex-1 overflow-auto bg-white dark:bg-gray-950">
              <div className="max-w-full px-6">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-full">
              <div className="mb-4 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-700 dark:text-blue-300">
                Vista previa
              </div>
              <RichLessonContent html={currentHtml} />
            </div>
          </div>
        </div>
      ) : (
        /* ---- Edit Mode ---- */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
            <div className="flex flex-wrap items-center gap-1">
              {/* Text Formatting */}
              <ToolbarGroup>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  isActive={editor.isActive('bold')}
                  title="Negrita"
                >
                  <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  isActive={editor.isActive('italic')}
                  title="Cursiva"
                >
                  <Italic className="w-4 h-4" />
                </ToolbarButton>
              </ToolbarGroup>

              <ToolbarDivider />

              {/* Headings */}
              <ToolbarGroup>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  isActive={editor.isActive('heading', { level: 2 })}
                  title="Titulo H2"
                >
                  <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  isActive={editor.isActive('heading', { level: 3 })}
                  title="Subtitulo H3"
                >
                  <Heading3 className="w-4 h-4" />
                </ToolbarButton>
              </ToolbarGroup>

              <ToolbarDivider />

              {/* Lists */}
              <ToolbarGroup>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  isActive={editor.isActive('bulletList')}
                  title="Lista con puntos"
                >
                  <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  isActive={editor.isActive('orderedList')}
                  title="Lista numerada"
                >
                  <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
              </ToolbarGroup>

              <ToolbarDivider />

              {/* Undo/Redo */}
              <ToolbarGroup>
                <ToolbarButton
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                  title="Deshacer"
                >
                  <Undo2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                  title="Rehacer"
                >
                  <Redo2 className="w-4 h-4" />
                </ToolbarButton>
              </ToolbarGroup>

              <ToolbarDivider />

              {/* Custom Blocks */}
              <ToolbarGroup>
                <ToolbarButton
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  title="Insertar imagen"
                  className="text-blue-600 dark:text-blue-400"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                  <span className="ml-1 text-xs hidden sm:inline">Imagen</span>
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => setShowYoutubeModal(true)}
                  title="Insertar video YouTube"
                  className="text-red-600 dark:text-red-400"
                >
                  <YoutubeIcon className="w-4 h-4" />
                  <span className="ml-1 text-xs hidden sm:inline">YouTube</span>
                </ToolbarButton>
                <ToolbarButton
                  onClick={handleInsertPracticaBlock}
                  title="Insertar bloque de practica"
                  className="text-emerald-600 dark:text-emerald-400"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="ml-1 text-xs hidden sm:inline">Practica</span>
                </ToolbarButton>
                <ToolbarButton
                  onClick={handleInsertCtaSinsajo}
                  title="Insertar CTA Sinsajo"
                  className="text-violet-600 dark:text-violet-400"
                >
                  <Rocket className="w-4 h-4" />
                  <span className="ml-1 text-xs hidden sm:inline">CTA</span>
                </ToolbarButton>
              </ToolbarGroup>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Editor Area */}
          <div className="flex-1 overflow-auto bg-white dark:bg-gray-950">
            <div className="max-w-3xl mx-auto">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>
      )}

      {/* YouTube Modal */}
      <Modal
        isOpen={showYoutubeModal}
        onClose={() => {
          setShowYoutubeModal(false)
          setYoutubeUrl('')
        }}
        title="Insertar Video de YouTube"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="youtube-url"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              URL del video
            </label>
            <input
              id="youtube-url"
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleInsertYoutube()}
              autoFocus
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Soporta youtube.com/watch, youtu.be y youtube.com/shorts
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setShowYoutubeModal(false)
                setYoutubeUrl('')
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleInsertYoutube}
              disabled={!youtubeUrl.trim()}
            >
              Insertar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Save error indicator */}
      {saveStatus === 'error' && (
        <div className="fixed bottom-4 right-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg shadow-lg">
          Error al guardar. Intenta de nuevo.
        </div>
      )}
    </div>
  )
}

// ---- Toolbar Sub-components ----

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
}

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  title: string
  className?: string
  children: React.ReactNode
}

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  className = '',
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        flex items-center px-2.5 py-2 rounded-lg text-sm font-medium transition-colors
        ${isActive
          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  )
}

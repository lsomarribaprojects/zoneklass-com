'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AIOutlineEditor } from '@/features/courses/components/AIOutlineEditor'
import { createCourseWithOutline, generateOutlineAction } from '@/actions/instructor-courses'
import { AI_CREDIT_COSTS } from '@/lib/ai/constants'

// ============================================
// Types
// ============================================

interface OutlineLesson {
  title: string
  title_en: string
  duration_minutes: number
}

interface OutlineModule {
  title: string
  title_en: string
  lessons: OutlineLesson[]
}

type WizardStep = 1 | 2 | 3 | 4

const CATEGORIES = [
  { value: 'Programacion', label: 'Programacion' },
  { value: 'IA', label: 'Inteligencia Artificial' },
  { value: 'Diseno', label: 'Diseno' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Negocios', label: 'Negocios' },
] as const

const LEVELS = [
  { value: 'Principiante', label: 'Principiante' },
  { value: 'Intermedio', label: 'Intermedio' },
  { value: 'Avanzado', label: 'Avanzado' },
] as const

// ============================================
// Component
// ============================================

export default function NewCoursePage() {
  const router = useRouter()
  const [step, setStep] = useState<WizardStep>(1)

  // Step 1: Basics
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>('Programacion')
  const [level, setLevel] = useState<string>('Principiante')

  // Step 2: AI Outline
  const [modules, setModules] = useState<OutlineModule[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)

  // Step 3: Review & Save
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Step 4: Success
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null)
  const [createdSlug, setCreatedSlug] = useState<string | null>(null)

  // Computed
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const totalMinutes = modules.reduce(
    (acc, m) => acc + m.lessons.reduce((sum, l) => sum + l.duration_minutes, 0),
    0
  )

  // ============================================
  // Step 1: Validate basics
  // ============================================
  const isStep1Valid = title.trim().length >= 3 && description.trim().length >= 10

  // ============================================
  // Step 2: Generate AI outline
  // ============================================
  async function handleGenerateOutline() {
    setIsGenerating(true)
    setGenerateError(null)

    try {
      const result = await generateOutlineAction(title, category, level, description)
      if (result.error) {
        setGenerateError(result.error)
      } else {
        setModules(result.modules)
      }
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Error al generar outline')
    } finally {
      setIsGenerating(false)
    }
  }

  // ============================================
  // Step 3: Save course to DB
  // ============================================
  async function handleSaveCourse() {
    setIsSaving(true)
    setSaveError(null)

    try {
      const courseData = {
        title,
        description,
        category,
        level,
        modules: modules.map((mod, modIdx) => ({
          title: mod.title,
          title_en: mod.title_en,
          order_index: modIdx,
          lessons: mod.lessons.map((lesson, lessonIdx) => ({
            title: lesson.title,
            title_en: lesson.title_en,
            order_index: lessonIdx,
            duration_minutes: lesson.duration_minutes,
          })),
        })),
      }

      const result = await createCourseWithOutline(courseData)

      if (result.error) {
        setSaveError(result.error)
        return
      }

      setCreatedCourseId(result.courseId || null)
      setCreatedSlug(result.slug || null)
      setStep(4)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Error al guardar curso')
    } finally {
      setIsSaving(false)
    }
  }

  // ============================================
  // Render
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Crear Nuevo Curso
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Usa IA para generar la estructura de tu curso
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}
              >
                {step > s ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s
                )}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 rounded ${
                    step > s ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
          <span className={step === 1 ? 'font-semibold text-primary-500' : ''}>1. Informacion</span>
          <span className={step === 2 ? 'font-semibold text-primary-500' : ''}>2. Estructura IA</span>
          <span className={step === 3 ? 'font-semibold text-primary-500' : ''}>3. Revisar</span>
          <span className={step === 4 ? 'font-semibold text-primary-500' : ''}>4. Listo</span>
        </div>

        {/* ============================================ */}
        {/* STEP 1: Course Basics                       */}
        {/* ============================================ */}
        {step === 1 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-border p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Titulo del Curso *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Introduccion a React desde Cero"
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
              />
              {title.length > 0 && title.length < 3 && (
                <p className="text-red-500 text-sm mt-1">Minimo 3 caracteres</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripcion *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe de que trata tu curso, que aprenderan los estudiantes..."
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 resize-none"
              />
              {description.length > 0 && description.length < 10 && (
                <p className="text-red-500 text-sm mt-1">Minimo 10 caracteres</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoria
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nivel
                </label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente: Generar Estructura
              </button>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 2: AI Outline Generation               */}
        {/* ============================================ */}
        {step === 2 && (
          <div className="space-y-6">
            {modules.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-border p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Genera la estructura con IA
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  La IA creara modulos y lecciones basados en el titulo, categoria y nivel de tu curso.
                  Podras editar todo despues.
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-500">
                  Costo: {AI_CREDIT_COSTS.course_outline} creditos IA
                </div>

                {generateError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                    {generateError}
                  </div>
                )}

                <button
                  onClick={handleGenerateOutline}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-70 transition-colors inline-flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Generando estructura...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generar con IA
                    </>
                  )}
                </button>
              </div>
            ) : (
              <>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-green-700 dark:text-green-400 text-sm">
                  Estructura generada. Edita los modulos, lecciones y duraciones a tu gusto.
                </div>
                <AIOutlineEditor modules={modules} onChange={setModules} />
              </>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 border border-border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Atras
              </button>

              {modules.length > 0 && (
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                >
                  Siguiente: Revisar
                </button>
              )}
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 3: Review & Save                       */}
        {/* ============================================ */}
        {step === 3 && (
          <div className="space-y-6">
            {/* Course Summary Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-border p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
              <p className="text-gray-600 dark:text-gray-400">{description}</p>

              <div className="flex gap-4 text-sm">
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                  {CATEGORIES.find(c => c.value === category)?.label}
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                  {level}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-500">{modules.length}</div>
                  <div className="text-sm text-gray-500">Modulos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-500">{totalLessons}</div>
                  <div className="text-sm text-gray-500">Lecciones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-500">{Math.round(totalMinutes / 60)}h {totalMinutes % 60}m</div>
                  <div className="text-sm text-gray-500">Duracion total</div>
                </div>
              </div>
            </div>

            {/* Modules Summary */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-border p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Estructura del Curso</h3>
              <div className="space-y-3">
                {modules.map((mod, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{mod.title}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {mod.lessons.length} lecciones &middot;{' '}
                        {mod.lessons.reduce((sum, l) => sum + l.duration_minutes, 0)} min
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {saveError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                {saveError}
              </div>
            )}

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-yellow-700 dark:text-yellow-400 text-sm">
              El curso se creara como <strong>borrador</strong> (no publicado). Podras publicarlo despues desde tu panel.
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 border border-border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Atras: Editar Estructura
              </button>

              <button
                onClick={handleSaveCourse}
                disabled={isSaving}
                className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-70 transition-colors inline-flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Guardando curso...
                  </>
                ) : (
                  'Crear Curso'
                )}
              </button>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* STEP 4: Success                             */}
        {/* ============================================ */}
        {step === 4 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-border p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Curso Creado Exitosamente
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Tu curso &ldquo;{title}&rdquo; ha sido creado como borrador con {modules.length} modulos y {totalLessons} lecciones.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p className="font-medium text-gray-900 dark:text-white">Proximos pasos:</p>
              <ul className="text-left space-y-1">
                <li>1. Agrega contenido a cada leccion (texto, video)</li>
                <li>2. Genera imagenes de portada</li>
                <li>3. Configura el precio y visibilidad</li>
                <li>4. Publica tu curso</li>
              </ul>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push('/instructor/dashboard')}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 border border-border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Ir al Dashboard
              </button>
              <button
                onClick={() => {
                  // Reset wizard
                  setTitle('')
                  setDescription('')
                  setCategory('Programacion')
                  setLevel('Principiante')
                  setModules([])
                  setCreatedCourseId(null)
                  setCreatedSlug(null)
                  setSaveError(null)
                  setGenerateError(null)
                  setStep(1)
                }}
                className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
              >
                Crear Otro Curso
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

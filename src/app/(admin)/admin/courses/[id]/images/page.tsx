'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import {
  generateLessonCoverImage,
  generateContentImages,
  generateLessonSummaryImage,
  getImageGenerationStatus,
} from '@/actions/generate-images'
import {
  ArrowLeft,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  CheckCircle,
  BookOpen,
} from 'lucide-react'

interface LessonStatus {
  id: string
  title: string
  moduleTitle: string
  moduleIndex: number
  lessonIndex: number
  hasCoverImage: boolean
  coverImageUrl: string | null
  hasSummaryImage: boolean
  summaryImageUrl: string | null
  pendingContentImages: number
}

interface StatusData {
  courseId: string
  courseTitle: string
  courseSlug: string
  lessons: LessonStatus[]
}

export default function ImagesPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [statusData, setStatusData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingCoverId, setGeneratingCoverId] = useState<string | null>(null)
  const [generatingContentId, setGeneratingContentId] = useState<string | null>(null)
  const [batchGenerating, setBatchGenerating] = useState(false)
  const [batchProgress, setBatchProgress] = useState(0)
  const [batchErrors, setBatchErrors] = useState<string[]>([])
  const [batchContentGenerating, setBatchContentGenerating] = useState(false)
  const [batchContentProgress, setBatchContentProgress] = useState(0)
  const [generatingSummaryId, setGeneratingSummaryId] = useState<string | null>(null)
  const [batchSummaryGenerating, setBatchSummaryGenerating] = useState(false)
  const [batchSummaryProgress, setBatchSummaryProgress] = useState(0)

  const fetchStatus = async () => {
    setLoading(true)
    try {
      const result = await getImageGenerationStatus(courseId)
      if (result.error) {
        alert(result.error)
      } else if (result.data) {
        setStatusData(result.data)
      }
    } catch (error) {
      console.error('Error fetching status:', error)
      alert('Error al cargar estado de imagenes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [courseId])

  const handleGenerateCover = async (lessonId: string) => {
    setGeneratingCoverId(lessonId)
    const result = await generateLessonCoverImage(lessonId)

    if (result.error) {
      alert(result.error)
    } else if (result.data) {
      setStatusData((prev) =>
        prev
          ? {
              ...prev,
              lessons: prev.lessons.map((l) =>
                l.id === lessonId
                  ? { ...l, hasCoverImage: true, coverImageUrl: result.data!.url }
                  : l
              ),
            }
          : null
      )
    }
    setGeneratingCoverId(null)
  }

  const handleGenerateContent = async (lessonId: string) => {
    setGeneratingContentId(lessonId)
    const result = await generateContentImages(lessonId)

    if (result.error) {
      alert(result.error)
    } else if (result.data) {
      const { replacements, total, errors } = result.data
      if (errors && errors.length > 0) {
        alert(`Se generaron ${replacements}/${total} imagenes. Errores:\n${errors.join('\n')}`)
      } else {
        alert(`Se generaron ${replacements}/${total} imagenes exitosamente`)
      }
      setStatusData((prev) =>
        prev
          ? {
              ...prev,
              lessons: prev.lessons.map((l) =>
                l.id === lessonId
                  ? { ...l, pendingContentImages: total - replacements }
                  : l
              ),
            }
          : null
      )
    }
    setGeneratingContentId(null)
  }

  const handleBatchCovers = async () => {
    if (!statusData) return

    setBatchGenerating(true)
    setBatchProgress(0)
    setBatchErrors([])
    const pendingLessons = statusData.lessons.filter((l) => !l.hasCoverImage)

    for (let i = 0; i < pendingLessons.length; i++) {
      setBatchProgress(i + 1)
      const result = await generateLessonCoverImage(pendingLessons[i].id)

      if (result.error) {
        setBatchErrors((prev) => [...prev, `${pendingLessons[i].title}: ${result.error}`])
      } else if (result.data) {
        setStatusData((prev) =>
          prev
            ? {
                ...prev,
                lessons: prev.lessons.map((l) =>
                  l.id === pendingLessons[i].id
                    ? { ...l, hasCoverImage: true, coverImageUrl: result.data!.url }
                    : l
                ),
              }
            : null
        )
      }
      // 4s delay between requests to respect free tier rate limits (~15 RPM)
      if (i < pendingLessons.length - 1) {
        await new Promise((r) => setTimeout(r, 4000))
      }
    }

    setBatchGenerating(false)
  }

  const handleBatchContent = async () => {
    if (!statusData) return

    setBatchContentGenerating(true)
    setBatchContentProgress(0)
    setBatchErrors([])
    const lessonsWithContent = statusData.lessons.filter((l) => l.pendingContentImages > 0)

    for (let i = 0; i < lessonsWithContent.length; i++) {
      setBatchContentProgress(i + 1)
      const result = await generateContentImages(lessonsWithContent[i].id)

      if (result.error) {
        setBatchErrors((prev) => [...prev, `${lessonsWithContent[i].title}: ${result.error}`])
      } else if (result.data) {
        const { replacements, total, errors } = result.data
        if (errors && errors.length > 0) {
          setBatchErrors((prev) => [...prev, ...errors.map((e) => `${lessonsWithContent[i].title}: ${e}`)])
        }
        setStatusData((prev) =>
          prev
            ? {
                ...prev,
                lessons: prev.lessons.map((l) =>
                  l.id === lessonsWithContent[i].id
                    ? { ...l, pendingContentImages: total - replacements }
                    : l
                ),
              }
            : null
        )
      }
    }

    setBatchContentGenerating(false)
  }

  const handleGenerateSummary = async (lessonId: string) => {
    setGeneratingSummaryId(lessonId)
    const result = await generateLessonSummaryImage(lessonId)

    if (result.error) {
      alert(result.error)
    } else if (result.data) {
      setStatusData((prev) =>
        prev
          ? {
              ...prev,
              lessons: prev.lessons.map((l) =>
                l.id === lessonId
                  ? { ...l, hasSummaryImage: true, summaryImageUrl: result.data!.url }
                  : l
              ),
            }
          : null
      )
    }
    setGeneratingSummaryId(null)
  }

  const handleBatchSummaries = async () => {
    if (!statusData) return

    setBatchSummaryGenerating(true)
    setBatchSummaryProgress(0)
    setBatchErrors([])
    const pendingLessons = statusData.lessons.filter((l) => !l.hasSummaryImage)

    for (let i = 0; i < pendingLessons.length; i++) {
      setBatchSummaryProgress(i + 1)
      const result = await generateLessonSummaryImage(pendingLessons[i].id)

      if (result.error) {
        setBatchErrors((prev) => [...prev, `${pendingLessons[i].title}: ${result.error}`])
      } else if (result.data) {
        setStatusData((prev) =>
          prev
            ? {
                ...prev,
                lessons: prev.lessons.map((l) =>
                  l.id === pendingLessons[i].id
                    ? { ...l, hasSummaryImage: true, summaryImageUrl: result.data!.url }
                    : l
                ),
              }
            : null
        )
      }
      if (i < pendingLessons.length - 1) {
        await new Promise((r) => setTimeout(r, 4000))
      }
    }

    setBatchSummaryGenerating(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!statusData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Curso no encontrado
        </h1>
        <Button variant="primary" onClick={() => router.push('/admin/courses')}>
          Volver a Cursos
        </Button>
      </div>
    )
  }

  const lessons = statusData.lessons
  const totalLessons = lessons.length
  const coversGenerated = lessons.filter((l) => l.hasCoverImage).length
  const summariesGenerated = lessons.filter((l) => l.hasSummaryImage).length
  const pendingContentImages = lessons.reduce((sum, l) => sum + l.pendingContentImages, 0)
  const estimatedCost = (
    (totalLessons - coversGenerated) * 0.04 +
    pendingContentImages * 0.04 +
    (totalLessons - summariesGenerated) * 0.04
  ).toFixed(2)

  // Group lessons by module
  const lessonsByModule: { [key: string]: LessonStatus[] } = {}
  lessons.forEach((lesson) => {
    const key = `${lesson.moduleIndex}-${lesson.moduleTitle}`
    if (!lessonsByModule[key]) {
      lessonsByModule[key] = []
    }
    lessonsByModule[key].push(lesson)
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        <ol className="flex items-center gap-2">
          <li>
            <a href="/admin" className="hover:text-gray-900 dark:hover:text-white">
              Admin
            </a>
          </li>
          <li>/</li>
          <li>
            <a
              href="/admin/courses"
              className="hover:text-gray-900 dark:hover:text-white"
            >
              Cursos
            </a>
          </li>
          <li>/</li>
          <li className="truncate max-w-xs">{statusData.courseTitle}</li>
          <li>/</li>
          <li className="text-gray-900 dark:text-white font-medium">Imagenes IA</li>
        </ol>
      </nav>

      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/admin/courses/${courseId}/edit`)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Volver a Editar Curso
        </Button>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Imagenes IA
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Genera imagenes profesionales para cada leccion del curso
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Covers Generados
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {coversGenerated}/{totalLessons}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                coversGenerated === totalLessons
                  ? 'bg-green-100 dark:bg-green-900/20'
                  : 'bg-yellow-100 dark:bg-yellow-900/20'
              }`}
            >
              <CheckCircle
                className={`w-6 h-6 ${
                  coversGenerated === totalLessons
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Imagenes de Contenido
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {pendingContentImages} pendientes
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Filminas Generadas
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {summariesGenerated}/{totalLessons}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                summariesGenerated === totalLessons
                  ? 'bg-green-100 dark:bg-green-900/20'
                  : 'bg-orange-100 dark:bg-orange-900/20'
              }`}
            >
              <BookOpen
                className={`w-6 h-6 ${
                  summariesGenerated === totalLessons
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-orange-600 dark:text-orange-400'
                }`}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Costo Estimado
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ${estimatedCost}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Batch Actions */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Button
          variant="primary"
          onClick={handleBatchCovers}
          disabled={coversGenerated === totalLessons || batchGenerating || batchContentGenerating}
          isLoading={batchGenerating}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          {batchGenerating
            ? `Generando covers... ${batchProgress}/${totalLessons - coversGenerated}`
            : `Generar Todos los Covers (${totalLessons - coversGenerated})`}
        </Button>
        <Button
          variant="primary"
          onClick={handleBatchContent}
          disabled={pendingContentImages === 0 || batchGenerating || batchContentGenerating}
          isLoading={batchContentGenerating}
          leftIcon={<ImageIcon className="w-4 h-4" />}
        >
          {batchContentGenerating
            ? `Generando contenido... ${batchContentProgress}/${statusData.lessons.filter((l) => l.pendingContentImages > 0).length}`
            : `Generar Todo el Contenido (${pendingContentImages})`}
        </Button>
        <Button
          variant="primary"
          onClick={handleBatchSummaries}
          disabled={summariesGenerated === totalLessons || batchGenerating || batchContentGenerating || batchSummaryGenerating}
          isLoading={batchSummaryGenerating}
          leftIcon={<BookOpen className="w-4 h-4" />}
        >
          {batchSummaryGenerating
            ? `Generando filminas... ${batchSummaryProgress}/${totalLessons - summariesGenerated}`
            : `Generar Todas las Filminas (${totalLessons - summariesGenerated})`}
        </Button>
      </div>

      {/* Batch Errors */}
      {batchErrors.length > 0 && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">
            Errores ({batchErrors.length})
          </h3>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 max-h-40 overflow-y-auto">
            {batchErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Lessons Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cover
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Leccion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado Cover
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Imagenes Contenido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Filmina
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado Filmina
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            {Object.entries(lessonsByModule).map(([moduleKey, moduleLessons]) => {
                const moduleTitle = moduleKey.split('-').slice(1).join('-')
                return (
                  <tbody key={moduleKey} className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Module Header */}
                    <tr className="bg-gray-100 dark:bg-gray-900">
                      <td
                        colSpan={7}
                        className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-white"
                      >
                        {moduleTitle}
                      </td>
                    </tr>
                    {/* Lesson Rows */}
                    {moduleLessons
                      .sort((a, b) => a.lessonIndex - b.lessonIndex)
                      .map((lesson) => (
                        <tr key={lesson.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          {/* Cover Thumbnail */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-12 h-12 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              {lesson.coverImageUrl ? (
                                <img
                                  src={lesson.coverImageUrl}
                                  alt={lesson.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                          </td>

                          {/* Lesson Title */}
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {lesson.title}
                            </div>
                          </td>

                          {/* Cover Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                lesson.hasCoverImage
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              }`}
                            >
                              {lesson.hasCoverImage ? 'Generada' : 'Pendiente'}
                            </span>
                          </td>

                          {/* Content Images */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                lesson.pendingContentImages === 0
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              }`}
                            >
                              {lesson.pendingContentImages} pendientes
                            </span>
                          </td>

                          {/* Summary Thumbnail */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-12 h-12 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              {lesson.summaryImageUrl ? (
                                <img
                                  src={lesson.summaryImageUrl}
                                  alt="Filmina"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <BookOpen className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                          </td>

                          {/* Summary Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                lesson.hasSummaryImage
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                  : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                              }`}
                            >
                              {lesson.hasSummaryImage ? 'Generada' : 'Pendiente'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerateCover(lesson.id)}
                                disabled={
                                  generatingCoverId === lesson.id ||
                                  batchGenerating ||
                                  lesson.hasCoverImage
                                }
                                isLoading={generatingCoverId === lesson.id}
                                leftIcon={<Sparkles className="w-3 h-3" />}
                              >
                                Cover
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerateContent(lesson.id)}
                                disabled={
                                  generatingContentId === lesson.id ||
                                  lesson.pendingContentImages === 0
                                }
                                isLoading={generatingContentId === lesson.id}
                                leftIcon={<Sparkles className="w-3 h-3" />}
                              >
                                Contenido
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerateSummary(lesson.id)}
                                disabled={
                                  generatingSummaryId === lesson.id ||
                                  batchSummaryGenerating ||
                                  lesson.hasSummaryImage
                                }
                                isLoading={generatingSummaryId === lesson.id}
                                leftIcon={<BookOpen className="w-3 h-3" />}
                              >
                                Filmina
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                )
              })}
          </table>
        </div>
      </div>
    </div>
  )
}

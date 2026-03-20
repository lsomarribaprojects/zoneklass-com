'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronRight, BookOpen } from 'lucide-react'

// Types
export interface OutlineLesson {
  title: string
  title_en: string
  duration_minutes: number
}

export interface OutlineModule {
  title: string
  title_en: string
  lessons: OutlineLesson[]
}

interface AIOutlineEditorProps {
  modules: OutlineModule[]
  onChange: (modules: OutlineModule[]) => void
}

export function AIOutlineEditor({ modules, onChange }: AIOutlineEditorProps) {
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set(modules.map((_, i) => i))
  )

  const toggleModule = (index: number) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedModules(newExpanded)
  }

  const updateModule = (index: number, field: keyof OutlineModule, value: string) => {
    const newModules = [...modules]
    newModules[index] = { ...newModules[index], [field]: value }
    onChange(newModules)
  }

  const updateLesson = (
    moduleIndex: number,
    lessonIndex: number,
    field: keyof OutlineLesson,
    value: string | number
  ) => {
    const newModules = [...modules]
    const newLessons = [...newModules[moduleIndex].lessons]
    newLessons[lessonIndex] = { ...newLessons[lessonIndex], [field]: value }
    newModules[moduleIndex] = { ...newModules[moduleIndex], lessons: newLessons }
    onChange(newModules)
  }

  const addModule = () => {
    const newModule: OutlineModule = {
      title: `Módulo ${modules.length + 1}`,
      title_en: `Module ${modules.length + 1}`,
      lessons: []
    }
    onChange([...modules, newModule])
    setExpandedModules(new Set([...expandedModules, modules.length]))
  }

  const removeModule = (index: number) => {
    if (window.confirm('¿Eliminar este módulo y todas sus lecciones?')) {
      const newModules = modules.filter((_, i) => i !== index)
      onChange(newModules)
      const newExpanded = new Set(expandedModules)
      newExpanded.delete(index)
      setExpandedModules(newExpanded)
    }
  }

  const addLesson = (moduleIndex: number) => {
    const newLesson: OutlineLesson = {
      title: '',
      title_en: '',
      duration_minutes: 10
    }
    const newModules = [...modules]
    newModules[moduleIndex] = {
      ...newModules[moduleIndex],
      lessons: [...newModules[moduleIndex].lessons, newLesson]
    }
    onChange(newModules)
  }

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...modules]
    const newLessons = newModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex)
    newModules[moduleIndex] = { ...newModules[moduleIndex], lessons: newLessons }
    onChange(newModules)
  }

  return (
    <div className="space-y-4">
      {modules.map((module, moduleIndex) => (
        <div
          key={moduleIndex}
          className="border border-border rounded-xl bg-white dark:bg-gray-800 overflow-hidden"
        >
          {/* Module Header */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-border">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => toggleModule(moduleIndex)}
                className="mt-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {expandedModules.has(moduleIndex) ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-primary-500 text-white text-xs font-semibold rounded">
                    Módulo {moduleIndex + 1}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {module.lessons.length} lección{module.lessons.length !== 1 ? 'es' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Título (Español)
                    </label>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Título del módulo"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Título (English)
                    </label>
                    <input
                      type="text"
                      value={module.title_en}
                      onChange={(e) => updateModule(moduleIndex, 'title_en', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Module title"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeModule(moduleIndex)}
                className="mt-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                title="Eliminar módulo"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lessons List */}
          {expandedModules.has(moduleIndex) && (
            <div className="p-4">
              <div className="space-y-3">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lessonIndex}
                    className="border border-border rounded-lg p-3 bg-gray-50 dark:bg-gray-900"
                  >
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-4 h-4 mt-2 text-gray-400" />

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Lección {lessonIndex + 1}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Título (Español)
                            </label>
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) =>
                                updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)
                              }
                              className="w-full px-3 py-2 border border-border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Título de la lección"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Título (English)
                            </label>
                            <input
                              type="text"
                              value={lesson.title_en}
                              onChange={(e) =>
                                updateLesson(moduleIndex, lessonIndex, 'title_en', e.target.value)
                              }
                              className="w-full px-3 py-2 border border-border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Lesson title"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Duración (minutos)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={lesson.duration_minutes}
                            onChange={(e) =>
                              updateLesson(
                                moduleIndex,
                                lessonIndex,
                                'duration_minutes',
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-32 px-3 py-2 border border-border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeLesson(moduleIndex, lessonIndex)}
                        className="mt-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Eliminar lección"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {module.lessons.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No hay lecciones. Agrega la primera lección.
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => addLesson(moduleIndex)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 dark:hover:border-primary-400 dark:hover:text-primary-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Agregar lección
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add Module Button */}
      <button
        type="button"
        onClick={addModule}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:text-primary-500 dark:hover:border-primary-400 dark:hover:text-primary-400 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Agregar módulo
      </button>
    </div>
  )
}

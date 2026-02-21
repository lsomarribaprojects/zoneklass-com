'use client'

import { useState } from 'react'
import { Save, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { updateHannaConfig } from '@/actions/admin'
import type { HannaConfig } from '@/types/database'

interface HannaConfigCardProps {
  config: HannaConfig
  onUpdated: () => void
}

const MODE_LABELS: Record<string, string> = {
  tutora: 'Tutora',
  code_review: 'Code Review',
  orientadora: 'Orientadora',
  motivadora: 'Motivadora',
  estudio: 'Estudio',
  evaluadora: 'Evaluadora',
}

const MODE_DESCRIPTIONS: Record<string, string> = {
  tutora: 'Explica conceptos y responde preguntas',
  code_review: 'Revisa y mejora codigo',
  orientadora: 'Guia la ruta de aprendizaje',
  motivadora: 'Motiva y celebra logros',
  estudio: 'Ayuda a estudiar y memorizar',
  evaluadora: 'Evalua conocimientos con quizzes',
}

export function HannaConfigCard({ config, onUpdated }: HannaConfigCardProps) {
  const [systemPrompt, setSystemPrompt] = useState(config.system_prompt)
  const [model, setModel] = useState(config.model)
  const [temperature, setTemperature] = useState(config.temperature.toString())
  const [maxTokens, setMaxTokens] = useState(config.max_tokens.toString())
  const [isActive, setIsActive] = useState(config.is_active)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const hasChanges =
    systemPrompt !== config.system_prompt ||
    model !== config.model ||
    temperature !== config.temperature.toString() ||
    maxTokens !== config.max_tokens.toString() ||
    isActive !== config.is_active

  async function handleSave() {
    setSaving(true)
    setFeedback(null)

    const { error } = await updateHannaConfig(config.id, {
      system_prompt: systemPrompt,
      model,
      temperature: parseFloat(temperature),
      max_tokens: parseInt(maxTokens),
      is_active: isActive,
    })

    if (error) {
      setFeedback({ type: 'error', message: error })
    } else {
      setFeedback({ type: 'success', message: 'Guardado' })
      onUpdated()
      setTimeout(() => setFeedback(null), 3000)
    }
    setSaving(false)
  }

  return (
    <div className={`rounded-xl border p-5 transition-colors ${
      isActive
        ? 'border-border bg-white dark:bg-slate-800'
        : 'border-dashed border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50 opacity-75'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-semibold text-foreground">{MODE_LABELS[config.mode] || config.mode}</h4>
          <p className="text-xs text-foreground-muted mt-0.5">{MODE_DESCRIPTIONS[config.mode] || ''}</p>
        </div>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            isActive ? 'bg-primary-500' : 'bg-gray-300 dark:bg-slate-600'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              isActive ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* System Prompt */}
      <Textarea
        label="System Prompt"
        value={systemPrompt}
        onChange={(e) => setSystemPrompt(e.target.value)}
        className="text-xs"
      />

      {/* Model + Temperature + Max Tokens */}
      <div className="grid grid-cols-3 gap-3 mt-3">
        <Input
          label="Modelo"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <Input
          label="Temperatura"
          type="number"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          min={0}
          max={2}
          step={0.1}
        />
        <Input
          label="Max Tokens"
          type="number"
          value={maxTokens}
          onChange={(e) => setMaxTokens(e.target.value)}
          min={1}
        />
      </div>

      {/* Save */}
      <div className="flex items-center justify-between mt-4">
        {feedback && (
          <div className={`flex items-center gap-1.5 text-xs ${
            feedback.type === 'success' ? 'text-green-600' : 'text-red-500'
          }`}>
            {feedback.type === 'success' ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            {feedback.message}
          </div>
        )}
        <div className="ml-auto">
          <Button
            size="sm"
            onClick={handleSave}
            isLoading={saving}
            disabled={!hasChanges || saving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Guardar
          </Button>
        </div>
      </div>
    </div>
  )
}

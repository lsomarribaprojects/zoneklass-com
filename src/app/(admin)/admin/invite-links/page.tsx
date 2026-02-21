'use client'

import { useState, useEffect, useCallback } from 'react'
import { Link2, Copy, Check, MousePointer, UserPlus, GraduationCap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getAllInviteLinks } from '@/actions/admin'
import type { InviteLinkGlobal } from '@/actions/admin'

const SOURCE_OPTIONS = [
  { value: 'all', label: 'Todas las fuentes' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
  { value: 'website', label: 'Website' },
  { value: 'other', label: 'Otro' },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
]

const SOURCE_COLORS: Record<string, string> = {
  twitter: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  whatsapp: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  email: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  website: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={(e) => { e.stopPropagation(); handleCopy() }}
      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
      title="Copiar codigo"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-foreground-muted" />
      )}
    </button>
  )
}

export default function AdminInviteLinksPage() {
  const [links, setLinks] = useState<InviteLinkGlobal[]>([])
  const [loading, setLoading] = useState(true)
  const [sourceFilter, setSourceFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchLinks = useCallback(async () => {
    setLoading(true)
    const { data } = await getAllInviteLinks({
      source: sourceFilter,
      isActive: statusFilter,
    })
    if (data) setLinks(data)
    setLoading(false)
  }, [sourceFilter, statusFilter])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  // Aggregate stats
  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0)
  const totalRegistrations = links.reduce((sum, l) => sum + l.registrations, 0)
  const totalEnrollments = links.reduce((sum, l) => sum + l.enrollments, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Link2 className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-foreground">Invite Links</h1>
        </div>
        <p className="text-foreground-secondary">Vista global de todos los enlaces de invitacion</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-blue-500">
              <MousePointer className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-foreground-secondary">Total Clicks</p>
              <p className="text-3xl font-bold text-foreground mt-1">{loading ? '-' : totalClicks}</p>
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-green-500">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-foreground-secondary">Registros</p>
              <p className="text-3xl font-bold text-foreground mt-1">{loading ? '-' : totalRegistrations}</p>
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-purple-500">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-foreground-secondary">Inscripciones</p>
              <p className="text-3xl font-bold text-foreground mt-1">{loading ? '-' : totalEnrollments}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-4 py-2.5 bg-surface text-foreground border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
          >
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-surface text-foreground border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <p className="text-sm text-foreground-muted self-center ml-auto">
            {links.length} enlaces
          </p>
        </div>
      </Card>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card className="overflow-hidden" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50 dark:bg-slate-800/50">
                  <th className="text-left text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Codigo</th>
                  <th className="text-left text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Label</th>
                  <th className="text-left text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Curso</th>
                  <th className="text-left text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Fuente</th>
                  <th className="text-center text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Clicks</th>
                  <th className="text-center text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Registros</th>
                  <th className="text-center text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Inscrip.</th>
                  <th className="text-center text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-28 bg-gray-200 dark:bg-slate-700 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-6 w-16 bg-gray-200 dark:bg-slate-700 rounded-full" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-8 bg-gray-200 dark:bg-slate-700 rounded mx-auto" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-8 bg-gray-200 dark:bg-slate-700 rounded mx-auto" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-8 bg-gray-200 dark:bg-slate-700 rounded mx-auto" /></td>
                      <td className="px-4 py-3"><div className="h-6 w-16 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto" /></td>
                    </tr>
                  ))
                ) : links.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <Link2 className="w-10 h-10 text-foreground-muted mx-auto mb-2" />
                      <p className="text-foreground-muted text-sm">No hay invite links</p>
                    </td>
                  </tr>
                ) : (
                  links.map((link) => (
                    <tr key={link.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <code className="text-sm font-mono text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded">
                            {link.code}
                          </code>
                          <CopyButton text={link.code} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground truncate max-w-[150px]">
                        {link.label}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground-secondary truncate max-w-[180px]">
                        {link.courseName}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={SOURCE_COLORS[link.source] || SOURCE_COLORS.other}>
                          {link.source}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-medium text-foreground tabular-nums">
                        {link.clicks}
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-medium text-foreground tabular-nums">
                        {link.registrations}
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-medium text-foreground tabular-nums">
                        {link.enrollments}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={link.isActive ? 'confirmed' : 'pending'}>
                          {link.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <div className="space-y-2 animate-pulse">
                <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded" />
                <div className="h-3 w-48 bg-gray-200 dark:bg-slate-700 rounded" />
              </div>
            </Card>
          ))
        ) : links.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <Link2 className="w-10 h-10 text-foreground-muted mx-auto mb-2" />
              <p className="text-foreground-muted text-sm">No hay invite links</p>
            </div>
          </Card>
        ) : (
          links.map((link) => (
            <Card key={link.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded">
                    {link.code}
                  </code>
                  <CopyButton text={link.code} />
                </div>
                <Badge variant={link.isActive ? 'confirmed' : 'pending'}>
                  {link.isActive ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <p className="text-sm text-foreground font-medium truncate">{link.label}</p>
              <p className="text-xs text-foreground-muted truncate mt-0.5">{link.courseName}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-foreground-secondary">
                <Badge className={SOURCE_COLORS[link.source] || SOURCE_COLORS.other}>
                  {link.source}
                </Badge>
                <span>{link.clicks} clicks</span>
                <span>{link.registrations} reg.</span>
                <span>{link.enrollments} inscrip.</span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

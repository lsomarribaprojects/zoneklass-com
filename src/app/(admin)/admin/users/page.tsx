'use client'

import { useState, useEffect, useCallback } from 'react'
import { Download, Search, Shield, Users as UsersIcon } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getUsers, changeUserRole, exportUsersCSV } from '@/actions/admin'
import type { AdminUser, UsersResult } from '@/actions/admin'

const ROLE_OPTIONS = [
  { value: 'all', label: 'Todos los roles' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'estudiante', label: 'Estudiante' },
]

const ROLE_BADGE_COLORS: Record<string, string> = {
  super_admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  estudiante: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  estudiante: 'Estudiante',
}

function UserAvatar({ user }: { user: AdminUser }) {
  const initials = user.full_name
    ? user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase()

  if (user.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={user.full_name || ''}
        className="w-9 h-9 rounded-full object-cover"
      />
    )
  }

  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-semibold">
      {initials}
    </div>
  )
}

export default function AdminUsersPage() {
  const { isSuperAdmin } = useUser()
  const [result, setResult] = useState<UsersResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [exporting, setExporting] = useState(false)
  const [changingRole, setChangingRole] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const { data } = await getUsers({ search, role: roleFilter, page, perPage: 20 })
    if (data) setResult(data)
    setLoading(false)
  }, [search, roleFilter, page])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Debounce search
  useEffect(() => {
    setPage(1)
  }, [search, roleFilter])

  const [searchInput, setSearchInput] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  async function handleRoleChange(userId: string, newRole: string) {
    setChangingRole(userId)
    const { error } = await changeUserRole(userId, newRole)
    if (error) {
      alert(error)
    } else {
      fetchUsers()
    }
    setChangingRole(null)
  }

  async function handleExport() {
    setExporting(true)
    const { data, error } = await exportUsersCSV()
    if (data) {
      const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `usuarios-zoneklass-${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } else if (error) {
      alert(error)
    }
    setExporting(false)
  }

  const users = result?.users || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Usuarios</h1>
          <p className="text-foreground-secondary mt-1">
            {result ? `${result.totalCount} usuarios registrados` : 'Cargando...'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          isLoading={exporting}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Exportar CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface text-foreground border border-border rounded-xl placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 bg-surface text-foreground border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card className="overflow-hidden" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50 dark:bg-slate-800/50">
                  <th className="text-left text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Usuario</th>
                  <th className="text-left text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Email</th>
                  <th className="text-left text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Rol</th>
                  <th className="text-center text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Nivel</th>
                  <th className="text-center text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">XP</th>
                  <th className="text-left text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Registro</th>
                  <th className="text-left text-xs font-medium text-foreground-muted uppercase tracking-wider px-4 py-3">Ultimo acceso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-slate-700" /><div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded" /></div></td>
                      <td className="px-4 py-3"><div className="h-4 w-36 bg-gray-200 dark:bg-slate-700 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-6 w-20 bg-gray-200 dark:bg-slate-700 rounded-full" /></td>
                      <td className="px-4 py-3 text-center"><div className="h-4 w-8 bg-gray-200 dark:bg-slate-700 rounded mx-auto" /></td>
                      <td className="px-4 py-3 text-center"><div className="h-4 w-12 bg-gray-200 dark:bg-slate-700 rounded mx-auto" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded" /></td>
                      <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded" /></td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <UsersIcon className="w-10 h-10 text-foreground-muted mx-auto mb-2" />
                      <p className="text-foreground-muted text-sm">No se encontraron usuarios</p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={user} />
                          <span className="text-sm font-medium text-foreground truncate max-w-[160px]">
                            {user.full_name || 'Sin nombre'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground-secondary truncate max-w-[200px]">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        {isSuperAdmin ? (
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            disabled={changingRole === user.id}
                            className="text-xs px-2 py-1 bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-accent-500 disabled:opacity-50"
                          >
                            <option value="estudiante">Estudiante</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        ) : (
                          <Badge className={ROLE_BADGE_COLORS[user.role] || ''}>
                            {ROLE_LABELS[user.role] || user.role}
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-bold">
                          {user.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-medium text-foreground tabular-nums">
                        {user.xp.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground-secondary">
                        {new Date(user.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground-muted">
                        {new Date(user.updated_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
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
              <div className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-48 bg-gray-200 dark:bg-slate-700 rounded" />
                </div>
              </div>
            </Card>
          ))
        ) : users.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <UsersIcon className="w-10 h-10 text-foreground-muted mx-auto mb-2" />
              <p className="text-foreground-muted text-sm">No se encontraron usuarios</p>
            </div>
          </Card>
        ) : (
          users.map((user) => (
            <Card key={user.id}>
              <div className="flex items-start gap-3">
                <UserAvatar user={user} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{user.full_name || 'Sin nombre'}</p>
                  <p className="text-sm text-foreground-muted truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge className={ROLE_BADGE_COLORS[user.role] || ''}>
                      {ROLE_LABELS[user.role] || user.role}
                    </Badge>
                    <span className="text-xs text-foreground-secondary">Nivel {user.level}</span>
                    <span className="text-xs text-foreground-secondary">{user.xp.toLocaleString()} XP</span>
                  </div>
                  {isSuperAdmin && (
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={changingRole === user.id}
                      className="mt-2 text-xs px-2 py-1 bg-surface border border-border rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-accent-500 disabled:opacity-50"
                    >
                      <option value="estudiante">Estudiante</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {result && result.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-foreground-secondary">
            Pagina {result.currentPage} de {result.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= result.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

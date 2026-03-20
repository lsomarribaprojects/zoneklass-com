interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'success' | 'warning'
  className?: string
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  pending: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300',
  confirmed: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
  cancelled: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300',
  completed: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
  success: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
  warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}

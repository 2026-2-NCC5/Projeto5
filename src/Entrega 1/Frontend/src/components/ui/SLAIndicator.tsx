import { differenceInMinutes, differenceInHours, parseISO } from 'date-fns'
import { cn } from '../../lib/utils'

interface SLAIndicatorProps {
  deadline: string
  status: 'ok' | 'risk' | 'breached'
}

function formatTimeRemaining(deadline: string): string {
  const now = new Date()
  const end = parseISO(deadline)
  const totalMinutes = differenceInMinutes(end, now)

  if (totalMinutes < 0) return 'Vencido'
  if (totalMinutes < 60) return `${totalMinutes}min`

  const hours = differenceInHours(end, now)
  const mins = totalMinutes - hours * 60
  return `${hours}h ${mins}min`
}

export default function SLAIndicator({ deadline, status }: SLAIndicatorProps) {
  const timeText = formatTimeRemaining(deadline)

  if (status === 'breached') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
        Vencido
      </span>
    )
  }

  if (status === 'risk') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 animate-pulse" />
        {timeText}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400">
      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
      {timeText}
    </span>
  )
}

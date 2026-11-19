export const AVAILABILITY_WINDOWS = [
  { value: 'TODAY', label: 'Hoje' },
  { value: 'TOMORROW', label: 'Amanhã' },
  { value: 'THIS_WEEK', label: 'Esta semana' },
  { value: 'WEEKEND', label: 'Neste fim de semana' },
  { value: 'NEXT_WEEK', label: 'Próxima semana' },
  { value: 'ANY_DAY', label: 'Qualquer dia' }
] as const

export type DateModeValue = 'IMMEDIATE' | 'SCHEDULED' | 'FLEXIBLE'

export interface ScheduleValues {
  dateMode?: string | null
  exactDatetime?: string | null
  availabilityWindow?: string | null
}

export function availabilityWindowLabel(value: string | null | undefined): string {
  return AVAILABILITY_WINDOWS.find((window) => window.value === value)?.label ?? 'Janela flexível'
}

export function formatFreightSchedule(schedule: ScheduleValues): string {
  if (schedule.dateMode === 'IMMEDIATE') return 'O mais rápido possível'
  if (schedule.dateMode === 'FLEXIBLE') {
    return `Janela: ${availabilityWindowLabel(schedule.availabilityWindow)}`
  }
  if (!schedule.exactDatetime) return 'Data não informada'

  return new Date(schedule.exactDatetime).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function validateSchedule(schedule: ScheduleValues): string | null {
  if (!schedule.dateMode) return 'Escolha quando o frete deve ser realizado'
  if (schedule.dateMode === 'SCHEDULED' && !schedule.exactDatetime) {
    return 'Informe a data e o horário do frete'
  }
  if (schedule.dateMode === 'FLEXIBLE' && !schedule.availabilityWindow) {
    return 'Escolha a janela de disponibilidade'
  }
  return null
}

export function toIsoDatetime(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

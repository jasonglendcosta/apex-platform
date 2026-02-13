'use client'

import { CheckCircle2, Circle, Clock } from 'lucide-react'

type WorkflowStatus =
  | 'reserved'
  | 'booked'
  | 'spa_signed'
  | 'spa_executed'
  | 'registered'
  | 'handed_over'

interface WorkflowStep {
  key: WorkflowStatus
  label: string
  description: string
}

interface ReservationStatusWorkflowProps {
  currentStatus: string
  reservationDate?: string
  bookingDate?: string
  spaDate?: string
  registrationDate?: string
  handoverDate?: string
  compact?: boolean
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  { key: 'reserved', label: 'Reserved', description: 'Unit reserved for customer' },
  { key: 'booked', label: 'Booked', description: 'Booking confirmed & deposit paid' },
  { key: 'spa_signed', label: 'SPA Signed', description: 'Sales & Purchase Agreement signed' },
  { key: 'spa_executed', label: 'SPA Executed', description: 'SPA notarized & executed' },
  { key: 'registered', label: 'Registered', description: 'Title deed registered' },
  { key: 'handed_over', label: 'Handed Over', description: 'Keys handed to buyer' },
]

const STATUS_ORDER: Record<string, number> = {
  reserved: 0,
  booked: 1,
  spa_pending: 2,
  spa_signed: 2,
  spa_executed: 3,
  registered: 4,
  handed_over: 5,
}

function getStepState(
  stepIndex: number,
  currentIndex: number
): 'completed' | 'current' | 'upcoming' {
  if (stepIndex < currentIndex) return 'completed'
  if (stepIndex === currentIndex) return 'current'
  return 'upcoming'
}

function getDateForStep(
  step: WorkflowStatus,
  props: ReservationStatusWorkflowProps
): string | undefined {
  switch (step) {
    case 'reserved': return props.reservationDate
    case 'booked': return props.bookingDate
    case 'spa_signed':
    case 'spa_executed': return props.spaDate
    case 'registered': return props.registrationDate
    case 'handed_over': return props.handoverDate
    default: return undefined
  }
}

export function ReservationStatusWorkflow(props: ReservationStatusWorkflowProps) {
  const { currentStatus, compact = false } = props
  const currentIndex = STATUS_ORDER[currentStatus] ?? -1

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {WORKFLOW_STEPS.map((step, idx) => {
          const state = getStepState(idx, currentIndex)
          return (
            <div key={step.key} className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  state === 'completed'
                    ? 'bg-emerald-400'
                    : state === 'current'
                    ? 'bg-[#D86DCB] ring-2 ring-[#D86DCB]/30'
                    : 'bg-white/10'
                }`}
                title={`${step.label}${state === 'current' ? ' (Current)' : state === 'completed' ? ' ✓' : ''}`}
              />
              {idx < WORKFLOW_STEPS.length - 1 && (
                <div
                  className={`w-4 h-0.5 ${
                    state === 'completed' ? 'bg-emerald-400/50' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a24] rounded-xl border border-white/10 p-5">
      <h3 className="text-sm font-semibold text-white mb-5">Transaction Progress</h3>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-white/10" />

        <div className="space-y-4">
          {WORKFLOW_STEPS.map((step, idx) => {
            const state = getStepState(idx, currentIndex)
            const date = getDateForStep(step.key, props)

            return (
              <div key={step.key} className="flex items-start gap-4 relative">
                {/* Icon */}
                <div className="relative z-10 flex-shrink-0">
                  {state === 'completed' ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                  ) : state === 'current' ? (
                    <div className="w-8 h-8 rounded-full bg-[#D86DCB]/20 flex items-center justify-center ring-2 ring-[#D86DCB]/30">
                      <Clock className="w-5 h-5 text-[#D86DCB] animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <Circle className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        state === 'completed'
                          ? 'text-emerald-400'
                          : state === 'current'
                          ? 'text-white'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                    {state === 'current' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#D86DCB]/20 text-[#D86DCB]">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-0.5 ${
                      state === 'upcoming' ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    {step.description}
                  </p>
                  {date && state !== 'upcoming' && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

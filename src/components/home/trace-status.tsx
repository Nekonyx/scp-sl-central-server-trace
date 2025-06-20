import { TraceResource } from '@/constants/trace'
import { CircleCheckIcon, CircleXIcon, Loader2Icon } from 'lucide-react'

interface TraceStatusProps {
  isLoading: boolean
  data: string | null
  error: any
  resource: TraceResource
  children?: React.ReactNode
}

export function TraceStatus({ isLoading, data, error, resource, children }: TraceStatusProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2Icon className="animate-spin" />
      </div>
    )
  }

  if (data) {
    return (
      <div className="pt-2 pb-4 h-full">
        <p className="flex items-center mb-2 font-semibold">
          <CircleCheckIcon className="mr-1.5 size-4 text-blue-400 shrink-0" strokeWidth={3} />
          {resource.messages.success}
        </p>
        {children}
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-2 pb-4 h-full">
        <p className="flex items-center font-semibold">
          <CircleXIcon className="mr-1.5 size-4 text-red-400 shrink-0" strokeWidth={3} />
          {resource.messages.failure}
        </p>
      </div>
    )
  }

  return null
}

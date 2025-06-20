'use client'
import { ResourceStatus, TRACE_FIELDS, TraceResource } from '@/constants/trace'
import { useTrace } from '@/hooks/use-trace'
import { extractOrigin as getHostname } from '@/lib/trace'
import { processTraceData } from '@/lib/trace-processor'
import { cn } from '@/lib/utils'
import { RefreshCwIcon } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Button } from '../ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { TraceList } from './trace-list'
import { TraceStatus } from './trace-status'

interface TraceProps {
  className?: string
  resource: TraceResource
  updateState(resource: TraceResource, state: ResourceStatus): void
}

export function Trace({ className, resource, updateState }: TraceProps) {
  const { isLoading, responseTime, data, error, invalidate } = useTrace(resource.url)

  const entries = useMemo(() => {
    return data ? processTraceData(data, TRACE_FIELDS) : []
  }, [data])

  useEffect(() => {
    if (isLoading) {
      updateState(resource, ResourceStatus.Loading)
      return
    }

    if (data) {
      updateState(resource, ResourceStatus.Success)
      return
    }

    if (error) {
      updateState(resource, ResourceStatus.Failure)
      return
    }
  }, [updateState, isLoading, data, error])

  return (
    <Card className={cn('gap-2', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{getHostname(resource)}</span>
        </CardTitle>
        <CardDescription>{resource.messages.description}</CardDescription>
        <CardAction className={cn('group relative invisible', (!isLoading || error) && 'visible')}>
          <span
            className={cn(
              'right-0 absolute',
              'transition-opacity group-hover:opacity-0',
              error && 'opacity-0'
            )}
          >
            {responseTime}ms
          </span>
          <Button
            className={cn(
              '-right-0.5 -top-1 absolute',
              'transition-opacity cursor-pointer opacity-0 group-hover:opacity-100',
              error && 'opacity-100'
            )}
            onClick={invalidate}
            variant="outline"
            size="sm"
          >
            <RefreshCwIcon />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="pb-4 h-[12rem]">
        <TraceStatus isLoading={isLoading} data={data} error={error} resource={resource}>
          <TraceList entries={entries} />
        </TraceStatus>
      </CardContent>
    </Card>
  )
}

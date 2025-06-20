import { TRACE_DESCRIPTIONS } from '@/constants/trace'
import { TraceEntry, TraceEntryFlag } from '@/lib/trace-processor'
import { AlertCircleIcon, CircleIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface TraceListProps {
  entries: TraceEntry[]
}

export function TraceList({ entries }: TraceListProps) {
  return (
    <ul className="flex flex-col justify-between gap-2 h-full">
      {entries.map((entry) => (
        <TraceListItem key={entry.field} entry={entry} />
      ))}
    </ul>
  )
}

function TraceListItem({ entry }: { entry: TraceEntry }) {
  return (
    <li className="flex items-center text-sm">
      <Tooltip>
        <TooltipTrigger>
          {entry.flag !== TraceEntryFlag.Bad && (
            <CircleIcon className="mr-2 size-3.5 text-blue-400" />
          )}

          {entry.flag === TraceEntryFlag.Bad && (
            <AlertCircleIcon className="mr-2 size-3.5 text-orange-400" />
          )}
        </TooltipTrigger>
        <TooltipContent className="text-white text-center">
          {TRACE_DESCRIPTIONS[entry.field].split('\n').map((e) => (
            <p key={e}>{e}</p>
          ))}
        </TooltipContent>
      </Tooltip>
      <span className="font-semibold">{entry.label}</span>: {entry.text}
    </li>
  )
}

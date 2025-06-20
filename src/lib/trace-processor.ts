import { iata } from '@/constants/iata'
import { HIDDEN_TRACE_FIELDS, TraceField } from '@/constants/trace'

export enum TraceEntryFlag {
  None,
  Good,
  Bad
}

export interface TraceEntry {
  field: TraceField
  label: string
  text: string
  flag: TraceEntryFlag
}

export function processTraceData(
  data: string,
  traceFields: Record<TraceField, string>
): TraceEntry[] {
  const entries = data
    .trim()
    .split('\n')
    .map((line) => line.split('=') as [TraceField, string])
    .filter((entry) => !HIDDEN_TRACE_FIELDS.has(entry[0]))
    .map(([field, value]) => processTraceEntry(field, value, traceFields))

  return entries.length <= 1 ? [] : entries
}

function processTraceEntry(
  field: TraceField,
  value: string,
  traceFields: Record<TraceField, string>
): TraceEntry {
  let flag = TraceEntryFlag.None
  let text = value

  switch (field) {
    case TraceField.COLO:
      text = `${value} (${iata[value]})`
      break
    case TraceField.SLIVER:
      text = value === 'none' ? '-' : value
      break
    case TraceField.SNI:
      if (value === 'plaintext') {
        text = 'не шифруется'
        flag = TraceEntryFlag.Good
      } else {
        text = 'шифруется'
        flag = TraceEntryFlag.Bad
      }
      break
    case TraceField.WARP:
    case TraceField.GATEWAY:
    case TraceField.RBI:
      text = value === 'off' ? 'не используется' : 'используется'
      break
    case TraceField.HTTP:
      text = value.toUpperCase()
      if (text.endsWith('3')) {
        flag = TraceEntryFlag.Bad
      } else {
        flag = TraceEntryFlag.Good
      }
      break
    case TraceField.TLS:
      if (text.endsWith('3')) {
        flag = TraceEntryFlag.Bad
      } else {
        flag = TraceEntryFlag.Good
      }
      break
    case TraceField.KEX:
      if (text === 'X25519MLKEM768') {
        flag = TraceEntryFlag.Bad
      } else {
        flag = TraceEntryFlag.Good
      }
      break
  }

  return {
    field,
    label: traceFields[field],
    text,
    flag
  }
}

'use client'
import { createContext } from 'react'

export interface TraceContextValue {
  //
}

const defaultValue: TraceContextValue = {
  //
}

export const TraceContext = createContext<TraceContextValue>(defaultValue)

export function TraceProvider() {
  //
}

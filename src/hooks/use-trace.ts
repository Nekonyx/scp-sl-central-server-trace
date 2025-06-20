import { useCallback, useEffect, useReducer, useRef, useState } from 'react'

interface CentralState {
  data: string | null
  error: Error | null
  responseTime: number | null
  isLoading: boolean
}

type CentralAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { data: string; responseTime: number } }
  | { type: 'FETCH_ERROR'; payload: { error: Error; responseTime: number } }
  | { type: 'RESET' }

const initialState: CentralState = {
  data: null,
  error: null,
  responseTime: null,
  isLoading: true
}

function centralReducer(state: CentralState, action: CentralAction): CentralState {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        data: null,
        error: null,
        responseTime: null,
        isLoading: true
      }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        data: action.payload.data,
        responseTime: action.payload.responseTime,
        error: null,
        isLoading: false
      }
    case 'FETCH_ERROR':
      return {
        ...state,
        data: null,
        error: action.payload.error,
        responseTime: action.payload.responseTime,
        isLoading: false
      }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export function useTrace(url: string) {
  const [state, dispatch] = useReducer(centralReducer, initialState)
  const [key, setKey] = useState(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    abortControllerRef.current?.abort()

    const controller = new AbortController()
    abortControllerRef.current = controller

    dispatch({
      type: 'FETCH_START'
    })

    const startTime = performance.now()
    const endpoint = new URL('/cdn-cgi/trace', url)
    const timeoutSignal = AbortSignal.timeout(60_000)

    fetch(endpoint, {
      signal: AbortSignal.any([controller.signal, timeoutSignal])
    })
      .then(async (response) => {
        const endTime = performance.now()
        const responseTime = Math.round(endTime - startTime)
        const data = await response.text()

        dispatch({
          type: 'FETCH_SUCCESS',
          payload: {
            data,
            responseTime
          }
        })
      })
      .catch((error) => {
        // Не выкидывать ошибку, если запрос прерван AbortController
        if (error.name === 'AbortError' && !timeoutSignal.aborted) {
          return
        }

        const endTime = performance.now()
        const responseTime = Math.round(endTime - startTime)

        dispatch({
          type: 'FETCH_ERROR',
          payload: {
            error,
            responseTime
          }
        })
      })
  }, [url, key])

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  const invalidate = useCallback(() => {
    setKey((prev) => prev + 1)
  }, [])

  return {
    url,
    isLoading: state.isLoading,
    data: state.data,
    error: state.error,
    responseTime: state.responseTime,
    invalidate
  }
}

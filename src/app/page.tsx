'use client'
import { Trace } from '@/components/home/trace'
import { Card, CardContent } from '@/components/ui/card'
import {
  ResourceStatus,
  TRACE_RESOURCES,
  TraceResource,
  TraceResourceType
} from '@/constants/trace'
import { isPrimaryTraceResource } from '@/lib/trace'
import { cn } from '@/lib/utils'
import { AlertCircleIcon, CircleCheckIcon, Loader2Icon } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

interface State {
  resource: TraceResource
  status: ResourceStatus
}

const initialState: State[] = TRACE_RESOURCES.map((resource) => ({
  resource,
  status: ResourceStatus.Loading
}))

export default function Home() {
  const [state, setState] = useState<State[]>(initialState)

  const updateState = useCallback((resource: TraceResource, status: ResourceStatus) => {
    setState((prev) => {
      const item = prev.find((i) => i.resource === resource)
      if (!item) {
        return [...prev, { resource, status }]
      }

      return prev.map((i) => {
        if (i.resource === resource) {
          return { ...i, status }
        }

        return i
      })
    })
  }, [])

  const status = useMemo(() => {
    const loading = state.some((i) => i.status === ResourceStatus.Loading)
    const success = state.every((i) => i.status === ResourceStatus.Success)
    const failed = state.every((i) => i.status === ResourceStatus.Failure)
    const reserveFailed = state.some(
      (i) =>
        i.resource.type === TraceResourceType.ReserveCentral && i.status === ResourceStatus.Failure
    )

    if (loading) {
      const loaded = state.reduce((i, x) => i + Number(x.status !== ResourceStatus.Loading), 0)

      return {
        title: 'Идёт проверка',
        description: `Получено ответов от ${loaded} из ${TRACE_RESOURCES.length} ресурсов.`,
        icon: <Loader2Icon className="size-10 animate-spin" />
      }
    }

    if (success) {
      return {
        title: 'Всё в порядке',
        description: 'Центральные сервера не блокируются, приятной игры!',
        icon: <CircleCheckIcon className="size-10 text-blue-500" />
      }
    }

    if (!reserveFailed) {
      return {
        title: 'Есть проблемы',
        description: 'Но резервный центральный сервер в ветке `tls-beta` работает, приятной игры!',
        icon: <AlertCircleIcon className="size-10 text-orange-400" />
      }
    }

    if (failed) {
      return {
        title: 'Все сервисы недоступны',
        description:
          'Все центральные сервера и сервисы недоступны, используйте средства для обхода блокировок.',
        icon: <AlertCircleIcon className="size-10 text-red-500" />
      }
    }

    return {
      title: 'Есть проблемы',
      description:
        'Некоторые центральные сервера заблокированы, используйте средства для обхода блокировок.',
      icon: <AlertCircleIcon className="size-10 text-red-500" />
    }
  }, [state])

  return (
    <main className="mx-auto px-4 lg:px-0 py-10 container">
      <section>
        <h1 className="font-semibold text-3xl">Проверка доступности центральных серверов</h1>

        <p className="mt-3 max-w-4xl text-lg">
          Начиная с 20 марта 2025 года Роскомнадзор усилил меры по блокировке инфраструктуры
          Cloudflare, что повлияло на стабильность подключения к центральным серверам игроками
          <br />
          из России.
        </p>

        <p className="mt-3 max-w-4xl text-lg">
          Рекомендуется использовать браузер Chrome/Edge/Opera/Firefox для проверки.
          <br />
          Браузер от Yandex может показывать неточные результаты.
        </p>
      </section>

      <div className="my-8" />

      <section>
        <Card>
          <CardContent className="flex flex-row items-center gap-5">
            {status.icon}

            <div className="flex flex-col gap-0.5">
              <h2 className="font-bold">{status.title}</h2>
              <p>{status.description}</p>
            </div>
          </CardContent>
        </Card>

        <div className="gap-4 gap-y-6 grid md:grid-cols-2 xl:grid-cols-6 mt-8">
          {TRACE_RESOURCES.map((resource) => (
            <Trace
              className={cn(isPrimaryTraceResource(resource) ? 'xl:col-span-3' : 'xl:col-span-2')}
              key={resource.url}
              resource={resource}
              updateState={updateState}
            />
          ))}
        </div>
      </section>
    </main>
  )
}

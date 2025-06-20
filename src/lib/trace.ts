import { TraceResource, TraceResourceType } from '@/constants/trace'

export function isPrimaryTraceResource(resource: TraceResource): boolean {
  return (
    resource.type === TraceResourceType.Cloudflare ||
    resource.type === TraceResourceType.PrimaryCentral
  )
}

export function extractOrigin(resource: TraceResource): string {
  return resource.url.replace(/https?(:\/\/)?/, '').trim()
}

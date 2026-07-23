import type { ApiResponse } from '../types/api'
import { ApiClientError } from './ApiClientError'
import { http } from './http'

export interface HealthData {
  status: string
  service: string
}

export async function getHealth(signal?: AbortSignal): Promise<HealthData> {
  const response = await http.get<ApiResponse<HealthData>>('/api/health', {
    signal,
  })
  const body = response.data

  if (!body.success || body.data === null) {
    throw new ApiClientError(
      body.error?.code ?? 'UNKNOWN_ERROR',
      body.error?.message ?? '알 수 없는 오류가 발생했습니다.',
    )
  }

  return body.data
}

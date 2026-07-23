import axios, { isAxiosError } from 'axios'
import type { ApiResponse } from '../types/api'
import { ApiClientError } from './ApiClientError'

export const http = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
})

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as ApiResponse<unknown>
  return (
    typeof candidate.success === 'boolean' &&
    'data' in candidate &&
    'error' in candidate
  )
}

function toApiClientError(
  code: string,
  message: string,
  status?: number,
): ApiClientError {
  return new ApiClientError(code, message, status)
}

function fromApiResponseBody(
  body: ApiResponse<unknown>,
  status?: number,
): ApiClientError {
  return toApiClientError(
    body.error?.code ?? 'UNKNOWN_ERROR',
    body.error?.message ?? '알 수 없는 오류가 발생했습니다.',
    status,
  )
}

http.interceptors.response.use(
  (response) => {
    const body = response.data

    if (isApiResponse(body) && !body.success) {
      return Promise.reject(fromApiResponseBody(body, response.status))
    }

    return response
  },
  (error: unknown) => {
    if (isAxiosError(error)) {
      if (error.response) {
        const body = error.response.data

        if (isApiResponse(body)) {
          return Promise.reject(
            fromApiResponseBody(body, error.response.status),
          )
        }

        return Promise.reject(
          toApiClientError(
            'UNKNOWN_ERROR',
            '알 수 없는 오류가 발생했습니다.',
            error.response.status,
          ),
        )
      }

      if (
        error.code === 'ERR_NETWORK' ||
        error.code === 'ECONNABORTED' ||
        !error.response
      ) {
        return Promise.reject(
          toApiClientError('NETWORK_ERROR', '서버에 연결할 수 없습니다.'),
        )
      }
    }

    return Promise.reject(
      toApiClientError('UNKNOWN_ERROR', '알 수 없는 오류가 발생했습니다.'),
    )
  },
)

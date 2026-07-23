export class ApiClientError extends Error {
  readonly code: string
  readonly status?: number

  constructor(code: string, message: string, status?: number) {
    super(message)
    this.name = 'ApiClientError'
    this.code = code
    this.status = status
  }
}

import { useEffect, useState } from 'react'
import { ApiClientError } from '../api/ApiClientError'
import { getHealth } from '../api/health'

type ConnectionState =
  | { status: 'loading' }
  | { status: 'success'; service: string }
  | { status: 'error'; message?: string }

export default function HomePage() {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    status: 'loading',
  })

  useEffect(() => {
    const controller = new AbortController()

    const checkHealth = async () => {
      try {
        const data = await getHealth(controller.signal)
        setConnectionState({ status: 'success', service: data.service })
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        const message =
          error instanceof ApiClientError ? error.message : undefined
        setConnectionState({ status: 'error', message })
      }
    }

    void checkHealth()

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <section className="page">
      <h1>Home</h1>
      <p>Football Hub에 오신 것을 환영합니다.</p>
      {connectionState.status === 'loading' && (
        <p>Checking backend connection...</p>
      )}
      {connectionState.status === 'success' && (
        <p>✅ Backend Connected: {connectionState.service}</p>
      )}
      {connectionState.status === 'error' && (
        <>
          <p>❌ Backend connection failed</p>
          {connectionState.message && (
            <p className="page__error-detail">{connectionState.message}</p>
          )}
        </>
      )}
    </section>
  )
}

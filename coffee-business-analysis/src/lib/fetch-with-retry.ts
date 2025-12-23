/**
 * FETCH WRAPPER WITH RETRY LOGIC
 * 
 * src/lib/fetch-with-retry.ts
 * Automatically retries failed requests
 */

interface FetchOptions extends RequestInit {
  retries?: number
  retryDelay?: number
  onRetry?: (attempt: number, error: Error) => void
}

export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    retries = 3,
    retryDelay = 1000,
    onRetry,
    ...fetchOptions
  } = options

  let lastError: Error

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions)

      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        return response
      }

      // Return successful responses
      if (response.ok) {
        return response
      }

      // Throw on server errors (5xx) to trigger retry
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')

      // Don't retry on last attempt
      if (attempt === retries) {
        break
      }

      // Call retry callback
      if (onRetry) {
        onRetry(attempt + 1, lastError)
      }

      // Wait before retrying (exponential backoff)
      const delay = retryDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))

      console.log(`Retry attempt ${attempt + 1}/${retries} after ${delay}ms`)
    }
  }

  throw lastError!
}

// Convenience wrapper with JSON parsing
export async function fetchJSON<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, options)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(error.error || error.message || 'Request failed')
  }

  return response.json()
}

// Example usage in your components:
/*
import { fetchJSON } from '@/lib/fetch-with-retry'

// In your component
const loadData = async () => {
  try {
    const data = await fetchJSON('/api/customers', {
      retries: 3,
      onRetry: (attempt) => {
        toast.loading(`Retrying... (${attempt}/3)`)
      }
    })
    setCustomers(data)
  } catch (error) {
    toast.error('Failed to load customers')
  }
}
*/
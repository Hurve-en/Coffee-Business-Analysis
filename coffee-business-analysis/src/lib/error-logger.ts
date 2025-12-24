/**
 * ERROR LOGGER
 * 
 * 
 * Track and log errors with context
 */

interface ErrorLog {
  message: string
  stack?: string
  timestamp: number
  url?: string
  userAgent?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  context?: Record<string, any>
}

class ErrorLogger {
  private errors: ErrorLog[] = []
  private maxErrors = 50

  /**
   * Log an error
   */
  logError(
    error: Error | string,
    severity: ErrorLog['severity'] = 'medium',
    context?: Record<string, any>
  ) {
    const errorLog: ErrorLog = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      severity,
      context,
    }

    this.errors.push(errorLog)

    // Keep only last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift()
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`🐛 [${severity.toUpperCase()}]`, errorLog.message, context)
      if (errorLog.stack) {
        console.error(errorLog.stack)
      }
    }

    // Send to error tracking service
    this.sendToErrorService(errorLog)
  }

  /**
   * Log API error
   */
  logApiError(endpoint: string, error: any, statusCode?: number) {
    this.logError(
      error,
      statusCode && statusCode >= 500 ? 'high' : 'medium',
      {
        type: 'api_error',
        endpoint,
        statusCode,
      }
    )
  }

  /**
   * Log network error
   */
  logNetworkError(url: string, error: any) {
    this.logError(
      error,
      'high',
      {
        type: 'network_error',
        url,
      }
    )
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit = 20) {
    return this.errors.slice(-limit)
  }

  /**
   * Get error stats
   */
  getStats() {
    const stats = {
      total: this.errors.length,
      bySeverity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      },
      recent: this.errors.slice(-5),
    }

    this.errors.forEach(error => {
      stats.bySeverity[error.severity]++
    })

    return stats
  }

  /**
   * Clear all errors
   */
  clear() {
    this.errors = []
  }

  /**
   * Send to error tracking service
   */
  private sendToErrorService(error: ErrorLog) {
    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // Example:
    // if (error.severity === 'high' || error.severity === 'critical') {
    //   fetch('/api/errors', {
    //     method: 'POST',
    //     body: JSON.stringify(error)
    //   })
    // }
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger()

// Global error handlers
if (typeof window !== 'undefined') {
  // Catch unhandled errors
  window.addEventListener('error', (event) => {
    errorLogger.logError(
      event.error || event.message,
      'high',
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      }
    )
  })

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorLogger.logError(
      event.reason,
      'high',
      {
        type: 'unhandled_promise_rejection',
      }
    )
  })
}
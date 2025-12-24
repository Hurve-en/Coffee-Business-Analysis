/**
 * PERFORMANCE MONITOR
 * 
 * 
 * Track page load times and performance metrics
 */

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  url?: string
  userAgent?: string
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private maxMetrics = 100 // Keep last 100 metrics

  /**
   * Track page load performance
   */
  trackPageLoad(pageName: string) {
    if (typeof window === 'undefined') return

    try {
      // Wait for page to fully load
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        if (navigation) {
          this.recordMetric('page_load', navigation.loadEventEnd - navigation.fetchStart, pageName)
          this.recordMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart, pageName)
          this.recordMetric('first_paint', navigation.responseEnd - navigation.fetchStart, pageName)
        }
      })
    } catch (error) {
      console.error('Performance tracking error:', error)
    }
  }

  /**
   * Track API call performance
   */
  async trackApiCall<T>(
    name: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now()
    
    try {
      const result = await apiCall()
      const duration = performance.now() - startTime
      
      this.recordMetric('api_call', duration, name)
      
      return result
    } catch (error) {
      const duration = performance.now() - startTime
      this.recordMetric('api_error', duration, name)
      throw error
    }
  }

  /**
   * Track custom metric
   */
  recordMetric(name: string, value: number, label?: string) {
    const metric: PerformanceMetric = {
      name: label ? `${name}_${label}` : name,
      value: Math.round(value),
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.pathname : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    }

    this.metrics.push(metric)

    // Keep only last maxMetrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance: ${metric.name} = ${metric.value}ms`)
    }

    // Send to analytics service (implement later)
    this.sendToAnalytics(metric)
  }

  /**
   * Get performance stats
   */
  getStats() {
    const stats: Record<string, { avg: number; min: number; max: number; count: number }> = {}

    this.metrics.forEach(metric => {
      if (!stats[metric.name]) {
        stats[metric.name] = {
          avg: 0,
          min: Infinity,
          max: -Infinity,
          count: 0,
        }
      }

      const stat = stats[metric.name]
      stat.count++
      stat.min = Math.min(stat.min, metric.value)
      stat.max = Math.max(stat.max, metric.value)
      stat.avg = ((stat.avg * (stat.count - 1)) + metric.value) / stat.count
    })

    return stats
  }

  /**
   * Get recent metrics
   */
  getRecentMetrics(limit = 20) {
    return this.metrics.slice(-limit)
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = []
  }

  /**
   * Send to analytics service
   */
  private sendToAnalytics(metric: PerformanceMetric) {
    // TODO: Send to your analytics service (Google Analytics, Mixpanel, etc.)
    // Example:
    // fetch('/api/analytics/performance', {
    //   method: 'POST',
    //   body: JSON.stringify(metric)
    // })
  }

  /**
   * Track Web Vitals
   */
  trackWebVitals() {
    if (typeof window === 'undefined') return

    // Track Core Web Vitals
    try {
      // Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        
        if (lastEntry) {
          this.recordMetric('lcp', lastEntry.renderTime || lastEntry.loadTime)
        }
      })
      observer.observe({ type: 'largest-contentful-paint', buffered: true })

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.recordMetric('fid', entry.processingStart - entry.startTime)
        })
      })
      fidObserver.observe({ type: 'first-input', buffered: true })

      // Cumulative Layout Shift (CLS)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        this.recordMetric('cls', clsValue * 1000) // Convert to ms
      })
      clsObserver.observe({ type: 'layout-shift', buffered: true })
    } catch (error) {
      console.error('Web Vitals tracking error:', error)
    }
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Auto-track web vitals on client
if (typeof window !== 'undefined') {
  performanceMonitor.trackWebVitals()
}
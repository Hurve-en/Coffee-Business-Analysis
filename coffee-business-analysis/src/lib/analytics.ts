/**
 * ANALYTICS TRACKER
 * 
 * 
 * Track user events and actions
 */

interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp: number
  url?: string
  userId?: string
}

class Analytics {
  private events: AnalyticsEvent[] = []
  private maxEvents = 100

  /**
   * Track an event
   */
  track(name: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.pathname : undefined,
    }

    this.events.push(event)

    // Keep only last maxEvents
    if (this.events.length > this.maxEvents) {
      this.events.shift()
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📈 Analytics: ${name}`, properties)
    }

    // Send to analytics service
    this.sendToAnalytics(event)
  }

  /**
   * Track page view
   */
  trackPageView(pageName: string) {
    this.track('page_view', { page: pageName })
  }

  /**
   * Track button click
   */
  trackClick(buttonName: string, context?: Record<string, any>) {
    this.track('button_click', { button: buttonName, ...context })
  }

  /**
   * Track form submission
   */
  trackFormSubmit(formName: string, success: boolean) {
    this.track('form_submit', { form: formName, success })
  }

  /**
   * Track feature usage
   */
  trackFeature(featureName: string, action: string) {
    this.track('feature_usage', { feature: featureName, action })
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit = 20) {
    return this.events.slice(-limit)
  }

  /**
   * Get event stats
   */
  getStats() {
    const eventCounts: Record<string, number> = {}

    this.events.forEach(event => {
      eventCounts[event.name] = (eventCounts[event.name] || 0) + 1
    })

    return {
      total: this.events.length,
      byName: eventCounts,
      recent: this.events.slice(-10),
    }
  }

  /**
   * Clear all events
   */
  clear() {
    this.events = []
  }

  /**
   * Send to analytics service
   */
  private sendToAnalytics(event: AnalyticsEvent) {
    // TODO: Send to analytics service (Google Analytics, Mixpanel, PostHog, etc.)
    // Example for Google Analytics:
    // if (typeof window !== 'undefined' && (window as any).gtag) {
    //   (window as any).gtag('event', event.name, event.properties)
    // }

    // Example for custom endpoint:
    // fetch('/api/analytics/events', {
    //   method: 'POST',
    //   body: JSON.stringify(event)
    // })
  }
}

// Export singleton instance
export const analytics = new Analytics()

// Helper functions for common events
export const trackEvent = {
  customerCreated: () => analytics.track('customer_created'),
  customerUpdated: () => analytics.track('customer_updated'),
  customerDeleted: () => analytics.track('customer_deleted'),
  
  productCreated: () => analytics.track('product_created'),
  productUpdated: () => analytics.track('product_updated'),
  productDeleted: () => analytics.track('product_deleted'),
  
  orderCreated: (total: number) => analytics.track('order_created', { total }),
  orderUpdated: () => analytics.track('order_updated'),
  orderDeleted: () => analytics.track('order_deleted'),
  
  dataImported: (type: string, count: number) => 
    analytics.track('data_imported', { type, count }),
  
  dataExported: (type: string) => 
    analytics.track('data_exported', { type }),
  
  reportViewed: (reportType: string) => 
    analytics.track('report_viewed', { type: reportType }),
}
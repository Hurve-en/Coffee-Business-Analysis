/**
 * HEALTH CHECK API
 * 
 * 
 * Monitor system health
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const startTime = Date.now()
  
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: 'unknown',
      memory: 'unknown',
    },
    responseTime: 0,
  }

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    health.checks.database = 'healthy'
  } catch (error) {
    health.checks.database = 'unhealthy'
    health.status = 'degraded'
  }

  // Check memory usage
  if (typeof process.memoryUsage === 'function') {
    const memory = process.memoryUsage()
    const memoryUsageMB = Math.round(memory.heapUsed / 1024 / 1024)
    
    health.checks.memory = memoryUsageMB < 500 ? 'healthy' : 'warning'
    
    if (memoryUsageMB > 1000) {
      health.checks.memory = 'unhealthy'
      health.status = 'degraded'
    }
  }

  health.responseTime = Date.now() - startTime

  return NextResponse.json(health, {
    status: health.status === 'healthy' ? 200 : 503,
  })
}
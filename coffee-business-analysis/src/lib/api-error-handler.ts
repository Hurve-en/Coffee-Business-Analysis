/**
 * API ERROR HANDLER UTILITY
 * 
 * src/lib/api-error-handler.ts
 * Standardized error handling for API routes
 */

import { NextResponse } from 'next/server'

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error)

  // Handle known ApiError
  if (error instanceof ApiError) {
    return NextResponse.json(
      { 
        error: error.message,
        code: error.code 
      },
      { status: error.statusCode }
    )
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: any }
    
    switch (prismaError.code) {
      case 'P2002':
        return NextResponse.json(
          { error: 'A record with this value already exists' },
          { status: 409 }
        )
      case 'P2025':
        return NextResponse.json(
          { error: 'Record not found' },
          { status: 404 }
        )
      case 'P2003':
        return NextResponse.json(
          { error: 'Foreign key constraint failed' },
          { status: 400 }
        )
      default:
        return NextResponse.json(
          { error: 'Database error occurred' },
          { status: 500 }
        )
    }
  }

  // Handle generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  // Unknown error
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  )
}

// User-friendly error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You must be logged in to perform this action',
  FORBIDDEN: 'You do not have permission to access this resource',
  NOT_FOUND: 'The requested resource was not found',
  VALIDATION_ERROR: 'Please check your input and try again',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later',
  NETWORK_ERROR: 'Network error. Please check your connection',
  RATE_LIMIT: 'Too many requests. Please try again later',
}

// Helper to create standardized errors
export function createError(statusCode: number, message: string, code?: string) {
  return new ApiError(statusCode, message, code)
}
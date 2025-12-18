/**
 * PRISMA CLIENT SINGLETON
 * 
 * This file creates a single Prisma Client instance that's reused across your entire app.
 * 
 * WHY DO WE NEED THIS?
 * - In development, Next.js hot-reloads code frequently
 * - Without this pattern, you'd create dozens of database connections
 * - Too many connections = database crashes
 * - This singleton pattern ensures only ONE connection exists
 * 
 * HOW IT WORKS:
 * 1. Check if Prisma Client already exists in global scope
 * 2. If yes, reuse it
 * 3. If no, create a new one
 * 4. Store it globally so next hot-reload finds it
 * 
 * USAGE IN YOUR CODE:
 * import { prisma } from '@/lib/prisma'
 * const customers = await prisma.customer.findMany()
 */

import { PrismaClient } from '@prisma/client'

// Extend the global namespace to include our prisma instance
// This prevents TypeScript from complaining about global.prisma
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

/**
 * Create the Prisma Client instance
 * 
 * In production: Create new instance every time
 * In development: Reuse existing instance from global scope
 * 
 * Why the difference?
 * - Production runs once, no hot-reload
 * - Development hot-reloads constantly, would create too many connections
 */
export const prisma = global.prisma || new PrismaClient()

/**
 * In development, store the client in global scope
 * This survives hot-reloads and prevents connection spam
 */
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

/**
 * LEARNING NOTES:
 * 
 * 1. What is a singleton?
 *    A pattern that ensures only ONE instance of something exists
 * 
 * 2. Why global.prisma?
 *    The global object persists between hot-reloads in development
 * 
 * 3. When is this file imported?
 *    Every time you import { prisma } from '@/lib/prisma'
 * 
 * 4. Can I modify this?
 *    Rarely needed. This is a standard Next.js + Prisma pattern.
 * 
 * 5. What if I get "too many connections" error?
 *    - Check your DATABASE_URL in .env
 *    - Make sure you're using this file, not creating new PrismaClient() elsewhere
 *    - Consider connection pooling if needed
 * 
 * COMMON MISTAKES TO AVOID:
 * ❌ Don't do: const prisma = new PrismaClient() in multiple files
 * ✅ Do: import { prisma } from '@/lib/prisma' everywhere
 * 
 * ❌ Don't do: Create PrismaClient in API routes directly
 * ✅ Do: Use this singleton everywhere
 */

/**
 * EXAMPLE USAGE:
 * 
 * In an API route:
 * ```typescript
 * import { prisma } from '@/lib/prisma'
 * 
 * export async function GET() {
 *   const customers = await prisma.customer.findMany()
 *   return Response.json(customers)
 * }
 * ```
 * 
 * In a Server Component:
 * ```typescript
 * import { prisma } from '@/lib/prisma'
 * 
 * export default async function Page() {
 *   const products = await prisma.product.findMany()
 *   return <div>{products.map(p => p.name)}</div>
 * }
 * ```
 */
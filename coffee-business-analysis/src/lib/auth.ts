/**
 * NEXTAUTH CONFIGURATION
 * 
 * Handles authentication logic
 */

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error('No user found with this email')
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        // Return user object (will be stored in session)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  
  session: {
    strategy: 'jwt', // Use JWT for sessions
  },

  pages: {
    signIn: '/auth/login', // Custom login page
  },

  callbacks: {
    async jwt({ token, user }) {
      // Add user ID to token when user logs in
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      // Add user ID to session
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
}
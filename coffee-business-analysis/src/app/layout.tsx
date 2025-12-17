/**
 * ROOT LAYOUT
 * 
 * This is the top-level layout that wraps ALL pages in the application
 * 
 * What it does:
 * - Sets up HTML structure
 * - Loads fonts
 * - Imports global CSS
 * - Defines metadata (SEO)
 * - Wraps all pages with consistent structure
 * 
 * This file is REQUIRED by Next.js 14 App Router
 */

import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css' // Global CSS import (relative path ensures the file is resolved from `src/app`)

/**
 * FONT CONFIGURATION
 * 
 * We use two fonts for typography hierarchy:
 * 
 * 1. Inter - Modern sans-serif for body text
 *    - Clean and readable
 *    - Excellent for UI elements, paragraphs, buttons
 *    - Variable font = loads only weights you need
 * 
 * 2. Playfair Display - Elegant serif for headings (optional)
 *    - Adds sophistication
 *    - Great for titles and important text
 *    - We don't use it here but you can add it for variety
 * 
 * Why Inter?
 * - Professional and modern
 * - Excellent readability at all sizes
 * - Widely used in modern web apps
 * - Variable font = better performance
 */

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Shows fallback font while loading for better performance
  variable: '--font-inter', // Creates CSS variable we can use
})

// Optional: Elegant serif font for headings
// Uncomment if you want to use it for titles
/*
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
})
*/

/**
 * METADATA
 * 
 * This defines how your site appears in:
 * - Browser tabs (title)
 * - Search engine results (description)
 * - Social media shares (Open Graph)
 * - Google search results
 * 
 * SEO Impact: Very important!
 */

export const metadata: Metadata = {
  // Page title - appears in browser tab
  title: 'Coffee Business Analysis - Data-Driven Insights for Coffee Shops',
  
  // Meta description - appears in Google search results
  // Keep it under 160 characters for best results
  description: 'Comprehensive business analytics platform for coffee shops. Track sales, manage customers, analyze performance, and make data-driven decisions to grow your business.',
  
  // Keywords for SEO (less important now but still useful)
  keywords: [
    'coffee business',
    'coffee shop analytics',
    'sales tracking',
    'business intelligence',
    'customer management',
    'inventory management',
    'financial reports',
    'coffee shop software'
  ],
  
  // Author information
  authors: [{ name: 'Coffee Business Analysis Team' }],
  
  // Open Graph metadata - for social media sharing
  // When someone shares your site on Facebook, Twitter, etc.
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com', // Update with your actual domain
    title: 'Coffee Business Analysis Platform',
    description: 'Transform your coffee business with powerful analytics and insights',
    siteName: 'Coffee Business Analysis',
    // Add an image later for better social sharing
    // images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  
  // Twitter Card metadata - how it looks when shared on Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Coffee Business Analysis Platform',
    description: 'Data-driven insights for coffee businesses',
    // images: ['/twitter-image.png'], // Add later
  },
  
  // Robots - tell search engines how to crawl your site
  robots: {
    index: true, // Allow indexing in search results
    follow: true, // Allow following links
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

/**
 * ROOT LAYOUT COMPONENT
 * 
 * This wraps every page in your application
 * Think of it as the "shell" that contains everything
 * 
 * Props:
 * @param {React.ReactNode} children - The page content that gets inserted here
 * 
 * Structure:
 * <html>
 *   <body>
 *     {children} ← Your pages render here
 *   </body>
 * </html>
 */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      {/*
        HTML ATTRIBUTES:
        - lang="en" = Tells browsers and screen readers the language
        - className = Applies our font CSS variable to entire app
      */}
      
      <body className={inter.className}>
        {/*
          BODY ATTRIBUTES:
          - className = Applies Inter font to all text by default
          
          The {children} is where your pages get rendered:
          - Home page (page.tsx)
          - Dashboard pages
          - Any other pages you create
        */}
        
        {children}
        
        {/*
          FUTURE: You can add components here that appear on every page:
          - Navigation bar
          - Footer
          - Toast notifications
          - Analytics scripts
          
          Example:
          <Navbar />
          {children}
          <Footer />
        */}
      </body>
    </html>
  )
}

/**
 * LEARNING NOTES:
 * 
 * 1. Why do we need layout.tsx?
 *    - Next.js 14 App Router requires it
 *    - Provides consistent structure across all pages
 *    - Loads fonts and CSS once (better performance)
 * 
 * 2. What's the difference between layout and page?
 *    - layout.tsx = Wrapper/shell (navbar, footer, structure)
 *    - page.tsx = Actual page content
 * 
 * 3. Can I have multiple layouts?
 *    - Yes! You can nest layouts in folders
 *    - Example: app/dashboard/layout.tsx for dashboard-only layout
 * 
 * 4. When should I edit this file?
 *    - Adding global navigation
 *    - Changing fonts
 *    - Updating SEO metadata
 *    - Adding analytics (Google Analytics, etc.)
 *    - Adding global components (modals, toasts)
 * 
 * 5. What NOT to put here?
 *    - Page-specific content (use page.tsx)
 *    - useState or interactive logic (layouts are Server Components)
 *    - Heavy JavaScript (keep layouts light)
 */
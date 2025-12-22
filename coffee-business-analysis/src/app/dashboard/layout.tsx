/**
 * DASHBOARD LAYOUT WITH AUTHENTICATION
 * 
 * Updated with log out button and user info
 * 
 * This layout wraps ALL dashboard pages (/dashboard/*)
 * Provides consistent navigation and structure
 * 
 * STRUCTURE:
 * - Left sidebar with navigation links
 * - Top navbar with user info
 * - Main content area where pages render
 * - Mobile-responsive hamburger menu
 * 
 * FEATURES:
 * - Smooth animations
 * - Active link highlighting
 * - Collapsible on mobile
 * - Slate gray minimalist design
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Coffee, 
  ShoppingCart,
  FileText,
  Menu,
  X,
  LogOut,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Overview',
    href: '/dashboard/overview',
    icon: LayoutDashboard,
  },
  {
    name: 'Sales',
    href: '/dashboard/sales',
    icon: TrendingUp,
  },
  {
    name: 'Customers',
    href: '/dashboard/customers',
    icon: Users,
  },
  {
    name: 'Products',
    href: '/dashboard/products',
    icon: Coffee,
  },
  {
    name: 'Orders',
    href: '/dashboard/orders',
    icon: ShoppingCart,
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      signOut({ callbackUrl: '/auth/login' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* SIDEBAR - Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-slate-800 to-slate-900 overflow-y-auto">
          
          {/* Logo/Brand */}
          <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-slate-700">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CITA</h1>
                <p className="text-xs text-slate-400">Business Analytics</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-slate-700 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  )}
                >
                  <Icon className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    isActive && 'scale-110',
                    !isActive && 'group-hover:scale-110'
                  )} />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1 h-6 bg-white rounded-full" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Profile Section */}
          <div className="flex-shrink-0 border-t border-slate-700 p-4">
            {session?.user && (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-700/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-semibold">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </aside>

      {/* MOBILE MENU BUTTON */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">CITA</span>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-gradient-to-b from-slate-800 to-slate-900 animate-slide-in">
            
            <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-slate-700">
              <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">CITA</h1>
                  <p className="text-xs text-slate-400">Business Analytics</p>
                </div>
              </Link>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-slate-700 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-1 h-6 bg-white rounded-full" />
                    )}
                  </Link>
                )
              })}
            </nav>

            <div className="flex-shrink-0 border-t border-slate-700 p-4">
              {session?.user && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-700/50">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-semibold">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

          </aside>
        </>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="lg:pl-72 pt-16 lg:pt-0">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

    </div>
  )
}

/**
 * LEARNING NOTES:
 * 
 * 1. What is 'use client'?
 *    This makes it a Client Component (can use useState, onClick, etc.)
 *    Without it, Next.js treats it as Server Component
 * 
 * 2. Why usePathname()?
 *    Tells us which page we're on so we can highlight active link
 * 
 * 3. What is cn() doing?
 *    Merging Tailwind classes and handling active/inactive states
 * 
 * 4. How does mobile menu work?
 *    - useState tracks if menu is open
 *    - Button toggles the state
 *    - Sidebar shows/hides based on state
 *    - Backdrop closes menu when clicked
 * 
 * 5. What's with lg: prefix?
 *    Tailwind responsive prefixes:
 *    - No prefix = mobile
 *    - lg: = large screens (1024px+)
 *    - Example: "hidden lg:flex" = hide on mobile, show on desktop
 * 
 * 6. How to add a new page?
 *    Just add to the navigation array at the top!
 * 
 * 7. Can I change colors?
 *    Yes! Search for slate-800, slate-700, etc. and change to your color
 * 
 * 8. What if I want a different logo?
 *    Replace the Coffee icon and text in the logo section
 */

/**
 * CUSTOMIZATION IDEAS:
 * 
 * - Add user dropdown menu (logout, settings, profile)
 * - Add notifications bell icon in top navbar
 * - Add search bar in top navbar
 * - Add breadcrumbs showing current location
 * - Add collapsible sidebar on desktop
 * - Add dark/light mode toggle
 * - Add badges showing new items (Orders: 5)
 */
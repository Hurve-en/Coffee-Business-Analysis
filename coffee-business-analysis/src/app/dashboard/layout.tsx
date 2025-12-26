'use client'

/**
 * ENHANCED DASHBOARD LAYOUT
 * 
 * NEW FEATURES:
 * - ✅ Collapsible sidebar (toggle button)
 * - ✅ Saves preference to localStorage
 * - ✅ Smooth animations
 * - ✅ Keeps your existing slate theme
 * - ✅ Mobile responsive (unchanged)
 * - ✅ User info and logout (unchanged)
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
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
  ChevronLeft,
  ChevronRight
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { data: session } = useSession()

  // Load sidebar state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    if (saved !== null) {
      setSidebarCollapsed(JSON.parse(saved))
    }
  }, [])

  // Save sidebar state to localStorage
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState))
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      signOut({ callbackUrl: '/auth/login' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* SIDEBAR - Desktop */}
      <aside 
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "lg:w-20" : "lg:w-72"
        )}
      >
        <div className="flex flex-col flex-grow bg-gradient-to-b from-slate-800 to-slate-900 overflow-y-auto">
          
          {/* Logo/Brand */}
          <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-slate-700">
            {sidebarCollapsed ? (
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center mx-auto group hover:scale-110 transition-transform">
                <Coffee className="w-6 h-6 text-white" />
              </div>
            ) : (
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">CITA</h1>
                  <p className="text-xs text-slate-400">Business Analytics</p>
                </div>
              </Link>
            )}
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
                    sidebarCollapsed && 'justify-center',
                    isActive
                      ? 'bg-slate-700 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  )}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <Icon className={cn(
                    'w-5 h-5 transition-transform duration-200 flex-shrink-0',
                    isActive && 'scale-110',
                    !isActive && 'group-hover:scale-110'
                  )} />
                  {!sidebarCollapsed && (
                    <>
                      <span>{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-1 h-6 bg-white rounded-full" />
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Profile Section */}
          <div className="flex-shrink-0 border-t border-slate-700 p-4">
            {session?.user && (
              <div className="space-y-2">
                {sidebarCollapsed ? (
                  <>
                    {/* Collapsed - Avatar Only */}
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-semibold mx-auto cursor-pointer hover:scale-110 transition-transform" title={session.user.name || 'User'}>
                      {session.user.name?.charAt(0).toUpperCase()}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-slate-300 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    {/* Expanded - Full Info */}
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
                  </>
                )}
              </div>
            )}
          </div>

          {/* Toggle Button (Inside Sidebar) */}
          <div className="flex-shrink-0 border-t border-slate-700 p-4">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span>Collapse</span>
                </>
              )}
            </button>
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
      <main 
        className={cn(
          "transition-all duration-300 ease-in-out pt-16 lg:pt-0",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
        )}
      >
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* FLOATING TOGGLE BUTTON (Optional - Desktop Only) */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "hidden lg:flex fixed bottom-8 z-40",
          "items-center justify-center",
          "w-10 h-10 bg-white border-2 border-slate-300 rounded-full",
          "shadow-lg hover:shadow-xl hover:scale-110",
          "transition-all duration-300",
          sidebarCollapsed ? "left-16" : "left-60"
        )}
        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-5 h-5 text-slate-700" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        )}
      </button>

    </div>
  )
}

/**
 * NEW FEATURES ADDED:
 * 
 * 1. Collapsible Sidebar
 *    - Click "Collapse" button at bottom of sidebar
 *    - OR click floating button (bottom-left)
 *    - Sidebar shrinks to icon-only mode
 *    - Saves your preference to localStorage
 * 
 * 2. Icon-Only Mode
 *    - Shows only icons when collapsed
 *    - Hover shows tooltips with page names
 *    - Avatar shows user initial
 *    - Space-efficient for smaller screens
 * 
 * 3. Smooth Animations
 *    - Sidebar width transitions smoothly
 *    - Content area adjusts automatically
 *    - Icons and text fade in/out
 * 
 * 4. Persistent State
 *    - Remembers if you collapsed it
 *    - Saves to localStorage
 *    - Restores on page refresh
 * 
 * 5. Mobile Unchanged
 *    - Mobile menu works exactly the same
 *    - No changes to mobile experience
 *    - Toggle only appears on desktop
 */

/**
 * HOW TO USE:
 * 
 * Desktop:
 * - Click "Collapse" at bottom of sidebar
 * - Or click floating button (left side)
 * - Sidebar shrinks to icons only
 * - Click again to expand
 * 
 * Mobile:
 * - Works exactly as before
 * - Hamburger menu (unchanged)
 * 
 * Customization:
 * - Change collapsed width: lg:w-20 (currently 20 = 5rem)
 * - Change expanded width: lg:w-72 (currently 72 = 18rem)
 * - Remove floating button: delete the button at the end
 * - Add keyboard shortcut: add useEffect with keyboard listener
 */
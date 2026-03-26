'use client'

import { useState, useCallback, memo } from 'react'
import { Heart, User as UserIcon, LogOut, Settings, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'

const Navigation = memo(function Navigation() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleLogout = useCallback(() => {
    logout()
    router.push('/')
    setShowUserMenu(false)
  }, [logout, router])

  const handleUserMenuToggle = useCallback(() => {
    setShowUserMenu(prev => !prev)
  }, [])

  const handleMobileMenuToggle = useCallback(() => {
    setShowMobileMenu(prev => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setShowMobileMenu(false)
  }, [])

  const closeUserMenu = useCallback(() => {
    setShowUserMenu(false)
  }, [])

  return (
    <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl z-50 border-b-2 border-white/80 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 charity-bg-gradient rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 transform transition-transform hover:scale-110 active:scale-95">
              <Heart className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <span className="text-xl font-bold text-gray-900">GolfHeart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors fast-click">
              How It Works
            </Link>
            <Link href="/charities" className="text-gray-600 hover:text-primary-600 transition-colors fast-click">
              Charities
            </Link>
            <Link href="/#prizes" className="text-gray-600 hover:text-primary-600 transition-colors fast-click">
              Prizes
            </Link>

            {isLoading ? (
              /* Loading state */
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : user ? (
              /* Logged in user menu */
              <div className="relative">
                <button
                  onClick={handleUserMenuToggle}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors fast-click"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4 text-primary-600" />
                    )}
                  </div>
                  <span className="font-medium">{user.firstName}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-green-600 capitalize">{user.subscriptionStatus} • {user.subscriptionPlan}</p>
                    </div>
                    
                    <Link 
                      href={user.email === 'admin@golfheart.com' ? '/admin' : '/dashboard'} 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={closeUserMenu}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {user.email === 'admin@golfheart.com' ? 'Admin Dashboard' : 'Dashboard'}
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Not logged in */
              <>
                <Link href="/login" className="text-gray-600 hover:text-primary-600 transition-colors fast-click">
                  Login
                </Link>
                <Link href="/signup" className="btn-primary fast-click">
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={handleMobileMenuToggle}
            className="md:hidden p-2 text-gray-600 hover:text-primary-600 fast-click"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/how-it-works" 
                className="text-gray-600 hover:text-primary-600 transition-colors"
                onClick={closeMobileMenu}
              >
                How It Works
              </Link>
              <Link 
                href="/charities" 
                className="text-gray-600 hover:text-primary-600 transition-colors"
                onClick={closeMobileMenu}
              >
                Charities
              </Link>
              <Link 
                href="/#prizes" 
                className="text-gray-600 hover:text-primary-600 transition-colors"
                onClick={closeMobileMenu}
              >
                Prizes
              </Link>

              {isLoading ? (
                /* Loading state for mobile */
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ) : user ? (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center">
                      {user.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  
                  <Link 
                    href={user.email === 'admin@golfheart.com' ? '/admin' : '/dashboard'} 
                    className="flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-3"
                    onClick={closeMobileMenu}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {user.email === 'admin@golfheart.com' ? 'Admin Dashboard' : 'Dashboard'}
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <Link 
                    href="/login" 
                    className="block text-gray-600 hover:text-primary-600 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    className="btn-primary block text-center"
                    onClick={closeMobileMenu}
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
})

export default Navigation
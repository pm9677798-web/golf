'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        login(data.token, data.user)
        if (data.isAdmin) {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      } else {
        const error = await response.json()
        alert(error.message || 'Login failed')
      }
    } catch (error) {
      alert('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/50 rounded-full blur-[100px] -z-10 animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-charity-200/50 rounded-full blur-[100px] -z-10 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <Link href="/" className="inline-flex items-center justify-center btn-secondary px-4 py-2 mb-6 shadow-sm border-slate-200">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 charity-bg-gradient rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 transform hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <span className="text-3xl font-black text-slate-800 tracking-tight drop-shadow-sm">GolfHeart</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-3 drop-shadow-sm">Welcome Back</h1>
          <p className="text-lg text-slate-600 font-medium tracking-wide">Sign in to continue your golf journey</p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card p-10 border-2 border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field text-lg"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field pr-12 text-lg"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded border-2 border-slate-300 text-primary-600 focus:ring-primary-500 transition-colors" />
                <span className="ml-3 text-sm font-bold text-slate-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary text-xl mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-slate-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm font-bold text-slate-400 uppercase tracking-widest">Or</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/signup" className="w-full btn-secondary text-center block text-lg border-2 border-slate-200">
              Create New Account
            </Link>
          </div>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 p-6 bg-blue-50/80 backdrop-blur-sm rounded-2xl border-2 border-blue-100 shadow-inner"
        >
          <h3 className="font-bold text-blue-900 mb-3 flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-blue-600" />
            Demo Credentials
          </h3>
          <div className="text-sm font-medium text-blue-800 space-y-2">
            <p className="flex justify-between items-center bg-white/60 p-2 rounded-lg"><strong className="text-slate-600">User:</strong> <span>demo@golfheart.com / password123</span></p>
            <p className="flex justify-between items-center bg-white/60 p-2 rounded-lg"><strong className="text-slate-600">Admin:</strong> <span>admin@golfheart.com / admin123</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
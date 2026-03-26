'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/50 rounded-full blur-[100px] -z-10 animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-charity-200/50 rounded-full blur-[100px] -z-10 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 animate-slide-up">
          <Link href="/login" className="inline-flex items-center justify-center btn-secondary px-4 py-2 mb-6 shadow-sm border-slate-200">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Login
          </Link>
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 charity-bg-gradient rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-black text-slate-800 tracking-tight">GolfHeart</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-3">Reset Password</h1>
          <p className="text-lg text-slate-600 font-medium">We'll send you a link to reset your account</p>
        </div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="card p-10 border-2 border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field text-lg"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full btn-primary text-xl mt-4 flex items-center justify-center ${loading ? 'opacity-50' : ''}`}
              >
                {loading ? 'Sending...' : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Check your email</h3>
              <p className="text-slate-600">If an account exists for {email}, we've sent a password reset link.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-6 text-primary-600 font-bold hover:underline"
              >
                Try another email
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

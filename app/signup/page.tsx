'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'

export default function SignupPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    plan: 'monthly',
    charityId: '',
    charityContribution: 10
  })

  const [charities, setCharities] = useState([])
  const [loadingCharities, setLoadingCharities] = useState(false)

  // Fetch charities when component mounts
  useEffect(() => {
    const fetchCharities = async () => {
      setLoadingCharities(true)
      try {
        const response = await fetch('/api/charities')
        if (response.ok) {
          const data = await response.json()
          setCharities(data.charities)
        }
      } catch (error) {
        console.error('Error fetching charities:', error)
      } finally {
        setLoadingCharities(false)
      }
    }
    fetchCharities()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'charityContribution' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        // Use auth context to store login data
        login(data.token, data.user)
        router.push('/dashboard')
      } else {
        const error = await response.json()
        alert(error.message || 'Signup failed')
      }
    } catch (error) {
      alert('An error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
      case 2:
        return formData.plan
      case 3:
        return formData.charityId && formData.charityContribution >= 10
      default:
        return false
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
          <h1 className="text-4xl font-extrabold text-slate-800 mb-3 drop-shadow-sm">Join Our Community</h1>
          <p className="text-lg text-slate-600 font-medium tracking-wide">Start playing golf for a purpose</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  stepNum <= step ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNum < step ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    stepNum < step ? 'bg-primary-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Account</span>
            <span>Plan</span>
            <span>Charity</span>
          </div>
        </div>

        {/* Form */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="card p-10 border-2 border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
        >
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Your Account</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input-field pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Plan</h2>
                
                <div className="space-y-4">
                  {[
                    { id: 'monthly', name: 'Monthly', price: '$29.99', period: '/month', savings: null },
                    { id: 'yearly', name: 'Yearly', price: '$299.99', period: '/year', savings: 'Save $60!' }
                  ].map((plan) => (
                    <label key={plan.id} className="block">
                      <input
                        type="radio"
                        name="plan"
                        value={plan.id}
                        checked={formData.plan === plan.id}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.plan === plan.id 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                            {plan.savings && (
                              <p className="text-sm text-green-600 font-medium">{plan.savings}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">{plan.price}</p>
                            <p className="text-sm text-gray-500">{plan.period}</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">What's Included:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Monthly prize draws</li>
                    <li>• Unlimited score tracking</li>
                    <li>• Charity contributions</li>
                    <li>• Winner verification system</li>
                  </ul>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Charity</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Charity</label>
                  <select
                    name="charityId"
                    value={formData.charityId}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                    disabled={loadingCharities}
                  >
                    <option value="">
                      {loadingCharities ? 'Loading charities...' : 'Choose a charity...'}
                    </option>
                    {charities.map((charity: any) => (
                      <option key={charity.id} value={charity.id}>
                        {charity.name}
                      </option>
                    ))}
                  </select>
                  {formData.charityId && (
                    <p className="text-sm text-gray-600 mt-2">
                      {charities.find((c: any) => c.id === formData.charityId)?.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Charity Contribution: {formData.charityContribution}%
                  </label>
                  <input
                    type="range"
                    name="charityContribution"
                    min="10"
                    max="50"
                    value={formData.charityContribution}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10% (minimum)</span>
                    <span>50% (maximum)</span>
                  </div>
                </div>

                <div className="bg-charity-50 p-4 rounded-lg">
                  <h4 className="font-medium text-charity-900 mb-2">Your Impact:</h4>
                  <p className="text-sm text-charity-800">
                    {formData.charityContribution}% of your subscription (${
                      formData.plan === 'monthly' 
                        ? (29.99 * formData.charityContribution / 100).toFixed(2)
                        : (24.99 * formData.charityContribution / 100).toFixed(2)
                    } per month) will go directly to your chosen charity.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn-secondary"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={!validateStep() || loading}
                className={`btn-primary ${step === 1 ? 'w-full' : 'ml-auto'} ${
                  !validateStep() || loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Creating Account...' : step === 3 ? 'Create Account' : 'Continue'}
              </button>
            </div>
          </form>
        </motion.div>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, Trophy, Target, Calendar, 
  Plus, Edit, Check, X, LogOut, Settings, User as UserIcon
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import FastButton from '../../components/ui/FastButton'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  profileImageUrl?: string
  subscriptionStatus: string
  subscriptionPlan: string
  subscriptionEndDate: string
  selectedCharityId: string
  charityContributionPercentage: number
}

interface Score {
  id: string
  score: number
  scoreDate: string
}

interface Draw {
  id: string
  drawDate: string
  winningNumbers: number[]
  isPublished: boolean
}

interface Winner {
  id: string
  matchType: string
  prizeAmount: number
  verificationStatus: string
  paymentStatus: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user: authUser, token, logout, isLoading } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [scores, setScores] = useState<Score[]>([])
  const [upcomingDraw, setUpcomingDraw] = useState<Draw | null>(null)
  const [winnings, setWinnings] = useState<Winner[]>([])
  const [loading, setLoading] = useState(true)
  const [showScoreForm, setShowScoreForm] = useState(false)
  const [newScore, setNewScore] = useState({ score: '', date: '' })

  useEffect(() => {
    // Don't redirect during loading
    if (isLoading) return
    
    if (!authUser || !token) {
      router.push('/login')
      return
    }
    fetchUserData()
  }, [authUser, token, isLoading])

  const fetchUserData = useCallback(async () => {
    try {
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/user/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setScores(data.scores)
        setUpcomingDraw(data.upcomingDraw)
        setWinnings(data.winnings)
      } else {
        logout()
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      logout()
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [token, logout, router])

  const handleAddScore = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/user/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newScore)
      })

      if (response.ok) {
        setNewScore({ score: '', date: '' })
        setShowScoreForm(false)
        fetchUserData() // Refresh data
      }
    } catch (error) {
      console.error('Error adding score:', error)
    }
  }, [token, newScore, fetchUserData])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="content-card rounded-2xl p-8 text-center hover-lift">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const totalWinnings = winnings.reduce((sum, win) => sum + win.prizeAmount, 0)
  const nextDrawDate = new Date()
  nextDrawDate.setMonth(nextDrawDate.getMonth() + 1, 1)

  return (
    <div className="min-h-screen relative overflow-hidden pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-lg shadow-slate-200 flex items-center justify-center border-4 border-white transform hover:scale-105 transition-transform animate-slide-up">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-10 h-10 text-slate-300" />
              )}
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h1 className="text-4xl font-extrabold text-slate-800 drop-shadow-sm">Welcome back, {user.firstName}!</h1>
              <p className="text-lg text-slate-600 font-medium">Track scores, win prizes, and make a difference</p>
            </div>
          </div>
        </motion.div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Subscription</p>
                <p className={`text-lg font-semibold ${
                  user.subscriptionStatus === 'active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {user.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
                </p>
                <p className="text-xs text-gray-400">
                  {user.subscriptionPlan} plan
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                user.subscriptionStatus === 'active' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <Check className={`w-6 h-6 ${
                  user.subscriptionStatus === 'active' ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Scores Entered</p>
                <p className="text-2xl font-bold text-gray-900">{scores.length}/5</p>
                <p className="text-xs text-gray-400">Latest scores</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Winnings</p>
                <p className="text-2xl font-bold text-yellow-600">${totalWinnings.toFixed(2)}</p>
                <p className="text-xs text-gray-400">{winnings.length} prizes</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Charity Impact</p>
                <p className="text-2xl font-bold text-charity-600">{user.charityContributionPercentage}%</p>
                <p className="text-xs text-gray-400">of subscription</p>
              </div>
              <div className="w-14 h-14 bg-charity-100 rounded-2xl flex items-center justify-center shadow-inner">
                <Heart className="w-7 h-7 text-charity-600 drop-shadow-sm" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Score Management */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-6 mb-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Your Latest Scores</h2>
                <FastButton
                  onClick={() => setShowScoreForm(true)}
                  className="btn-primary flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Score
                </FastButton>
              </div>

              {showScoreForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 p-4 bg-gray-50 rounded-lg"
                >
                  <form onSubmit={handleAddScore} className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Score (1-45)</label>
                      <input
                        type="number"
                        min="1"
                        max="45"
                        value={newScore.score}
                        onChange={(e) => setNewScore(prev => ({ ...prev, score: e.target.value }))}
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={newScore.date}
                        onChange={(e) => setNewScore(prev => ({ ...prev, date: e.target.value }))}
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <button type="submit" className="btn-primary">
                        <Check className="w-4 h-4" />
                      </button>
                      <FastButton
                        onClick={() => setShowScoreForm(false)}
                        className="btn-secondary"
                      >
                        <X className="w-4 h-4" />
                      </FastButton>
                    </div>
                  </form>
                </motion.div>
              )}

              <div className="space-y-3">
                {scores.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No scores entered yet</p>
                    <p className="text-sm">Add your first score to start participating in draws</p>
                  </div>
                ) : (
                  scores.map((score, index) => (
                    <motion.div
                      key={score.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-primary-600">{score.score}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Score: {score.score}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(score.scoreDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {scores.length < 5 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> You need 5 scores to participate in monthly draws. 
                    You currently have {scores.length} score{scores.length !== 1 ? 's' : ''}.
                  </p>
                </div>
              )}
            </motion.div>

            {/* Next Draw */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Draw</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {nextDrawDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-gray-600">Monthly Prize Draw</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Estimated Prize Pool</p>
                  <p className="text-xl font-bold text-yellow-600">$15,000</p>
                </div>
              </div>
              
              {scores.length >= 5 ? (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    You're eligible for the next draw!
                  </p>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Add {5 - scores.length} more score{5 - scores.length !== 1 ? 's' : ''} to participate in the next draw.
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Winnings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Winnings</h3>
              {winnings.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No winnings yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {winnings.slice(0, 3).map((win, index) => (
                    <div key={win.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{win.matchType}</p>
                        <p className="text-sm text-gray-500">
                          {win.verificationStatus === 'approved' ? 'Verified' : 'Pending'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-600">${win.prizeAmount}</p>
                        <p className="text-xs text-gray-500">{win.paymentStatus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Charity Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Charity Impact</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Monthly Contribution</span>
                  <span className="font-semibold text-charity-600">
                    ${((user.subscriptionPlan === 'monthly' ? 29.99 : 24.99) * user.charityContributionPercentage / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Donated</span>
                  <span className="font-semibold text-charity-600">$127.50</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <Link href="/charities" className="text-charity-600 hover:text-charity-700 text-sm font-medium">
                    View Charity Details →
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/profile" className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 mr-3" />
                  Manage Profile
                </Link>
                <Link href="/charities" className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Heart className="w-5 h-5 mr-3" />
                  Change Charity
                </Link>
                <Link href="/history" className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Calendar className="w-5 h-5 mr-3" />
                  View History
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
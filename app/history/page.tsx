'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, Trophy, Target, ArrowLeft, 
  TrendingUp, Award, Clock, CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'

interface DrawEntry {
  id: string
  drawId: string
  userNumbers: number[]
  matches: number
  prizeAmount: number
  createdAt: string
  draw: {
    id: string
    drawDate: string
    drawType: string
    winningNumbers: number[]
    isPublished: boolean
    totalPrizePool: number
  }
}

interface Score {
  id: string
  score: number
  scoreDate: string
  createdAt: string
}

interface Winning {
  id: string
  matchType: string
  prizeAmount: number
  verificationStatus: string
  paymentStatus: string
  createdAt: string
  draw: {
    drawDate: string
    winningNumbers: number[]
    totalPrizePool: number
  }
}

interface Statistics {
  totalDrawsParticipated: number
  totalWinnings: number
  totalScoresEntered: number
  averageScore: number
}

export default function HistoryPage() {
  const router = useRouter()
  const { user: authUser, token, isLoading } = useAuth()
  const [drawEntries, setDrawEntries] = useState<DrawEntry[]>([])
  const [allScores, setAllScores] = useState<Score[]>([])
  const [winningsHistory, setWinningsHistory] = useState<Winning[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'draws' | 'scores' | 'winnings'>('draws')

  useEffect(() => {
    // Don't redirect during loading
    if (isLoading) return
    
    if (!authUser || !token) {
      router.push('/login')
      return
    }
    fetchHistoryData()
  }, [authUser, token, isLoading])

  const fetchHistoryData = async () => {
    try {
      const response = await fetch('/api/user/history', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setDrawEntries(data.drawEntries)
        setAllScores(data.allScores)
        setWinningsHistory(data.winningsHistory)
        setStatistics(data.statistics)
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-charity-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading your history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Golf Journey</h1>
          <p className="text-gray-600">Complete history of your participation and achievements</p>
        </motion.div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Draws Participated</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalDrawsParticipated}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary-600" />
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
                  <p className="text-sm text-gray-500">Total Winnings</p>
                  <p className="text-2xl font-bold text-yellow-600">${statistics.totalWinnings.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600" />
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
                  <p className="text-sm text-gray-500">Scores Entered</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalScoresEntered}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
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
                  <p className="text-sm text-gray-500">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.averageScore}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('draws')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'draws'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Draw History ({drawEntries.length})
            </button>
            <button
              onClick={() => setActiveTab('scores')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'scores'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Scores ({allScores.length})
            </button>
            <button
              onClick={() => setActiveTab('winnings')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'winnings'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Winnings ({winningsHistory.length})
            </button>
          </div>

          {/* Draw History Tab */}
          {activeTab === 'draws' && (
            <div className="space-y-4">
              {drawEntries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No draw participation yet</p>
                  <p className="text-sm">Enter 5 scores to participate in monthly draws</p>
                </div>
              ) : (
                drawEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {new Date(entry.draw.drawDate).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                          })} Draw
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">{entry.draw.drawType} draw</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{entry.matches} matches</p>
                        {entry.prizeAmount > 0 && (
                          <p className="text-sm text-yellow-600">${entry.prizeAmount.toFixed(2)} won</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Your Numbers:</p>
                        <div className="flex space-x-1">
                          {entry.userNumbers.map((num, i) => (
                            <span
                              key={i}
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                entry.draw.winningNumbers.includes(num)
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Winning Numbers:</p>
                        <div className="flex space-x-1">
                          {entry.draw.winningNumbers.map((num, i) => (
                            <span
                              key={i}
                              className="w-8 h-8 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-xs font-medium"
                            >
                              {num}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-500">
                      <span>Prize Pool: ${entry.draw.totalPrizePool.toFixed(2)}</span>
                      <span>{entry.draw.isPublished ? 'Published' : 'Pending'}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Scores Tab */}
          {activeTab === 'scores' && (
            <div className="space-y-4">
              {allScores.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No scores entered yet</p>
                  <p className="text-sm">Start tracking your golf scores</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allScores.map((score, index) => (
                    <motion.div
                      key={score.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-primary-600">{score.score}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {new Date(score.scoreDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(score.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Winnings Tab */}
          {activeTab === 'winnings' && (
            <div className="space-y-4">
              {winningsHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No winnings yet</p>
                  <p className="text-sm">Keep playing to win prizes!</p>
                </div>
              ) : (
                winningsHistory.map((winning, index) => (
                  <motion.div
                    key={winning.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{winning.matchType}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(winning.draw.drawDate).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-yellow-600">${winning.prizeAmount.toFixed(2)}</p>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            winning.verificationStatus === 'approved' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {winning.verificationStatus}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            winning.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {winning.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <p className="text-gray-600 mb-1">Winning Numbers:</p>
                      <div className="flex space-x-1">
                        {winning.draw.winningNumbers.map((num, i) => (
                          <span
                            key={i}
                            className="w-8 h-8 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-xs font-medium"
                          >
                            {num}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
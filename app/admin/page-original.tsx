'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Trophy, Heart, DollarSign, Settings, 
  Play, Eye, Check, X, Upload, Download,
  Calendar, TrendingUp, AlertCircle, Plus
} from 'lucide-react'

interface AdminStats {
  totalUsers: number
  activeSubscribers: number
  totalPrizePool: number
  totalCharityContributions: number
  pendingWinners: number
  nextDrawDate: string
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  subscriptionStatus: string
  subscriptionPlan: string
  createdAt: string
}

interface Draw {
  id: string
  drawDate: string
  drawType: string
  winningNumbers: number[]
  totalPrizePool: number
  isPublished: boolean
}

interface Winner {
  id: string
  userId: string
  userName: string
  matchType: string
  prizeAmount: number
  verificationStatus: string
  paymentStatus: string
  proofScreenshotUrl: string | null
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [draws, setDraws] = useState<Draw[]>([])
  const [winners, setWinners] = useState<Winner[]>([])
  const [loading, setLoading] = useState(true)
  const [drawLoading, setDrawLoading] = useState(false)
  const [simulationResult, setSimulationResult] = useState<any>(null)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setUsers(data.users)
        setDraws(data.draws)
        setWinners(data.winners)
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const runDraw = async (type: 'random' | 'algorithmic', mode: 'simulation' | 'final' = 'final') => {
    setDrawLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/draws/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ type, mode })
      })

      if (response.ok) {
        const result = await response.json()
        
        if (mode === 'simulation') {
          setSimulationResult(result.draw)
          alert('Simulation completed! Check results below.')
        } else {
          fetchAdminData()
          setSimulationResult(null)
          alert('Draw completed successfully!')
        }
      }
    } catch (error) {
      console.error('Error running draw:', error)
      alert('Error running draw')
    } finally {
      setDrawLoading(false)
    }
  }

  const runTestDraw = async () => {
    const testNumbers = prompt('Enter 5 test numbers (1-45) separated by commas:\nExample: 12,25,30,35,42')
    
    if (!testNumbers) return
    
    const numbers = testNumbers.split(',').map(n => parseInt(n.trim()))
    
    if (numbers.length !== 5 || numbers.some(n => isNaN(n) || n < 1 || n > 45)) {
      alert('Please enter exactly 5 valid numbers between 1-45')
      return
    }

    setDrawLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/draws/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ testNumbers: numbers })
      })

      if (response.ok) {
        const result = await response.json()
        fetchAdminData()
        alert(`Test draw completed!\nWinning Numbers: ${result.draw.winningNumbers.join(', ')}\nWinners: ${result.draw.winners}\n5-Match: ${result.draw.winnersByTier.fiveMatch}\n4-Match: ${result.draw.winnersByTier.fourMatch}\n3-Match: ${result.draw.winnersByTier.threeMatch}`)
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error('Error running test draw:', error)
      alert('Error running test draw')
    } finally {
      setDrawLoading(false)
    }
  }

  const publishDraw = async (drawId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/draws/${drawId}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchAdminData()
        alert('Draw published successfully!')
      }
    } catch (error) {
      console.error('Error publishing draw:', error)
      alert('Error publishing draw')
    }
  }

  const verifyWinner = async (winnerId: string, status: 'approved' | 'rejected') => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/winners/${winnerId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        fetchAdminData()
      }
    } catch (error) {
      console.error('Error verifying winner:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-charity-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'draws', name: 'Draws', icon: Trophy },
    { id: 'winners', name: 'Winners', icon: Check },
    { id: 'charities', name: 'Charities', icon: Heart },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary-500" />
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Subscribers</p>
                    <p className="text-2xl font-bold text-green-600">{stats.activeSubscribers}</p>
                  </div>
                  <Check className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Prize Pool</p>
                    <p className="text-2xl font-bold text-yellow-600">${stats.totalPrizePool.toFixed(2)}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Charity Total</p>
                    <p className="text-2xl font-bold text-charity-600">${stats.totalCharityContributions.toFixed(2)}</p>
                  </div>
                  <Heart className="w-8 h-8 text-charity-500" />
                </div>
              </div>
            </div>

            {/* Draw Management */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Draw Management</h2>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-medium text-gray-900">Next Draw Date</p>
                  <p className="text-gray-600">{new Date(stats.nextDrawDate).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Test Draw Button */}
                  <button
                    onClick={runTestDraw}
                    disabled={drawLoading}
                    className="btn-secondary flex items-center text-sm bg-purple-100 text-purple-700 hover:bg-purple-200"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {drawLoading ? 'Running...' : 'Test Draw (Custom Numbers)'}
                  </button>
                  
                  {/* Simulation Buttons */}
                  <button
                    onClick={() => runDraw('random', 'simulation')}
                    disabled={drawLoading}
                    className="btn-secondary flex items-center text-sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {drawLoading ? 'Running...' : 'Simulate Random'}
                  </button>
                  <button
                    onClick={() => runDraw('algorithmic', 'simulation')}
                    disabled={drawLoading}
                    className="btn-secondary flex items-center text-sm"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {drawLoading ? 'Running...' : 'Simulate Algorithmic'}
                  </button>
                  
                  {/* Final Draw Buttons */}
                  <button
                    onClick={() => runDraw('random', 'final')}
                    disabled={drawLoading}
                    className="btn-primary flex items-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {drawLoading ? 'Running...' : 'Run Random Draw'}
                  </button>
                  <button
                    onClick={() => runDraw('algorithmic', 'final')}
                    disabled={drawLoading}
                    className="btn-primary flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {drawLoading ? 'Running...' : 'Run Algorithmic Draw'}
                  </button>
                </div>
              </div>

              {/* Simulation Results */}
              {simulationResult && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Simulation Results</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-800">
                        <strong>Winning Numbers:</strong> {simulationResult.winningNumbers?.join(', ')}
                      </p>
                      <p className="text-blue-800">
                        <strong>Total Prize Pool:</strong> ${simulationResult.totalPrizePool?.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-800">
                        <strong>5-Match Pool:</strong> ${simulationResult.fiveMatchPool?.toFixed(2)}
                      </p>
                      <p className="text-blue-800">
                        <strong>4-Match Pool:</strong> ${simulationResult.fourMatchPool?.toFixed(2)}
                      </p>
                      <p className="text-blue-800">
                        <strong>3-Match Pool:</strong> ${simulationResult.threeMatchPool?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    * This is a simulation. No data has been saved to the database.
                  </p>
                </div>
              )}
              
              {stats.pendingWinners > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    <p className="text-yellow-800">
                      {stats.pendingWinners} winner{stats.pendingWinners !== 1 ? 's' : ''} pending verification
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <button className="btn-primary flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user: User) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">
                          {user.subscriptionPlan || 'None'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.subscriptionStatus === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.subscriptionStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Winners Tab */}
        {activeTab === 'winners' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Winner Verification</h2>

            <div className="space-y-4">
              {winners.map((winner: Winner) => (
                <div key={winner.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{winner.userName}</h3>
                      <p className="text-sm text-gray-500">
                        {winner.matchType} - ${winner.prizeAmount}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        winner.verificationStatus === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : winner.verificationStatus === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {winner.verificationStatus}
                      </span>
                      {winner.verificationStatus === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => verifyWinner(winner.id, 'approved')}
                            className="p-1 text-green-600 hover:bg-green-100 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => verifyWinner(winner.id, 'rejected')}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {winner.proofScreenshotUrl && (
                    <div className="mt-3">
                      <img
                        src={winner.proofScreenshotUrl}
                        alt="Proof screenshot"
                        className="max-w-xs rounded border"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Draws Tab */}
        {activeTab === 'draws' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Draw History</h2>

            <div className="space-y-4">
              {draws.map((draw: Draw) => (
                <div key={draw.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {new Date(draw.drawDate).toLocaleDateString()}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {draw.drawType} Draw - ${draw.totalPrizePool}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-sm text-gray-600">Winning Numbers:</span>
                        {draw.winningNumbers.map((num: number, index: number) => (
                          <span
                            key={index}
                            className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-semibold"
                          >
                            {num}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        draw.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {draw.isPublished ? 'Published' : 'Draft'}
                      </span>
                      {!draw.isPublished && (
                        <button 
                          onClick={() => publishDraw(draw.id)}
                          className="btn-primary text-sm"
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
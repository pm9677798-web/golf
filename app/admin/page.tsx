'use client'

import { useState, useEffect } from 'react'
import { 
  Users, Trophy, Heart, Settings, 
  Play, Eye, Check, X,
  TrendingUp, AlertCircle, Plus,
  Edit, Trash2, BarChart3
} from 'lucide-react'
import AddUserModal from '../../components/admin/AddUserModal'
import EditUserModal from '../../components/admin/EditUserModal'
import AddCharityModal from '../../components/admin/AddCharityModal'
import EditCharityModal from '../../components/admin/EditCharityModal'

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
  first_name: string
  last_name: string
  subscription_status: string
  subscription_plan: string
  created_at: string
  scores?: { count: number }[]
}

interface Charity {
  id: string
  name: string
  description: string
  website_url: string | null
  users?: { count: number }[]
}

interface Draw {
  id: string
  draw_date: string
  draw_type: string
  winning_numbers: number[]
  total_prize_pool: number
  is_published: boolean
}

interface Winner {
  id: string
  user_id: string
  userName: string
  match_type: string
  prize_amount: number
  verification_status: string
  payment_status: string
  proof_screenshot_url: string | null
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [charities, setCharities] = useState<Charity[]>([])
  const [draws, setDraws] = useState<Draw[]>([])
  const [winners, setWinners] = useState<Winner[]>([])
  const [reports, setReports] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [drawLoading, setDrawLoading] = useState(false)
  const [simulationResult, setSimulationResult] = useState<any>(null)
  
  // Edit states
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingCharity, setEditingCharity] = useState<Charity | null>(null)
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddCharity, setShowAddCharity] = useState(false)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      
      // Fetch all admin data in parallel
      const [dashboardRes, usersRes, charitiesRes, reportsRes] = await Promise.all([
        fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/charities', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/reports', { headers: { Authorization: `Bearer ${token}` } })
      ])

      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json()
        setStats(dashboardData.stats)
        setDraws(dashboardData.draws)
        setWinners(dashboardData.winners)
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData.users)
      }

      if (charitiesRes.ok) {
        const charitiesData = await charitiesRes.json()
        setCharities(charitiesData.charities)
      }

      if (reportsRes.ok) {
        const reportsData = await reportsRes.json()
        setReports(reportsData)
      }

    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }
  // User Management Functions
  const handleAddUser = async (userData: any) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        const result = await response.json()
        fetchAdminData()
        setShowAddUser(false)
        alert(`User created successfully!\nTemporary Password: ${result.tempPassword}\nPlease share this with the user.`)
      } else {
        const error = await response.json()
        alert(`Error creating user: ${error.message}`)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error creating user')
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
  }

  const handleSaveUser = async (userData: any) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/admin/users/${editingUser?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        fetchAdminData()
        setEditingUser(null)
        alert('User updated successfully!')
      } else {
        const error = await response.json()
        alert(`Error updating user: ${error.message}`)
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error updating user')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        fetchAdminData()
        alert('User deleted successfully!')
      } else {
        const error = await response.json()
        alert(`Error deleting user: ${error.message}`)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user')
    }
  }

  // Charity Management Functions
  const handleAddCharity = async (charityData: any) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/admin/charities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(charityData)
      })

      if (response.ok) {
        fetchAdminData()
        setShowAddCharity(false)
        alert('Charity created successfully!')
      } else {
        const error = await response.json()
        alert(`Error creating charity: ${error.message}`)
      }
    } catch (error) {
      console.error('Error creating charity:', error)
      alert('Error creating charity')
    }
  }

  const handleEditCharity = (charity: Charity) => {
    setEditingCharity(charity)
  }

  const handleSaveCharity = async (charityData: any) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/admin/charities/${editingCharity?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(charityData)
      })

      if (response.ok) {
        fetchAdminData()
        setEditingCharity(null)
        alert('Charity updated successfully!')
      } else {
        const error = await response.json()
        alert(`Error updating charity: ${error.message}`)
      }
    } catch (error) {
      console.error('Error updating charity:', error)
      alert('Error updating charity')
    }
  }

  const handleDeleteCharity = async (charityId: string) => {
    if (!confirm('Are you sure you want to delete this charity? This action cannot be undone.')) return

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/admin/charities/${charityId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        fetchAdminData()
        alert('Charity deleted successfully!')
      } else {
        const error = await response.json()
        alert(error.message)
      }
    } catch (error) {
      console.error('Error deleting charity:', error)
      alert('Error deleting charity')
    }
  }

  // Winner Management Functions
  const handleVerifyWinner = async (winnerId: string, status: 'approved' | 'rejected') => {
    try {
      const token = localStorage.getItem('auth_token')
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
        alert(`Winner ${status} successfully!`)
      }
    } catch (error) {
      console.error('Error verifying winner:', error)
      alert('Error verifying winner')
    }
  }

  const handleMarkAsPaid = async (winnerId: string, paymentData: any) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/admin/winners/${winnerId}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentStatus: 'paid',
          ...paymentData
        })
      })

      if (response.ok) {
        fetchAdminData()
        alert('Winner marked as paid successfully!')
      }
    } catch (error) {
      console.error('Error updating payment:', error)
      alert('Error updating payment')
    }
  }
  // Draw Management Functions (keeping existing ones)
  const runDraw = async (type: 'random' | 'algorithmic' | 'smart', mode: 'simulation' | 'final' = 'final') => {
    setDrawLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
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
      const token = localStorage.getItem('auth_token')
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
    if (!confirm('Are you sure you want to publish this draw? This action cannot be undone and will notify all users.')) {
      return
    }
    
    try {
      const token = localStorage.getItem('auth_token')
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
      } else {
        const error = await response.json()
        alert(`Error: ${error.message}`)
      }
    } catch (error) {
      console.error('Error publishing draw:', error)
      alert('Error publishing draw')
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
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'draws', name: 'Draw Management', icon: Trophy },
    { id: 'winners', name: 'Winner Management', icon: Check },
    { id: 'charities', name: 'Charity Management', icon: Heart },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, draws, winners, and charities</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
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
          <div className="space-y-6">
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Draw System</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-900 mb-2">🎯 Fully Automatic System</h3>
                <p className="text-blue-800 text-sm">
                  The Smart Draw automatically analyzes existing user scores to ensure winners while maintaining fairness. 
                  Perfect for non-technical administrators - just click "Run Monthly Draw" once per month!
                </p>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-lg font-medium text-gray-900">Next Draw Date</p>
                  <p className="text-gray-600">{new Date(stats.nextDrawDate).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Main Smart Draw Button - Recommended */}
                  <button
                    onClick={() => runDraw('algorithmic', 'final')}
                    disabled={drawLoading}
                    className="btn-primary flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg font-medium"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    {drawLoading ? 'Running Monthly Draw...' : 'Run Monthly Draw (Smart)'}
                  </button>
                </div>
              </div>

              {/* Advanced Options - Collapsible */}
              <details className="mb-4">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 font-medium">
                  🔧 Advanced Options (For Technical Users)
                </summary>
                <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex flex-wrap gap-2">
                    {/* Test Draw Button */}
                    <button
                      onClick={runTestDraw}
                      disabled={drawLoading}
                      className="btn-secondary flex items-center text-sm bg-purple-100 text-purple-700 hover:bg-purple-200"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {drawLoading ? 'Running...' : 'Test Draw'}
                    </button>
                    
                    {/* Simulation Buttons */}
                    <button
                      onClick={() => runDraw('algorithmic', 'simulation')}
                      disabled={drawLoading}
                      className="btn-secondary flex items-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {drawLoading ? 'Running...' : 'Simulate Smart'}
                    </button>
                    
                    <button
                      onClick={() => runDraw('random', 'simulation')}
                      disabled={drawLoading}
                      className="btn-secondary flex items-center text-sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {drawLoading ? 'Running...' : 'Simulate Random'}
                    </button>
                    
                    {/* Alternative Draw Types */}
                    <button
                      onClick={() => runDraw('random', 'final')}
                      disabled={drawLoading}
                      className="btn-secondary flex items-center text-sm"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {drawLoading ? 'Running...' : 'Random Draw'}
                    </button>
                    
                    <button
                      onClick={() => runDraw('algorithmic', 'final')}
                      disabled={drawLoading}
                      className="btn-secondary flex items-center text-sm"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {drawLoading ? 'Running...' : 'Algorithmic Draw'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Random: Pure chance | Algorithmic: Based on score patterns | Smart: Guarantees winners from existing users
                  </p>
                </div>
              </details>

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
          </div>
        )}
        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                <button 
                  onClick={() => setShowAddUser(true)}
                  className="btn-primary flex items-center"
                >
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
                        Scores
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
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 capitalize">
                            {user.subscription_plan || 'None'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.subscription_status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.subscription_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.scores?.[0]?.count || 0} scores
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="text-primary-600 hover:text-primary-900 mr-3"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* Winner Management Tab */}
        {activeTab === 'winners' && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Winner Management</h2>

            <div className="space-y-4">
              {winners.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Winners Yet</h3>
                  <p className="text-sm">Winners will appear here after running a draw with matching users.</p>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg text-left">
                    <h4 className="font-medium text-blue-900 mb-2">To create winners:</h4>
                    <ol className="text-sm text-blue-800 space-y-1">
                      <li>1. Ensure users have 5 golf scores each</li>
                      <li>2. Run a draw from Overview tab</li>
                      <li>3. System will automatically find matches</li>
                      <li>4. Winners will appear here for verification</li>
                    </ol>
                  </div>
                </div>
              ) : (
                winners.map((winner: Winner) => (
                  <div key={winner.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{winner.userName}</h3>
                        <p className="text-sm text-gray-500">
                          {winner.match_type} - ${winner.prize_amount}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            winner.verification_status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : winner.verification_status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            Verification: {winner.verification_status}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            winner.payment_status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : winner.payment_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            Payment: {winner.payment_status || 'not_paid'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {winner.verification_status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleVerifyWinner(winner.id, 'approved')}
                              className="p-2 text-green-600 hover:bg-green-100 rounded"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleVerifyWinner(winner.id, 'rejected')}
                              className="p-2 text-red-600 hover:bg-red-100 rounded"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {winner.verification_status === 'approved' && winner.payment_status !== 'paid' && (
                          <button
                            onClick={() => {
                              const paymentMethod = prompt('Payment method (bank_transfer, paypal, etc.):')
                              const transactionId = prompt('Transaction ID:')
                              if (paymentMethod && transactionId) {
                                handleMarkAsPaid(winner.id, { paymentMethod, transactionId })
                              }
                            }}
                            className="btn-primary text-sm"
                          >
                            Mark as Paid
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {winner.proof_screenshot_url && (
                      <div className="mt-3">
                        <img
                          src={winner.proof_screenshot_url}
                          alt="Proof screenshot"
                          className="max-w-xs rounded border"
                        />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Charity Management Tab */}
        {activeTab === 'charities' && (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Charity Management</h2>
                <button 
                  onClick={() => setShowAddCharity(true)}
                  className="btn-primary flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Charity
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {charities.map((charity: Charity) => (
                  <div key={charity.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{charity.name}</h3>
                        <p className="text-sm text-gray-500">Charity Organization</p>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditCharity(charity)}
                          className="p-1 text-primary-600 hover:bg-primary-100 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCharity(charity.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{charity.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {charity.users?.[0]?.count || 0} users
                      </span>
                      {charity.website_url && (
                        <a 
                          href={charity.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800"
                        >
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Draw Management Tab */}
        {activeTab === 'draws' && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Draw History</h2>

            <div className="space-y-4">
              {draws.map((draw: Draw) => (
                <div key={draw.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {new Date(draw.draw_date).toLocaleDateString()}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {draw.draw_type} Draw - ${draw.total_prize_pool}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-sm text-gray-600">Winning Numbers:</span>
                        {draw.winning_numbers.map((num: number, index: number) => (
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
                        draw.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {draw.is_published ? 'Published' : 'Draft'}
                      </span>
                      {!draw.is_published && (
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
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && reports && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Users:</span>
                    <span className="font-semibold">{reports.overview?.totalUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active:</span>
                    <span className="font-semibold text-green-600">{reports.overview?.activeSubscribers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly:</span>
                    <span className="font-semibold">{reports.overview?.monthlySubscribers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Yearly:</span>
                    <span className="font-semibold">{reports.overview?.yearlySubscribers}</span>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Draw Statistics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Draws:</span>
                    <span className="font-semibold">{reports.overview?.totalDraws}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Published:</span>
                    <span className="font-semibold text-green-600">{reports.overview?.publishedDraws}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prize Pool:</span>
                    <span className="font-semibold">${reports.overview?.totalPrizePool?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Winner Statistics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Winners:</span>
                    <span className="font-semibold">{reports.overview?.totalWinners}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Verified:</span>
                    <span className="font-semibold text-green-600">{reports.overview?.verifiedWinners}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid:</span>
                    <span className="font-semibold text-blue-600">{reports.overview?.paidWinners}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-semibold">${reports.overview?.totalPrizesPaid?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Golf Statistics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Scores:</span>
                    <span className="font-semibold">{reports.overview?.totalScores}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Score:</span>
                    <span className="font-semibold">{reports.overview?.averageScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Charity Total:</span>
                    <span className="font-semibold text-charity-600">${reports.overview?.totalCharityContributions?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={showAddUser}
        onClose={() => setShowAddUser(false)}
        onSave={handleAddUser}
      />

      <EditUserModal
        isOpen={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSaveUser}
      />

      <AddCharityModal
        isOpen={showAddCharity}
        onClose={() => setShowAddCharity(false)}
        onSave={handleAddCharity}
      />

      <EditCharityModal
        isOpen={!!editingCharity}
        charity={editingCharity}
        onClose={() => setEditingCharity(null)}
        onSave={handleSaveCharity}
      />
    </div>
  )
}
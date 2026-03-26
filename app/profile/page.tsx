'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Heart, Settings, Save, ArrowLeft, 
  Mail, Calendar, CreditCard, Percent, Camera, X, Upload
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'

interface Profile {
  id: string
  email: string
  firstName: string
  lastName: string
  profileImageUrl?: string
  subscriptionStatus: string
  subscriptionPlan: string
  subscriptionStartDate: string
  subscriptionEndDate: string
  selectedCharityId: string
  charityContributionPercentage: number
  charity?: {
    id: string
    name: string
    description: string
  }
}

interface Charity {
  id: string
  name: string
  description: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user: authUser, token, updateUser, isLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [charities, setCharities] = useState<Charity[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    selectedCharityId: '',
    charityContributionPercentage: 10
  })

  useEffect(() => {
    // Don't redirect during loading
    if (isLoading) return
    
    if (!authUser || !token) {
      router.push('/login')
      return
    }
    fetchProfileData()
    fetchCharities()
  }, [authUser, token, isLoading])

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setFormData({
          firstName: data.profile.firstName,
          lastName: data.profile.lastName,
          selectedCharityId: data.profile.selectedCharityId || '',
          charityContributionPercentage: data.profile.charityContributionPercentage || 10
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCharities = async () => {
    try {
      const response = await fetch('/api/charities')
      if (response.ok) {
        const data = await response.json()
        setCharities(data.charities)
      }
    } catch (error) {
      console.error('Error fetching charities:', error)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('Profile updated successfully!')
        fetchProfileData()
      } else {
        alert('Error updating profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, and WebP are allowed.')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 5MB.')
      return
    }

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/user/profile/image', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(prev => prev ? { ...prev, profileImageUrl: data.imageUrl } : null)
        // Update AuthContext with new image URL
        updateUser({ profileImageUrl: data.imageUrl })
        setImagePreview(null)
        alert('Profile image updated successfully!')
      } else {
        const error = await response.json()
        alert(error.message || 'Error uploading image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setUploadingImage(false)
      // Reset file input
      e.target.value = ''
    }
  }

  const handleImageDelete = async () => {
    if (!confirm('Are you sure you want to delete your profile image?')) return

    setUploadingImage(true)

    try {
      const response = await fetch('/api/user/profile/image', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        setProfile(prev => prev ? { ...prev, profileImageUrl: undefined } : null)
        // Update AuthContext to remove image URL
        updateUser({ profileImageUrl: undefined })
        alert('Profile image deleted successfully!')
      } else {
        const error = await response.json()
        alert(error.message || 'Error deleting image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Error deleting image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-charity-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const monthlyContribution = (profile.subscriptionPlan === 'monthly' ? 29.99 : 24.99) * (formData.charityContributionPercentage / 100)
  const prizePoolContribution = (profile.subscriptionPlan === 'monthly' ? 29.99 : 24.99) * ((100 - formData.charityContributionPercentage) / 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              
              {/* Profile Image Section */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h3>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {profile.profileImageUrl ? (
                        <img
                          src={profile.profileImageUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <label className="btn-secondary flex items-center cursor-pointer">
                        <Camera className="w-4 h-4 mr-2" />
                        {profile.profileImageUrl ? 'Change Photo' : 'Upload Photo'}
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={(e) => {
                            handleImagePreview(e)
                            handleImageUpload(e)
                          }}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                      
                      {profile.profileImageUrl && (
                        <button
                          onClick={handleImageDelete}
                          disabled={uploadingImage}
                          className="btn-secondary text-red-600 hover:bg-red-50 flex items-center"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-2">
                      JPG, PNG or WebP. Max size 5MB.
                    </p>
                    
                    {imagePreview && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          Image preview - uploading...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    className="input-field bg-gray-50"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Charity
                  </label>
                  <select
                    value={formData.selectedCharityId}
                    onChange={(e) => setFormData(prev => ({ ...prev, selectedCharityId: e.target.value }))}
                    className="input-field"
                    required
                  >
                    <option value="">Select a charity</option>
                    {charities.map(charity => (
                      <option key={charity.id} value={charity.id}>
                        {charity.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Charity Contribution Percentage: {formData.charityContributionPercentage}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={formData.charityContributionPercentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, charityContributionPercentage: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10% (Min)</span>
                    <span>50% (Max)</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-semibold ${
                    profile.subscriptionStatus === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {profile.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {profile.subscriptionPlan}
                  </span>
                </div>
                {profile.subscriptionEndDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Expires</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(profile.subscriptionEndDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Contribution Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subscription</span>
                  <span className="font-semibold text-gray-900">
                    ${profile.subscriptionPlan === 'monthly' ? '29.99' : '24.99'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-charity-600">To Charity ({formData.charityContributionPercentage}%)</span>
                  <span className="font-semibold text-charity-600">
                    ${monthlyContribution.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-primary-600">To Prize Pool ({100 - formData.charityContributionPercentage}%)</span>
                  <span className="font-semibold text-primary-600">
                    ${prizePoolContribution.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Current Charity */}
            {profile.charity && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Charity</h3>
                <div className="space-y-3">
                  <h4 className="font-medium text-charity-600">{profile.charity.name}</h4>
                  <p className="text-sm text-gray-600">{profile.charity.description}</p>
                  <Link 
                    href="/charities" 
                    className="text-charity-600 hover:text-charity-700 text-sm font-medium"
                  >
                    View All Charities →
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
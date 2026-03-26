'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Search, Star, ExternalLink, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Charity {
  id: string
  name: string
  description: string
  imageUrl: string | null
  websiteUrl: string | null
  isFeatured: boolean
  upcomingEvents: string | null
}

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCharities()
  }, [])

  const fetchCharities = async () => {
    try {
      const response = await fetch('/api/charities')
      if (response.ok) {
        const data = await response.json()
        setCharities(data.charities)
      }
    } catch (error) {
      console.error('Error fetching charities:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCharities = charities.filter((charity: Charity) =>
    charity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    charity.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const featuredCharities = filteredCharities.filter((c: Charity) => c.isFeatured)
  const otherCharities = filteredCharities.filter((c: Charity) => !c.isFeatured)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 charity-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading charities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your <span className="text-transparent bg-clip-text charity-gradient">Charity</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Every subscription contributes to the charity of your choice. Select an organization that aligns with your values and make a difference with every round you play.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search charities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-charity-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Featured Charities */}
        {featuredCharities.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="flex items-center mb-8">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Charities</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCharities.map((charity: Charity, index: number) => (
                <motion.div
                  key={charity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="card overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={charity.imageUrl || 'https://via.placeholder.com/400x200?text=Charity'}
                      alt={charity.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{charity.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{charity.description}</p>

                    {charity.upcomingEvents && (
                      <div className="mb-4 p-3 bg-charity-50 rounded-lg">
                        <div className="flex items-center text-charity-700 text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="font-medium">Upcoming Events</span>
                        </div>
                        <p className="text-charity-600 text-sm mt-1">{charity.upcomingEvents}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      {charity.websiteUrl && (
                        <a
                          href={charity.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-charity-600 hover:text-charity-700 text-sm font-medium flex items-center"
                        >
                          Visit Website
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      )}
                      <Link
                        href={`/signup?charity=${charity.id}`}
                        className="btn-primary text-sm"
                      >
                        Choose This Charity
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* All Charities */}
        {otherCharities.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">All Charities</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherCharities.map((charity: Charity, index: number) => (
                <motion.div
                  key={charity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="card overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={charity.imageUrl || 'https://via.placeholder.com/400x200?text=Charity'}
                      alt={charity.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{charity.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{charity.description}</p>

                    {charity.upcomingEvents && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center text-gray-700 text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="font-medium">Upcoming Events</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{charity.upcomingEvents}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      {charity.websiteUrl && (
                        <a
                          href={charity.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                        >
                          Visit Website
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      )}
                      <Link
                        href={`/signup?charity=${charity.id}`}
                        className="btn-secondary text-sm"
                      >
                        Choose This Charity
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {filteredCharities.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No charities found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </motion.div>
        )}

        {/* Impact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Impact Matters</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              When you join GolfHeart, a minimum of 10% of your subscription goes directly to your chosen charity. 
              You can increase this percentage up to 50% to maximize your impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 charity-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Direct Impact</h3>
              <p className="text-gray-600">100% of your charity contribution goes directly to your chosen organization</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Contributions</h3>
              <p className="text-gray-600">Automatic monthly donations ensure consistent support for your cause</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600">Track your total contributions and see the collective impact of our community</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/signup" className="btn-primary">
              Start Making a Difference Today
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
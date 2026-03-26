'use client'

import { Heart, Trophy, Users, ArrowRight, Star, Target } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const [currentImpact, setCurrentImpact] = useState(0)
  const impacts = [125000, 89000, 156000, 203000]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImpact((prev) => (prev + 1) % impacts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Play Golf.
                <span className="text-transparent bg-clip-text charity-gradient"> Change Lives.</span>
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                Track your golf scores, enter monthly prize draws, and automatically donate to charities you care about. 
                Every round you play creates positive impact.
              </p>
              
              {/* Impact Counter */}
              <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 charity-gradient rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Raised for Charity</p>
                    <motion.p 
                      key={currentImpact}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-bold text-charity-600"
                    >
                      ${impacts[currentImpact].toLocaleString()}
                    </motion.p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="btn-primary text-center">
                  Start Playing for Purpose
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Link>
                <Link href="#how-it-works" className="btn-secondary text-center">
                  Learn How It Works
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="card p-6 float-animation">
                    <Trophy className="w-8 h-8 text-yellow-500 mb-3" />
                    <h3 className="font-semibold text-gray-900">Monthly Draws</h3>
                    <p className="text-sm text-gray-600 mt-1">Win prizes based on your scores</p>
                  </div>
                  <div className="card p-6 float-animation" style={{ animationDelay: '1s' }}>
                    <Heart className="w-8 h-8 text-charity-500 mb-3" />
                    <h3 className="font-semibold text-gray-900">Charity Impact</h3>
                    <p className="text-sm text-gray-600 mt-1">Support causes you believe in</p>
                  </div>
                  <div className="card p-6 float-animation" style={{ animationDelay: '2s' }}>
                    <Target className="w-8 h-8 text-primary-500 mb-3" />
                    <h3 className="font-semibold text-gray-900">Score Tracking</h3>
                    <p className="text-sm text-gray-600 mt-1">Simple Stableford scoring</p>
                  </div>
                  <div className="card p-6 float-animation" style={{ animationDelay: '3s' }}>
                    <Users className="w-8 h-8 text-green-500 mb-3" />
                    <h3 className="font-semibold text-gray-900">Community</h3>
                    <p className="text-sm text-gray-600 mt-1">Join like-minded golfers</p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-charity-100 rounded-3xl transform rotate-3 -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to start making a difference through golf
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Subscribe & Choose',
                description: 'Pick your plan and select a charity to support',
                icon: Heart,
                color: 'charity'
              },
              {
                step: '02',
                title: 'Play & Track',
                description: 'Enter your latest 5 golf scores in Stableford format',
                icon: Target,
                color: 'primary'
              },
              {
                step: '03',
                title: 'Win & Give',
                description: 'Monthly draws determine winners while supporting charity',
                icon: Trophy,
                color: 'yellow'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                    item.color === 'charity' ? 'charity-gradient' :
                    item.color === 'primary' ? 'bg-gradient-to-r from-primary-500 to-primary-600' :
                    'bg-gradient-to-r from-yellow-400 to-orange-500'
                  }`}>
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Impact</h2>
            <p className="text-xl text-gray-600">
              Every subscription contributes to prizes and charity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: 'Monthly',
                price: '$29.99',
                period: '/month',
                features: [
                  'Enter monthly prize draws',
                  'Track unlimited scores',
                  'Choose your charity',
                  'Minimum 10% to charity',
                  'Winner verification system'
                ],
                popular: false
              },
              {
                name: 'Yearly',
                price: '$299.99',
                period: '/year',
                originalPrice: '$359.88',
                features: [
                  'All monthly features',
                  'Save $60 per year',
                  'Priority support',
                  'Early access to new features',
                  'Enhanced charity reporting'
                ],
                popular: true
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`card p-8 relative ${plan.popular ? 'ring-2 ring-primary-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  {plan.originalPrice && (
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="line-through">{plan.originalPrice}</span> - Save $60!
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/signup" 
                  className={`w-full text-center block py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular 
                      ? 'btn-primary' 
                      : 'btn-secondary'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-charity-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">GolfHeart</span>
              </div>
              <p className="text-gray-400">
                Connecting golfers with causes that matter, one score at a time.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/charities" className="hover:text-white transition-colors">Charities</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-gray-400 mb-4">
                Join our community of golfers making a difference.
              </p>
              <Link href="/signup" className="btn-primary inline-block">
                Join Now
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 GolfHeart. All rights reserved. Built with ❤️ for golfers who care.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
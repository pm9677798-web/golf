'use client'

import { motion } from 'framer-motion'
import { 
  UserPlus, Target, Trophy, Heart, 
  Calendar, DollarSign, Award, CheckCircle,
  ArrowRight, Play, Users, TrendingUp
} from 'lucide-react'
import Link from 'next/link'

export default function HowItWorksPage() {
  const steps = [
    {
      icon: UserPlus,
      title: "1. Sign Up & Subscribe",
      description: "Create your account and choose a monthly ($29.99) or yearly ($299.99) subscription plan.",
      details: [
        "Quick registration with email verification",
        "Choose your preferred charity (10-50% contribution)",
        "Secure payment processing",
        "Instant access to platform features"
      ]
    },
    {
      icon: Target,
      title: "2. Enter Golf Scores",
      description: "Track your Stableford golf scores (1-45 range) to participate in monthly draws.",
      details: [
        "Enter scores from your golf rounds",
        "Minimum 5 scores required for draw eligibility",
        "Automatic oldest score replacement when adding 6th",
        "Real-time eligibility status updates"
      ]
    },
    {
      icon: Calendar,
      title: "3. Monthly Draws",
      description: "Participate in automated monthly draws with your latest 5 scores.",
      details: [
        "Draws run on the 1st of each month",
        "Your latest 5 scores automatically entered",
        "Smart algorithm ensures fair winner selection",
        "Real-time draw results and notifications"
      ]
    },
    {
      icon: Trophy,
      title: "4. Win Prizes",
      description: "Match 3, 4, or 5 numbers to win cash prizes from the monthly prize pool.",
      details: [
        "3 matches: 25% of prize pool",
        "4 matches: 35% of prize pool", 
        "5 matches: 40% of prize pool (Jackpot)",
        "Multiple winners split prizes equally"
      ]
    },
    {
      icon: Heart,
      title: "5. Support Charity",
      description: "Your subscription automatically contributes to your selected charity.",
      details: [
        "Choose from verified charity partners",
        "Adjust contribution percentage (10-50%)",
        "Track your total charitable impact",
        "Change charity selection anytime"
      ]
    }
  ]

  const prizeBreakdown = [
    { matches: 5, percentage: 40, color: "text-yellow-600", bg: "bg-yellow-100" },
    { matches: 4, percentage: 35, color: "text-blue-600", bg: "bg-blue-100" },
    { matches: 3, percentage: 25, color: "text-green-600", bg: "bg-green-100" }
  ]

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pt-24">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/50 rounded-full blur-[100px] -z-10 animate-float"></div>
      <div className="absolute top-[40%] right-[-10%] w-[30%] h-[30%] bg-charity-200/50 rounded-full blur-[100px] -z-10 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-orange-400/10 rounded-full blur-[120px] -z-10 animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-black text-slate-800 mb-6 drop-shadow-sm tracking-tight animate-slide-up">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">GolfHeart</span> Works
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10 font-medium animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Play golf, track scores, win prizes, and support charity - all in one platform. 
            Here's your complete guide to getting started and maximizing your impact.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="btn-primary flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Get Started Now
            </Link>
            <Link href="/charities" className="btn-secondary flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              View Charities
            </Link>
          </div>
        </motion.div>

        {/* Step-by-Step Process */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-center text-gray-900 mb-12"
          >
            Simple 5-Step Process
          </motion.h2>
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1 card p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                      <step.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6 text-lg">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block">
                    <ArrowRight className="w-8 h-8 text-primary-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Prize Pool Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Prize Pool Distribution
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {prizeBreakdown.map((prize, index) => (
              <div key={index} className={`${prize.bg} rounded-lg p-6 text-center`}>
                <div className={`text-4xl font-bold ${prize.color} mb-2`}>
                  {prize.matches} Matches
                </div>
                <div className={`text-2xl font-semibold ${prize.color} mb-2`}>
                  {prize.percentage}%
                </div>
                <div className="text-gray-600">of Prize Pool</div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">How Prize Pool Works:</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
              <div>
                <h4 className="font-medium mb-2">Monthly Contributions:</h4>
                <ul className="space-y-1">
                  <li>• Monthly Plan: $29.99 - charity % = prize pool</li>
                  <li>• Yearly Plan: $24.99/month - charity % = prize pool</li>
                  <li>• All active subscribers contribute</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Prize Distribution:</h4>
                <ul className="space-y-1">
                  <li>• Multiple winners split their category prize</li>
                  <li>• No 5-match winner = jackpot rolls over</li>
                  <li>• Prizes paid after verification</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="grid md:grid-cols-4 gap-6 mb-16"
        >
          <div className="card p-6 text-center">
            <Users className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">500+</div>
            <div className="text-gray-600">Active Players</div>
          </div>
          <div className="card p-6 text-center">
            <DollarSign className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">$50K+</div>
            <div className="text-gray-600">Prizes Awarded</div>
          </div>
          <div className="card p-6 text-center">
            <Heart className="w-8 h-8 text-charity-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">$25K+</div>
            <div className="text-gray-600">Donated to Charity</div>
          </div>
          <div className="card p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-900">95%</div>
            <div className="text-gray-600">User Satisfaction</div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="card p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What is Stableford scoring?
              </h3>
              <p className="text-gray-600 mb-4">
                Stableford is a golf scoring system where you earn points based on your performance on each hole. 
                Scores range from 1-45, with higher scores being better.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How often are draws held?
              </h3>
              <p className="text-gray-600 mb-4">
                Draws are held monthly on the 1st of each month. Your latest 5 scores are automatically entered.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my charity selection?
              </h3>
              <p className="text-gray-600 mb-4">
                Yes! You can change your selected charity and contribution percentage anytime in your profile settings.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How are winners verified?
              </h3>
              <p className="text-gray-600 mb-4">
                Winners must provide proof of their golf scores (scorecards, app screenshots) for verification before prize payout.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="text-center bg-gradient-to-br from-primary-600 to-primary-800 rounded-[3rem] p-16 text-white shadow-[0_20px_40px_-15px_rgba(16,185,129,0.5)] border-2 border-primary-500 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[50px] -z-0"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6 drop-shadow-md">Ready to Get Started?</h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90 font-medium">
            Join hundreds of golfers who are already winning prizes and supporting great causes!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="bg-white text-primary-700 px-10 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all transform hover:-translate-y-1 shadow-[0_6px_0_0_#cbd5e1] hover:shadow-[0_6px_0_0_#cbd5e1,0_15px_30px_-5px_rgba(255,255,255,0.3)] active:translate-y-1 active:shadow-[0_0px_0_0_#cbd5e1] active:mb-[-6px] text-lg">
              Sign Up Now
            </Link>
            <Link href="/charities" className="bg-primary-700 text-white px-10 py-4 rounded-xl font-bold border-2 border-primary-400 hover:bg-primary-600 transition-all transform hover:-translate-y-1 shadow-[0_6px_0_0_#065f46] hover:shadow-[0_6px_0_0_#065f46,0_15px_30px_-5px_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-[0_0px_0_0_#065f46] active:mb-[-6px] text-lg">
              View Charities
            </Link>
          </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
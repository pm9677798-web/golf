'use client'

import { Heart, Trophy, Target, Star } from 'lucide-react'
import Link from 'next/link'
import HeroVideoBackground from '../components/ui/HeroVideoBackground'
import StackedImages from '../components/ui/StackedImages'

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section with Video Background */}
      <HeroVideoBackground />

      {/* Stacked Images Section */}
      <StackedImages />

      {/* Pricing - 3D Cards */}
      <section className="py-24 bg-slate-800 relative z-0 overflow-hidden text-white mt-12 rounded-[4rem] mx-4 sm:mx-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/20 to-transparent -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-charity-600/20 to-transparent -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight drop-shadow-md">Choose Your Impact</h2>
            <p className="text-xl text-slate-300 font-medium">
              Every subscription contributes to prizes and charity
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div className="bg-slate-700/50 backdrop-blur-xl border-2 border-slate-600 rounded-[2.5rem] p-10 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold text-white mb-4">Monthly</h3>
                <div className="flex items-end justify-center">
                  <span className="text-7xl font-black text-white tracking-tighter drop-shadow-sm">$29.99</span>
                  <span className="text-slate-400 font-bold pb-2 ml-2">/month</span>
                </div>
              </div>

              <ul className="space-y-6 mb-12 text-lg px-4 border-t border-slate-600 pt-10">
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-primary-500/20 rounded-xl flex items-center justify-center mr-4">
                    <div className="w-3 h-3 bg-primary-400 rounded-full shadow-[0_0_10px_#34d399]"></div>
                  </div>
                  <span className="text-slate-200 font-medium">Enter monthly prize draws</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-primary-500/20 rounded-xl flex items-center justify-center mr-4">
                    <div className="w-3 h-3 bg-primary-400 rounded-full shadow-[0_0_10px_#34d399]"></div>
                  </div>
                  <span className="text-slate-200 font-medium">Track unlimited scores</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-primary-500/20 rounded-xl flex items-center justify-center mr-4">
                    <div className="w-3 h-3 bg-primary-400 rounded-full shadow-[0_0_10px_#34d399]"></div>
                  </div>
                  <span className="text-slate-200 font-medium">Choose your charity</span>
                </li>
              </ul>

              <Link href="/signup" className="w-full text-center block bg-slate-600 hover:bg-slate-500 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-150 transform hover:-translate-y-1 shadow-[0_6px_0_0_#475569] hover:shadow-[0_6px_0_0_#475569,0_15px_30px_-5px_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-[0_0px_0_0_#475569] active:mb-[-6px] text-xl">
                Get Started
              </Link>
            </div>

            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-[2.5rem] p-10 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.5)] relative border-2 border-primary-400 animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                <div className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-black flex items-center shadow-[0_4px_0_0_#c2410c] uppercase tracking-wider">
                  <Star className="w-4 h-4 mr-2" />
                  Most Popular
                </div>
              </div>

              <div className="text-center mb-10 mt-4">
                <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-sm">Yearly</h3>
                <div className="flex items-end justify-center">
                  <span className="text-7xl font-black text-white tracking-tighter drop-shadow-md">$299.99</span>
                  <span className="text-primary-200 font-bold pb-2 ml-2">/year</span>
                </div>
                <div className="mt-4 inline-block bg-primary-900/40 text-primary-100 font-black px-5 py-2 rounded-xl shadow-inner border border-primary-900/50">
                  <span className="line-through decoration-red-400 decoration-4 opacity-100 mr-2">$359.88</span> Save $60!
                </div>
              </div>

              <ul className="space-y-6 mb-12 text-lg px-4 border-t border-primary-400/50 pt-10">
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                    <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                  </div>
                  <span className="text-white font-medium">All monthly features</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                    <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                  </div>
                  <span className="text-white font-medium">Save $60 per year</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                    <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                  </div>
                  <span className="text-white font-medium">Priority support</span>
                </li>
              </ul>

              <Link href="/signup" className="w-full text-center block bg-white text-primary-700 font-bold py-5 px-6 rounded-2xl transition-all duration-150 transform hover:-translate-y-1 shadow-[0_6px_0_0_#cbd5e1] hover:shadow-[0_6px_0_0_#cbd5e1,0_15px_30px_-5px_rgba(255,255,255,0.3)] active:translate-y-1 active:shadow-[0_0px_0_0_#cbd5e1] active:mb-[-6px] text-xl">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section id="prizes" className="py-24 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 drop-shadow-sm tracking-tight">Monthly Prize Pool</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
              Win cash prizes based on your golf score matches. The more subscribers, the bigger the prizes!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mb-16">
            <div className="card p-10 text-center relative overflow-hidden group animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-400/10 rounded-full blur-[40px] -z-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-[2rem] flex items-center justify-center shadow-lg shadow-orange-500/40 transform group-hover:-translate-y-3 transition-transform duration-300">
                <Trophy className="w-12 h-12 text-white drop-shadow-md" />
              </div>
              <h3 className="text-3xl font-extrabold text-slate-800 mb-2">5 Matches</h3>
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 mb-2 drop-shadow-md">40%</div>
              <p className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-6">of prize pool</p>
              <div className="text-base text-slate-600 font-medium bg-orange-50 rounded-2xl p-5 border-2 border-orange-100 shadow-inner">
                <p className="font-extrabold text-orange-600 mb-1">Jackpot Winner!</p>
                <p>If no winner, rolls over to next month</p>
              </div>
            </div>

            <div className="card p-10 text-center relative overflow-hidden group animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/10 rounded-full blur-[40px] -z-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-lg shadow-blue-500/40 transform group-hover:-translate-y-3 transition-transform duration-300">
                <Trophy className="w-12 h-12 text-white drop-shadow-md" />
              </div>
              <h3 className="text-3xl font-extrabold text-slate-800 mb-2">4 Matches</h3>
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2 drop-shadow-md">35%</div>
              <p className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-6">of prize pool</p>
              <div className="text-base text-slate-600 font-medium bg-blue-50 rounded-2xl p-5 border-2 border-blue-100 shadow-inner">
                <p className="font-extrabold text-blue-600 mb-1">Great Performance!</p>
                <p>Split equally among winners</p>
              </div>
            </div>

            <div className="card p-10 text-center relative overflow-hidden group animate-slide-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-[40px] -z-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[2rem] flex items-center justify-center shadow-lg shadow-emerald-500/40 transform group-hover:-translate-y-3 transition-transform duration-300">
                <Trophy className="w-12 h-12 text-white drop-shadow-md" />
              </div>
              <h3 className="text-3xl font-extrabold text-slate-800 mb-2">3 Matches</h3>
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 mb-2 drop-shadow-md">25%</div>
              <p className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-6">of prize pool</p>
              <div className="text-base text-slate-600 font-medium bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-100 shadow-inner">
                <p className="font-extrabold text-emerald-600 mb-1">Nice Match!</p>
                <p>Split equally among winners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-slide-up">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-charity-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/40 hover:rotate-6 transition-transform">
                <Heart className="w-7 h-7 text-white drop-shadow-md" />
              </div>
              <span className="text-4xl font-black text-white tracking-tight drop-shadow-md">GolfHeart</span>
            </div>
            <p className="text-slate-400 mb-10 text-xl font-medium max-w-2xl mx-auto">
              Connecting golfers with causes that matter, one score at a time.
            </p>
            <Link href="/signup" className="btn-primary inline-flex items-center justify-center px-10 py-5 text-xl">
              Join the Community Now
            </Link>
          </div>

          <div className="border-t border-slate-800/80 mt-20 pt-10 text-center text-slate-500 font-medium">
            <p>&copy; 2026 GolfHeart. All rights reserved. Built with ❤️ for golfers who care.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
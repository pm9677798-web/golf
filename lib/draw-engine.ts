import { supabaseAdmin } from './supabase'

export interface DrawResult {
  winningNumbers: number[]
  totalPrizePool: number
  fiveMatchPool: number
  fourMatchPool: number
  threeMatchPool: number
  jackpotRollover: number
}

export async function calculatePrizePool(): Promise<number> {
  // Get all active subscribers
  const { data: activeUsers } = await (supabaseAdmin
    .from('users') as any)
    .select('subscription_plan, charity_contribution_percentage')
    .eq('subscription_status', 'active')

  if (!activeUsers) return 0

  let totalPool = 0
  
  activeUsers.forEach((user: any) => {
    const charityPercentage = user.charity_contribution_percentage || 10 // Default 10%
    const prizePoolPercentage = 100 - charityPercentage // Remaining goes to prize pool
    
    if (user.subscription_plan === 'monthly') {
      // Monthly: $29.99 - charity portion = prize pool portion
      const monthlyContribution = 29.99 * (prizePoolPercentage / 100)
      totalPool += monthlyContribution
    } else if (user.subscription_plan === 'yearly') {
      // Yearly: $299.99/12 - charity portion = prize pool portion  
      const yearlyMonthlyEquivalent = (299.99 / 12) * (prizePoolPercentage / 100)
      totalPool += yearlyMonthlyEquivalent
    }
  })

  return totalPool
}

export async function generateRandomNumbers(): Promise<number[]> {
  // Generate 5 unique random numbers between 1-45 (Stableford range)
  const numbers: number[] = []
  while (numbers.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1
    if (!numbers.includes(num)) {
      numbers.push(num)
    }
  }
  return numbers.sort((a, b) => a - b)
}

export async function generateSmartNumbers(): Promise<number[]> {
  // This function ensures there will be winners by analyzing existing user scores
  // and creating winning numbers that guarantee matches while maintaining fairness
  
  console.log('🎯 Starting Smart Number Generation...')
  
  // Get all eligible users (active with 5+ scores)
  const { data: eligibleUsers } = await (supabaseAdmin
    .from('users') as any)
    .select('id, first_name, email')
    .eq('subscription_status', 'active')

  if (!eligibleUsers || eligibleUsers.length === 0) {
    console.log('❌ No eligible users found, using random numbers')
    return generateRandomNumbers()
  }

  console.log(`✅ Found ${eligibleUsers.length} eligible users`)

  // Collect all user score sets
  const userScoreSets: { userId: string, userName: string, scores: number[] }[] = []
  
  for (const user of eligibleUsers) {
    const { data: userScores } = await (supabaseAdmin
      .from('golf_scores') as any)
      .select('score')
      .eq('user_id', user.id)
      .order('score_date', { ascending: false })
      .limit(5)

    if (userScores && userScores.length >= 5) {
      const scores = userScores.map(s => s.score)
      userScoreSets.push({
        userId: user.id,
        userName: user.first_name,
        scores: scores
      })
      console.log(`📊 ${user.first_name}: [${scores.join(', ')}]`)
    }
  }

  if (userScoreSets.length === 0) {
    console.log('❌ No users with 5+ scores found, using random numbers')
    return generateRandomNumbers()
  }

  console.log(`✅ Found ${userScoreSets.length} users with complete score sets`)

  // Analyze score patterns to create winning numbers that guarantee some winners
  const allScores = userScoreSets.flatMap(user => user.scores)
  const scoreFrequency: { [key: number]: number } = {}
  
  allScores.forEach(score => {
    scoreFrequency[score] = (scoreFrequency[score] || 0) + 1
  })

  // Sort scores by frequency (most common first)
  const sortedByFrequency = Object.entries(scoreFrequency)
    .sort(([, a], [, b]) => b - a)
    .map(([score, freq]) => ({ score: parseInt(score), frequency: freq }))

  console.log('📈 Top 10 most common scores:')
  sortedByFrequency.slice(0, 10).forEach(({ score, frequency }) => {
    console.log(`   Score ${score}: appears ${frequency} times`)
  })

  // Smart selection strategy:
  // - Include 2-3 very common scores (ensures multiple winners)
  // - Include 1-2 moderately common scores (balanced difficulty)
  // - Include 0-1 rare scores (maintains challenge)
  
  const winningNumbers: number[] = []
  
  // Add 2 most common scores (high winner probability)
  for (let i = 0; i < Math.min(2, sortedByFrequency.length); i++) {
    winningNumbers.push(sortedByFrequency[i].score)
  }
  
  // Add 2 moderately common scores (middle range)
  const midRange = sortedByFrequency.slice(2, Math.min(8, sortedByFrequency.length))
  for (let i = 0; i < Math.min(2, midRange.length); i++) {
    const randomMidScore = midRange[Math.floor(Math.random() * midRange.length)]
    if (!winningNumbers.includes(randomMidScore.score)) {
      winningNumbers.push(randomMidScore.score)
    }
  }
  
  // Add 1 less common score (maintains challenge)
  const lessCommon = sortedByFrequency.slice(8)
  if (lessCommon.length > 0 && winningNumbers.length < 5) {
    const randomRareScore = lessCommon[Math.floor(Math.random() * lessCommon.length)]
    if (!winningNumbers.includes(randomRareScore.score)) {
      winningNumbers.push(randomRareScore.score)
    }
  }
  
  // Fill any remaining slots with existing scores
  const remainingScores = sortedByFrequency
    .map(s => s.score)
    .filter(score => !winningNumbers.includes(score))
  
  while (winningNumbers.length < 5 && remainingScores.length > 0) {
    const randomIndex = Math.floor(Math.random() * remainingScores.length)
    winningNumbers.push(remainingScores[randomIndex])
    remainingScores.splice(randomIndex, 1)
  }
  
  // Final fallback with pure random if needed
  while (winningNumbers.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1
    if (!winningNumbers.includes(num)) {
      winningNumbers.push(num)
    }
  }

  const finalNumbers = winningNumbers.sort((a, b) => a - b)
  console.log(`🎯 Generated smart winning numbers: [${finalNumbers.join(', ')}]`)
  
  // Predict winners
  let predictedWinners = 0
  userScoreSets.forEach(user => {
    const matches = user.scores.filter(score => finalNumbers.includes(score)).length
    if (matches >= 3) {
      predictedWinners++
      console.log(`🏆 Predicted winner: ${user.userName} (${matches} matches)`)
    }
  })
  
  console.log(`🎊 Predicted total winners: ${predictedWinners}`)
  
  return finalNumbers
}

export async function generateAlgorithmicNumbers(): Promise<number[]> {
  // Get all user scores from eligible users (those with 5+ scores)
  const { data: eligibleUsers } = await (supabaseAdmin
    .from('users') as any)
    .select('id')
    .eq('subscription_status', 'active')

  if (!eligibleUsers || eligibleUsers.length === 0) {
    return generateRandomNumbers()
  }

  // Get all scores from eligible users
  const allUserScores: number[] = []
  
  for (const user of eligibleUsers) {
    const { data: userScores } = await (supabaseAdmin
      .from('golf_scores') as any)
      .select('score')
      .eq('user_id', user.id)
      .order('score_date', { ascending: false })
      .limit(5)

    if (userScores && userScores.length >= 5) {
      userScores.forEach(scoreRecord => {
        allUserScores.push(scoreRecord.score)
      })
    }
  }

  if (allUserScores.length === 0) {
    return generateRandomNumbers()
  }

  // Count frequency of each score
  const scoreFrequency: { [key: number]: number } = {}
  allUserScores.forEach(score => {
    scoreFrequency[score] = (scoreFrequency[score] || 0) + 1
  })

  // Get all unique scores that exist in the system
  const existingScores = Object.keys(scoreFrequency).map(score => parseInt(score))
  
  // Smart algorithm: Mix of common and uncommon scores to ensure winners
  const commonScores = Object.entries(scoreFrequency)
    .sort(([, a], [, b]) => b - a) // Most frequent first
    .slice(0, 10)
    .map(([score]) => parseInt(score))
  
  const uncommonScores = Object.entries(scoreFrequency)
    .sort(([, a], [, b]) => a - b) // Least frequent first
    .slice(0, 10)
    .map(([score]) => parseInt(score))

  const numbers: number[] = []
  
  // Strategy: Include 2-3 common scores (likely winners) and 2-3 uncommon scores (challenge)
  // This ensures we have winners while maintaining fairness
  
  // Add 2 common scores (high chance of matches)
  for (let i = 0; i < Math.min(2, commonScores.length); i++) {
    if (!numbers.includes(commonScores[i])) {
      numbers.push(commonScores[i])
    }
  }
  
  // Add 2 uncommon scores (lower chance but still possible)
  for (let i = 0; i < Math.min(2, uncommonScores.length); i++) {
    if (!numbers.includes(uncommonScores[i]) && numbers.length < 4) {
      numbers.push(uncommonScores[i])
    }
  }
  
  // Fill remaining with random selection from existing scores
  const remainingScores = existingScores.filter(score => !numbers.includes(score))
  while (numbers.length < 5 && remainingScores.length > 0) {
    const randomIndex = Math.floor(Math.random() * remainingScores.length)
    const selectedScore = remainingScores[randomIndex]
    numbers.push(selectedScore)
    remainingScores.splice(randomIndex, 1)
  }
  
  // If still not enough, fill with pure random (fallback)
  while (numbers.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1
    if (!numbers.includes(num)) {
      numbers.push(num)
    }
  }

  return numbers.sort((a, b) => a - b)
}

export async function runDraw(type: 'random' | 'algorithmic' | 'smart'): Promise<DrawResult> {
  const totalPrizePool = await calculatePrizePool()
  
  // Get previous jackpot rollover
  const { data: lastDraw } = await (supabaseAdmin
    .from('draws') as any)
    .select('jackpot_rollover')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const previousJackpot = (lastDraw as any)?.jackpot_rollover || 0
  const currentPool = totalPrizePool + previousJackpot

  // Prize distribution (40%, 35%, 25%)
  const fiveMatchPool = currentPool * 0.4
  const fourMatchPool = currentPool * 0.35
  const threeMatchPool = currentPool * 0.25

  let winningNumbers: number[]
  
  switch (type) {
    case 'random':
      winningNumbers = await generateRandomNumbers()
      break
    case 'algorithmic':
      winningNumbers = await generateAlgorithmicNumbers()
      break
    case 'smart':
      winningNumbers = await generateSmartNumbers()
      break
    default:
      winningNumbers = await generateRandomNumbers()
  }

  return {
    winningNumbers,
    totalPrizePool: currentPool,
    fiveMatchPool,
    fourMatchPool,
    threeMatchPool,
    jackpotRollover: 0, // Will be updated if no 5-match winners
  }
}

export function calculateMatches(userNumbers: number[], winningNumbers: number[]): number {
  return userNumbers.filter(num => winningNumbers.includes(num)).length
}

export async function processDrawResults(drawId: string, winningNumbers: number[]) {
  try {
    // Get all active users
    const { data: users, error: usersError } = await (supabaseAdmin
      .from('users') as any)
      .select('id, email, first_name, last_name')
      .eq('subscription_status', 'active')

    if (usersError || !users) {
      console.error('Error fetching users:', usersError)
      return []
    }

    const winners: any[] = []

    for (const user of users) {
      // Get user's latest 5 scores
      const { data: userScores, error: scoresError } = await (supabaseAdmin
        .from('golf_scores') as any)
        .select('score, score_date')
        .eq('user_id', user.id)
        .order('score_date', { ascending: false })
        .limit(5)

      if (scoresError || !userScores || userScores.length < 5) {
        continue // Skip users without 5 scores
      }

      const scores = userScores.map(s => s.score)
      const matches = calculateMatches(scores, winningNumbers)
      
      if (matches >= 3) {
        // Create draw entry
        const { data: entryData, error: entryError } = await (supabaseAdmin
          .from('draw_entries') as any)
          .insert({
            user_id: user.id,
            draw_id: drawId,
            user_numbers: scores,
            matches,
          })
          .select('id')
          .single()

        if (!entryError && entryData) {
          winners.push({
            userId: user.id,
            matches,
            matchType: `${matches}-match` as const,
          })
        }
      }
    }

    return winners
  } catch (error) {
    console.error('Error in processDrawResults:', error)
    return []
  }
}
import { supabaseAdmin } from './supabase'

// Cache for configuration values
const configCache = new Map<string, string>()
let cacheExpiry = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getSystemConfig(key: string): Promise<string | null> {
  // Check cache first
  const now = Date.now()
  if (now < cacheExpiry && configCache.has(key)) {
    return configCache.get(key) || null
  }

  try {
    const { data, error } = await (supabaseAdmin
      .from('system_config') as any)
      .select('config_value')
      .eq('config_key', key)
      .single()

    if (error || !data) {
      console.error(`Config key '${key}' not found:`, error)
      return null
    }

    // Update cache
    configCache.set(key, data.config_value)
    cacheExpiry = now + CACHE_DURATION

    return data.config_value
  } catch (error) {
    console.error(`Error fetching config '${key}':`, error)
    return null
  }
}

export async function getSystemConfigNumber(key: string, defaultValue: number = 0): Promise<number> {
  const value = await getSystemConfig(key)
  return value ? parseFloat(value) : defaultValue
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await (supabaseAdmin
      .from('admin_users') as any)
      .select('id')
      .eq('user_id', userId)
      .single()

    return !error && !!data
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

// Configuration keys constants
export const CONFIG_KEYS = {
  MONTHLY_PRICE: 'monthly_subscription_price',
  YEARLY_PRICE: 'yearly_subscription_price',
  DEFAULT_CHARITY_PERCENTAGE: 'default_charity_percentage',
  PRIZE_DISTRIBUTION_1ST: 'prize_distribution_1st',
  PRIZE_DISTRIBUTION_2ND: 'prize_distribution_2nd',
  PRIZE_DISTRIBUTION_3RD: 'prize_distribution_3rd',
  MAX_SCORES_KEPT: 'max_scores_kept',
  SCORE_RANGE_MIN: 'score_range_min',
  SCORE_RANGE_MAX: 'score_range_max',
  PRIZE_POOL_PERCENTAGE: 'prize_pool_percentage',
  DRAW_DAY_OF_MONTH: 'draw_day_of_month'
} as const
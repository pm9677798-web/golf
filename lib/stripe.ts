import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
})

export const SUBSCRIPTION_PLANS = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
    amount: 2999, // $29.99
    interval: 'month' as const,
  },
  yearly: {
    priceId: process.env.STRIPE_YEARLY_PRICE_ID!,
    amount: 29999, // $299.99 (discounted from $359.88)
    interval: 'year' as const,
  },
}

export const PRIZE_POOL_CONTRIBUTION = 0.6 // 60% of subscription goes to prize pool
export const CHARITY_CONTRIBUTION_MIN = 0.1 // 10% minimum to charity
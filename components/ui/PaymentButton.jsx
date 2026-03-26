import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function PaymentButton({ 
  plan, 
  email, 
  firstName, 
  lastName, 
  charityId, 
  charityContribution,
  onSuccess,
  onError,
  children 
}) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      // Create checkout session
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          email,
          firstName,
          lastName,
          charityId,
          charityContribution
        })
      })

      const { sessionId, url } = await response.json()

      if (response.ok) {
        // Redirect to Stripe Checkout
        window.location.href = url
      } else {
        onError?.('Payment setup failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      onError?.('Payment processing error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`btn-primary w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Processing...' : children || 'Complete Payment'}
    </button>
  )
}
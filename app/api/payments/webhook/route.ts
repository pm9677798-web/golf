import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '../../../../lib/stripe'
import { supabaseAdmin } from '../../../../lib/supabase'
import { hashPassword } from '../../../../lib/auth'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 })
    }

    // Handle successful subscription creation
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      // Get customer details
      const customer = await stripe.customers.retrieve(session.customer as string) as Stripe.Customer
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
      
      const metadata = session.metadata || {}
      
      // Create user account after successful payment
      const passwordHash = await hashPassword('temp_password_' + Date.now())
      
      const { data: user, error } = await (supabaseAdmin
        .from('users')
        .insert({
          email: customer.email!,
          password_hash: passwordHash, // User will set password later
          first_name: metadata.firstName || '',
          last_name: metadata.lastName || '',
          subscription_status: 'active' as const,
          subscription_plan: metadata.plan as 'monthly' | 'yearly',
          subscription_start_date: new Date(subscription.current_period_start * 1000).toISOString(),
          subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
          stripe_customer_id: session.customer as string,
          selected_charity_id: metadata.charityId || null,
          charity_contribution_percentage: parseInt(metadata.charityContribution || '10')
        })
        .select()
        .single() as any)

      if (error) {
        console.error('User creation error:', error)
        return NextResponse.json({ message: 'User creation failed' }, { status: 500 })
      }

      if (user) {
        console.log('User created successfully after payment:', user.email)
      }
    }

    // Handle subscription updates
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice
      
      // Update subscription status
      await (supabaseAdmin
        .from('users')
        .update({ 
          subscription_status: 'active' as const,
          subscription_end_date: new Date((invoice.lines.data[0].period?.end || 0) * 1000).toISOString()
        })
        .eq('stripe_customer_id', invoice.customer as string) as any)
    }

    // Handle failed payments
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice
      
      // Update subscription status to inactive
      await (supabaseAdmin
        .from('users')
        .update({ subscription_status: 'inactive' as const })
        .eq('stripe_customer_id', invoice.customer as string) as any)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ message: 'Webhook processing failed' }, { status: 500 })
  }
}
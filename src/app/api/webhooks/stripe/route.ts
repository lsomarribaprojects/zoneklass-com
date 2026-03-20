import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

/**
 * Stripe Webhook Handler
 *
 * Uses createServiceClient() (bypasses RLS) because webhooks
 * have no user session - Stripe calls this endpoint directly.
 *
 * Handles Stripe events:
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - checkout.session.completed (for one-time course purchases)
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    // Verify Stripe signature if configured
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (webhookSecret && signature) {
      try {
        // Dynamic import - stripe package must be installed when STRIPE_WEBHOOK_SECRET is set
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const Stripe = require('stripe')
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
        stripe.webhooks.constructEvent(body, signature, webhookSecret)
      } catch (err) {
        console.error('Stripe signature verification failed:', err)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
      }
    } else if (webhookSecret && !signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    } else {
      console.warn('STRIPE_WEBHOOK_SECRET not configured - signature not verified')
    }

    const event = JSON.parse(body)
    return await handleStripeEvent(event)
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleStripeEvent(event: { type: string; data: { object: any } }) {
  console.log('Stripe webhook received:', event.type)

  // Service client bypasses RLS - required for webhook operations without user session
  const supabase = createServiceClient()

  switch (event.type) {
    case 'customer.subscription.created': {
      const subscription = event.data.object
      const userId = subscription.metadata?.user_id

      if (!userId) {
        console.error('No user_id in subscription metadata')
        return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
      }

      const planId = subscription.metadata?.plan_id
      const billingCycle = subscription.items.data[0].price.recurring?.interval === 'year' ? 'yearly' : 'monthly'

      const { error } = await supabase
        .from('instructor_subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          status: subscription.status,
          billing_cycle: billingCycle,
          stripe_customer_id: subscription.customer,
          stripe_subscription_id: subscription.id,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end || false,
        })

      if (error) {
        console.error('Error inserting subscription:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object

      const { error } = await supabase
        .from('instructor_subscriptions')
        .update({
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end || false,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id)

      if (error) {
        console.error('Error updating subscription:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object

      const { error } = await supabase
        .from('instructor_subscriptions')
        .update({
          status: 'canceled',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id)

      if (error) {
        console.error('Error canceling subscription:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      break
    }

    case 'checkout.session.completed': {
      const session = event.data.object

      if (session.mode === 'subscription') {
        break
      }

      const courseId = session.metadata?.course_id
      const userId = session.metadata?.user_id
      const instructorId = session.metadata?.instructor_id
      const referralCode = session.metadata?.referral_code

      if (!courseId || !userId || !instructorId) {
        console.error('Missing metadata in checkout session')
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
      }

      const amountPaid = session.amount_total ? session.amount_total / 100 : 0
      const instructorEarnings = amountPaid * 0.7
      const platformFee = amountPaid * 0.3

      const { error: purchaseError } = await supabase
        .from('course_purchases')
        .insert({
          user_id: userId,
          course_id: courseId,
          amount_paid: amountPaid,
          instructor_earnings: instructorEarnings,
          platform_fee: platformFee,
          stripe_payment_intent_id: session.payment_intent,
          status: 'completed',
        })

      if (purchaseError) {
        console.error('Error inserting course purchase:', purchaseError)
        return NextResponse.json({ error: purchaseError.message }, { status: 500 })
      }

      // Auto-enroll student
      const { error: enrollError } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: userId,
          course_id: courseId,
        })

      if (enrollError) {
        console.error('Error enrolling student:', enrollError)
      }

      // Update instructor earnings
      const { error: earningsError } = await supabase.rpc('increment_instructor_earnings', {
        instructor_id: instructorId,
        amount: instructorEarnings,
      })

      if (earningsError) {
        console.error('Error updating instructor earnings:', earningsError)
      }

      // Update referral code if used
      if (referralCode) {
        const { error: referralError } = await supabase.rpc('increment_referral_usage', {
          p_code: referralCode,
          p_revenue: amountPaid,
        })

        if (referralError) {
          console.error('Error updating referral code:', referralError)
        }
      }

      break
    }

    default:
      console.log('Unhandled event type:', event.type)
  }

  return NextResponse.json({ received: true })
}

// src/app/api/webhooks/stripe/route.ts
import { createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia' as any,
  })

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: any
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const donId = session.metadata?.don_id
        if (donId) {
          await (supabase as any)
            .from('dons')
            .update({
              statut: 'complete',
              stripe_payment_intent_id: session.payment_intent as string,
            })
            .eq('id', donId)
        }
        break
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data.object
        await (supabase as any)
          .from('dons')
          .update({ statut: 'echoue' })
          .eq('stripe_payment_intent_id', intent.id)
        break
      }
      case 'charge.refunded': {
        const charge = event.data.object
        if (charge.payment_intent) {
          await (supabase as any)
            .from('dons')
            .update({ statut: 'rembourse' })
            .eq('stripe_payment_intent_id', charge.payment_intent as string)
        }
        break
      }
    }
  } catch (error) {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

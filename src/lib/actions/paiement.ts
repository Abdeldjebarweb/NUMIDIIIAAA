// src/lib/actions/paiement.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function creerSessionDon(montant: number, anonyme: boolean, message?: string) {
  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia' as any,
  })

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!montant || montant < 1 || montant > 10000) {
    throw new Error('Montant invalide (entre 1€ et 10 000€)')
  }

  let nomDonateur: string | null = null
  let emailDonateur: string | null = null

  if (user && !anonyme) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('nom, prenom, email')
      .eq('id', user.id)
      .single()
    if (profile) {
      nomDonateur = `${(profile as any).prenom} ${(profile as any).nom}`
      emailDonateur = (profile as any).email
    }
  }

  const { data: don } = await (supabase as any)
    .from('dons')
    .insert({
      profile_id: user?.id ?? null,
      nom: anonyme ? null : nomDonateur,
      email: anonyme ? null : emailDonateur,
      montant,
      devise: 'EUR',
      statut: 'en_attente',
      anonyme,
      message: message ?? null,
    })
    .select('id')
    .single()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Don à l\'AEAB',
          description: 'Association des Étudiants Algériens à Bordeaux – Association loi 1901',
        },
        unit_amount: Math.round(montant * 100),
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/don/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/don`,
    customer_email: !anonyme && emailDonateur ? emailDonateur : undefined,
    metadata: {
      don_id: don?.id ?? '',
      user_id: user?.id ?? '',
      anonyme: String(anonyme),
    },
    locale: 'fr',
  })

  if (don?.id) {
    await (supabase as any)
      .from('dons')
      .update({ stripe_session_id: session.id })
      .eq('id', don.id)
  }

  redirect(session.url!)
}

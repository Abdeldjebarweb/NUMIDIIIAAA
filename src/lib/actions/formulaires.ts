// src/lib/actions/formulaires.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import {
  sendConfirmationAdhesion,
  sendAlertNouvelleAdhesion,
  sendConfirmationInscription,
  sendAlertDemandeUrgente,
} from '@/lib/emails'

export type ActionResult = { success?: string; error?: string }

// ── Adhésion ──────────────────────────────────────────────────────────────────

const AdhesionSchema = z.object({
  nom: z.string().min(2, 'Nom trop court'),
  prenom: z.string().min(2, 'Prénom trop court'),
  email: z.string().email('Email invalide'),
  telephone: z.string().optional(),
  etablissement: z.string().min(2, 'Établissement requis'),
  filiere: z.string().optional(),
  niveau: z.string().optional(),
  annee_arrivee: z.coerce.number().min(2010).max(2030).optional(),
  message: z.string().optional(),
})

export async function soumettreAdhesion(formData: FormData): Promise<ActionResult> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const raw = Object.fromEntries(formData.entries())
  const parsed = AdhesionSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const { data: existing } = await supabase
    .from('adhesions')
    .select('id, statut')
    .eq('email', parsed.data.email)
    .maybeSingle()

  if (existing?.statut === 'en_attente') return { error: 'Une demande est déjà en cours pour cet email.' }
  if (existing?.statut === 'approuve') return { error: 'Vous êtes déjà membre de l\'AEAB !' }

  const { error } = await supabase.from('adhesions').insert({
    ...parsed.data,
    profile_id: user?.id ?? null,
    statut: 'en_attente',
  })

  if (error) return { error: 'Erreur lors de l\'envoi. Réessayez.' }

  // Emails en parallèle
  await Promise.all([
    sendConfirmationAdhesion(parsed.data.email, parsed.data.prenom),
    sendAlertNouvelleAdhesion(parsed.data.prenom, parsed.data.nom, parsed.data.etablissement),
  ])

  return { success: '🎉 Demande envoyée ! Vous recevrez une réponse sous 48h.' }
}

// ── Demande d'aide ────────────────────────────────────────────────────────────

const DemandeAideSchema = z.object({
  nom: z.string().min(2),
  prenom: z.string().min(2),
  email: z.string().email(),
  telephone: z.string().optional(),
  type_aide: z.enum(['logement', 'alimentaire', 'administratif', 'sante', 'psychologique', 'financier', 'autre']),
  description: z.string().min(20, 'Décrivez votre situation (minimum 20 caractères)'),
  urgence: z.enum(['normal', 'urgent', 'tres_urgent']),
})

export async function soumettreDemandeAide(formData: FormData): Promise<ActionResult> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const raw = Object.fromEntries(formData.entries())
  const parsed = DemandeAideSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const { error } = await supabase.from('demandes_aide').insert({
    ...parsed.data,
    profile_id: user?.id ?? null,
    statut: 'en_attente',
  })

  if (error) return { error: 'Erreur lors de l\'envoi. Réessayez.' }

  if (['urgent', 'tres_urgent'].includes(parsed.data.urgence)) {
    await sendAlertDemandeUrgente(
      parsed.data.prenom,
      parsed.data.nom,
      parsed.data.type_aide,
      parsed.data.urgence,
      parsed.data.email
    )
  }

  return { success: '🆘 Demande reçue ! Un membre vous contactera très rapidement.' }
}

// ── Contact ───────────────────────────────────────────────────────────────────

const ContactSchema = z.object({
  nom: z.string().min(2),
  email: z.string().email(),
  sujet: z.string().optional(),
  message: z.string().min(10),
})

export async function soumettreContact(formData: FormData): Promise<ActionResult> {
  const supabase = createClient()
  const raw = Object.fromEntries(formData.entries())
  const parsed = ContactSchema.safeParse(raw)
  if (!parsed.success) return { error: 'Veuillez remplir tous les champs obligatoires.' }

  const { error } = await supabase.from('contacts').insert(parsed.data)
  if (error) return { error: 'Erreur lors de l\'envoi. Réessayez.' }

  return { success: '✅ Message envoyé ! Nous vous répondons sous 48h.' }
}

// ── Inscription événement ─────────────────────────────────────────────────────

const InscriptionSchema = z.object({
  evenement_id: z.string().uuid(),
  nom: z.string().min(2),
  prenom: z.string().min(2),
  email: z.string().email(),
  nombre_places: z.coerce.number().min(1).max(4),
})

export async function inscrireEvenement(formData: FormData): Promise<ActionResult> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Vous devez être connecté pour vous inscrire.' }

  const raw = Object.fromEntries(formData.entries())
  const parsed = InscriptionSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const { data: evenement } = await supabase
    .from('evenements')
    .select('titre, date_debut, lieu, capacite, inscriptions_ouvertes')
    .eq('id', parsed.data.evenement_id)
    .single()

  if (!evenement?.inscriptions_ouvertes) return { error: 'Les inscriptions sont fermées pour cet événement.' }

  const { count: inscrits } = await supabase
    .from('inscriptions_evenements')
    .select('*', { count: 'exact', head: true })
    .eq('evenement_id', parsed.data.evenement_id)
    .eq('statut', 'confirmee')

  if ((inscrits ?? 0) >= (evenement?.capacite ?? 0)) {
    return { error: 'L\'événement est complet. Contactez-nous pour la liste d\'attente.' }
  }

  const { error } = await supabase.from('inscriptions_evenements').insert({
    ...parsed.data,
    profile_id: user.id,
    statut: 'confirmee',
  })

  if (error) {
    if (error.code === '23505') return { error: 'Vous êtes déjà inscrit(e) à cet événement.' }
    return { error: 'Erreur lors de l\'inscription.' }
  }

  // Email de confirmation
  if (evenement) {
    const dateStr = new Date(evenement.date_debut).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
    await sendConfirmationInscription(
      parsed.data.email,
      parsed.data.prenom,
      evenement.titre,
      dateStr,
      evenement.lieu ?? 'Bordeaux'
    )
  }

  revalidatePath('/evenements')
  revalidatePath(`/evenements/${parsed.data.evenement_id}`)
  return { success: '🎟 Inscription confirmée ! Un email de confirmation vous a été envoyé.' }
}

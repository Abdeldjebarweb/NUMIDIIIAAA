// src/lib/actions/admin.ts
'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendAdhesionApprouvee, sendConfirmationDon } from '@/lib/emails'

export type ActionResult = { success?: string; error?: string }

async function requireAdmin() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  const { data: profile } = await (supabase as any).from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'bureau'].includes(profile.role)) throw new Error('Accès refusé')
  return { supabase, adminClient: createAdminClient(), user, profile }
}

// ── Membres ───────────────────────────────────────────────────────────────────

export async function validerAdhesion(adhesionId: string): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireAdmin()

    const { data: adhesion } = await (supabase as any).from('adhesions').select('*').eq('id', adhesionId).single()
    if (!adhesion) return { error: 'Adhésion introuvable' }

    await (supabase as any).from('adhesions').update({
      statut: 'approuve',
      traite_par: user.id,
      traite_le: new Date().toISOString(),
    }).eq('id', adhesionId)

    if (adhesion.profile_id) {
      await (supabase as any).from('profiles').update({ statut: 'actif' }).eq('id', adhesion.profile_id)
      await (supabase as any).from('notifications').insert({
        profile_id: adhesion.profile_id,
        titre: '🎉 Adhésion approuvée !',
        message: 'Votre adhésion à l\'AEAB a été approuvée. Bienvenue dans la communauté !',
        type: 'succes',
        lien: '/profil',
      })
    }

    // Email au candidat
    await sendAdhesionApprouvee(adhesion.email, adhesion.prenom)

    revalidatePath('/admin/membres')
    return { success: `Adhésion de ${adhesion.prenom} ${adhesion.nom} approuvée !` }
  } catch (e: any) { return { error: e.message } }
}

export async function refuserAdhesion(adhesionId: string): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireAdmin()
    await (supabase as any).from('adhesions').update({
      statut: 'refuse',
      traite_par: user.id,
      traite_le: new Date().toISOString(),
    }).eq('id', adhesionId)
    revalidatePath('/admin/membres')
    return { success: 'Adhésion refusée.' }
  } catch (e: any) { return { error: e.message } }
}

export async function changerRoleMembre(profileId: string, role: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    await (supabase as any).from('profiles').update({ role: role as any }).eq('id', profileId)
    revalidatePath('/admin/membres')
    return { success: 'Rôle mis à jour.' }
  } catch (e: any) { return { error: e.message } }
}

// ── Événements ────────────────────────────────────────────────────────────────

export async function creerEvenement(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireAdmin()
    const data = {
      titre: formData.get('titre') as string,
      description: formData.get('description') as string || null,
      contenu: formData.get('contenu') as string || null,
      date_debut: formData.get('date_debut') as string,
      date_fin: formData.get('date_fin') as string || null,
      lieu: formData.get('lieu') as string || null,
      adresse: formData.get('adresse') as string || null,
      capacite: parseInt(formData.get('capacite') as string) || 50,
      categorie: formData.get('categorie') as any,
      statut: formData.get('statut') as any || 'publie',
      inscriptions_ouvertes: formData.get('inscriptions_ouvertes') === 'true',
      cree_par: user.id,
    }
    if (!data.titre || !data.date_debut) return { error: 'Titre et date sont obligatoires.' }
    const { error } = await (supabase as any).from('evenements').insert(data)
    if (error) return { error: 'Erreur création : ' + error.message }
    revalidatePath('/evenements')
    revalidatePath('/admin/evenements')
    return { success: 'Événement créé avec succès !' }
  } catch (e: any) { return { error: e.message } }
}

export async function modifierEvenement(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const data = {
      titre: formData.get('titre') as string,
      description: formData.get('description') as string || null,
      date_debut: formData.get('date_debut') as string,
      date_fin: formData.get('date_fin') as string || null,
      lieu: formData.get('lieu') as string || null,
      adresse: formData.get('adresse') as string || null,
      capacite: parseInt(formData.get('capacite') as string) || 50,
      categorie: formData.get('categorie') as any,
      statut: formData.get('statut') as any,
      inscriptions_ouvertes: formData.get('inscriptions_ouvertes') === 'true',
    }
    await (supabase as any).from('evenements').update(data).eq('id', id)
    revalidatePath('/evenements')
    revalidatePath('/admin/evenements')
    return { success: 'Événement modifié !' }
  } catch (e: any) { return { error: e.message } }
}

export async function supprimerEvenement(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    await (supabase as any).from('evenements').delete().eq('id', id)
    revalidatePath('/evenements')
    revalidatePath('/admin/evenements')
    return { success: 'Événement supprimé.' }
  } catch (e: any) { return { error: e.message } }
}

// ── Demandes d'aide ───────────────────────────────────────────────────────────

export async function prendreEnCharge(demandeId: string): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireAdmin()
    await (supabase as any).from('demandes_aide').update({ statut: 'en_cours', traite_par: user.id }).eq('id', demandeId)
    revalidatePath('/admin/demandes')
    return { success: 'Demande prise en charge.' }
  } catch (e: any) { return { error: e.message } }
}

export async function cloturerDemande(demandeId: string, notes?: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    await (supabase as any).from('demandes_aide').update({
      statut: 'traite',
      notes_internes: notes || null,
    }).eq('id', demandeId)
    revalidatePath('/admin/demandes')
    return { success: 'Demande clôturée.' }
  } catch (e: any) { return { error: e.message } }
}

// ── Actualités ────────────────────────────────────────────────────────────────

export async function creerActualite(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, user } = await requireAdmin()
    const titre = formData.get('titre') as string
    if (!titre) return { error: 'Le titre est obligatoire.' }

    const slug = titre.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      + '-' + Date.now()

    const { error } = await (supabase as any).from('actualites').insert({
      titre,
      slug,
      extrait: formData.get('extrait') as string || null,
      contenu: formData.get('contenu') as string,
      categorie: formData.get('categorie') as any,
      statut: formData.get('statut') as any || 'publie',
      mis_en_avant: formData.get('mis_en_avant') === 'true',
      image_url: formData.get('image_url') as string || null,
      cree_par: user.id,
    })
    if (error) return { error: error.message }
    revalidatePath('/actualites')
    revalidatePath('/admin/actualites')
    return { success: 'Article publié !' }
  } catch (e: any) { return { error: e.message } }
}

export async function supprimerActualite(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    await (supabase as any).from('actualites').delete().eq('id', id)
    revalidatePath('/actualites')
    revalidatePath('/admin/actualites')
    return { success: 'Article supprimé.' }
  } catch (e: any) { return { error: e.message } }
}

// ── Dons ──────────────────────────────────────────────────────────────────────

export async function envoyerRecuFiscal(donId: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin()
    const { data: don } = await (supabase as any).from('dons').select('*').eq('id', donId).single()
    if (!don || !don.email) return { error: 'Don ou email introuvable' }

    await sendConfirmationDon(don.email, don.nom ?? 'Donateur', Number(don.montant), don.id)
    await (supabase as any).from('dons').update({ recu_envoye: true }).eq('id', donId)

    revalidatePath('/admin/dons')
    return { success: `Reçu fiscal envoyé à ${don.email}` }
  } catch (e: any) { return { error: e.message } }
}

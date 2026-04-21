// src/lib/actions/auth.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// ============================================================
// Schémas de validation
// ============================================================

const LoginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
})

const RegisterSchema = z.object({
  nom: z.string().min(2, 'Nom trop court'),
  prenom: z.string().min(2, 'Prénom trop court'),
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Au moins une majuscule')
    .regex(/[0-9]/, 'Au moins un chiffre'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

// ============================================================
// Actions
// ============================================================

export type ActionResult = {
  success?: string
  error?: string
}

export async function login(formData: FormData): Promise<ActionResult> {
  const supabase = createClient()

  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const parsed = LoginSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    if (error.message === 'Invalid login credentials') {
      return { error: 'Email ou mot de passe incorrect' }
    }
    if (error.message === 'Email not confirmed') {
      return { error: 'Veuillez confirmer votre email avant de vous connecter' }
    }
    return { error: 'Erreur de connexion. Réessayez.' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function register(formData: FormData): Promise<ActionResult> {
  const supabase = createClient()

  const raw = {
    nom: formData.get('nom') as string,
    prenom: formData.get('prenom') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const parsed = RegisterSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        nom: parsed.data.nom,
        prenom: parsed.data.prenom,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'Cet email est déjà utilisé' }
    }
    return { error: 'Erreur lors de la création du compte' }
  }

  return {
    success: 'Compte créé ! Vérifiez votre email pour confirmer votre inscription.'
  }
}

export async function logout(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function resetPassword(email: string): Promise<ActionResult> {
  const supabase = createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  })

  if (error) {
    return { error: 'Erreur lors de l\'envoi du mail de réinitialisation' }
  }

  return { success: 'Email envoyé ! Vérifiez votre boîte de réception.' }
}

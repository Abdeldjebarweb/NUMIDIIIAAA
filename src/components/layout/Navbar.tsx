// src/components/layout/Navbar.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/lib/actions/auth'
import NavbarClient from './NavbarClient'

export default async function Navbar() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile: any = null
  let isAdmin = false

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('nom, prenom, role, statut')
      .eq('id', user.id)
      .single()
    profile = data as any
    isAdmin = ['admin', 'bureau'].includes(profile?.role ?? '')
  }

  return (
    <NavbarClient
      user={user ? { email: user.email!, nom: profile?.nom, prenom: profile?.prenom } : null}
      isAdmin={isAdmin}
      logoutAction={logout}
    />
  )
}

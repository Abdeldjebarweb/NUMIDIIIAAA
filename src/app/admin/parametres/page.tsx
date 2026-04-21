// src/app/admin/parametres/page.tsx
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ParametresClient from './ParametresClient'
import type { Profile } from '@/types/database'

export const metadata = { title: 'Admin – Paramètres' }

export default async function AdminParametresPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: p } = await supabase.from('profiles').select('role, nom, prenom, email').eq('id', user.id).single()
  if (!['admin'].includes((p as any)?.role ?? '')) redirect('/admin')
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--off-white)' }}>
      <AdminSidebar active="parametres" />
      <main className="flex-1 p-6 overflow-auto">
        <ParametresClient profile={p as Profile | null} />
      </main>
    </div>
  )
}

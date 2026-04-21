// src/app/admin/evenements/page.tsx
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import EvenementsAdminClient from './EvenementsAdminClient'
import type { Evenement } from '@/types/database'

export const metadata = { title: 'Admin – Événements' }

export default async function AdminEvenementsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'bureau'].includes((p as any)?.role ?? '')) redirect('/')
  const { data } = await supabase.from('evenements').select('*').order('date_debut', { ascending: false })
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--off-white)' }}>
      <AdminSidebar active="evenements" />
      <main className="flex-1 p-6 overflow-auto">
        <EvenementsAdminClient evenements={(data ?? []) as Evenement[]} />
      </main>
    </div>
  )
}

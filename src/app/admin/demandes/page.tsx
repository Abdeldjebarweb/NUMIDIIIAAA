// src/app/admin/demandes/page.tsx
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import DemandesClient from './DemandesClient'
import type { DemandeAide } from '@/types/database'

export const metadata = { title: 'Admin – Demandes d\'aide' }

export default async function AdminDemandesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'bureau'].includes((p as any)?.role ?? '')) redirect('/')
  const { data } = await supabase.from('demandes_aide').select('*').order('created_at', { ascending: false })
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--off-white)' }}>
      <AdminSidebar active="demandes" />
      <main className="flex-1 p-6 overflow-auto">
        <DemandesClient demandes={(data ?? []) as DemandeAide[]} />
      </main>
    </div>
  )
}

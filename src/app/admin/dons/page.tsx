// src/app/admin/dons/page.tsx
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import DonsClient from './DonsClient'
import type { Don } from '@/types/database'

export const metadata = { title: 'Admin – Dons' }

export default async function AdminDonsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'bureau'].includes((p as any)?.role ?? '')) redirect('/')
  const [{ data: donsData }, { data: statsData }] = await Promise.all([
    supabase.from('dons').select('*').order('created_at', { ascending: false }),
    supabase.from('stats_dashboard').select('dons_ce_mois, dons_cette_annee').single(),
  ])
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--off-white)' }}>
      <AdminSidebar active="dons" />
      <main className="flex-1 p-6 overflow-auto">
        <DonsClient
          dons={(donsData ?? []) as Don[]}
          stats={statsData as any}
        />
      </main>
    </div>
  )
}

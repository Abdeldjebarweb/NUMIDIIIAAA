// src/app/admin/membres/page.tsx
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import MembresClient from './MembresClient'
import type { Adhesion, Profile } from '@/types/database'

export const metadata = { title: 'Admin – Membres' }

export default async function AdminMembresPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profileData } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'bureau'].includes((profileData as any)?.role ?? '')) redirect('/')

  const [{ data: adhesionsData }, { data: membresData }] = await Promise.all([
    supabase.from('adhesions').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
  ])

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--off-white)' }}>
      <AdminSidebar active="membres" />
      <main className="flex-1 p-6 overflow-auto">
        <MembresClient
          adhesions={(adhesionsData ?? []) as Adhesion[]}
          membres={(membresData ?? []) as Profile[]}
        />
      </main>
    </div>
  )
}

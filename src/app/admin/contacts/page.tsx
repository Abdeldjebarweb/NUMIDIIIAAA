// src/app/admin/contacts/page.tsx
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ContactsAdminClient from './ContactsAdminClient'
import type { Contact } from '@/types/database'

export const metadata = { title: 'Admin – Messages' }

export default async function AdminContactsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!['admin', 'bureau'].includes((p as any)?.role ?? '')) redirect('/')
  const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--off-white)' }}>
      <AdminSidebar active="contacts" />
      <main className="flex-1 p-6 overflow-auto">
        <ContactsAdminClient contacts={(data ?? []) as Contact[]} />
      </main>
    </div>
  )
}

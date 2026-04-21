// src/app/profil/page.tsx
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProfilClient from './ProfilClient'
import type { Profile, Adhesion } from '@/types/database'

export const metadata = { title: 'Mon profil' }

export default async function ProfilPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/profil')

  const { data: profileData } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  const { data: adhesionData } = await supabase
    .from('adhesions').select('*').eq('email', user.email!).order('created_at', { ascending: false }).limit(1).single()

  const { data: inscriptionsData } = await supabase
    .from('inscriptions_evenements')
    .select('id, statut, created_at, evenements(titre, date_debut, lieu)')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const profile = profileData as Profile | null
  const adhesion = adhesionData as Adhesion | null

  return (
    <>
      <Navbar />
      <main>
        <div className="py-10 px-6" style={{ background: 'var(--green)', color: '#fff' }}>
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{ background: 'rgba(255,255,255,0.2)' }}>
              {profile?.prenom?.[0]}{profile?.nom?.[0]}
            </div>
            <div>
              <h1 className="font-playfair text-3xl">{profile?.prenom} {profile?.nom}</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>{user.email} · {profile?.role}</p>
            </div>
          </div>
        </div>
        <ProfilClient
          profile={profile}
          adhesion={adhesion}
          inscriptions={(inscriptionsData ?? []) as any[]}
        />
      </main>
      <Footer />
    </>
  )
}

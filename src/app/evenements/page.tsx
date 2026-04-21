// src/app/evenements/page.tsx
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import EvenementsClient from './EvenementsClient'

export const metadata = { title: 'Événements' }

export default async function EvenementsPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('evenements')
    .select('*')
    .eq('statut', 'publie')
    .order('date_debut', { ascending: true })

  return (
    <>
      <Navbar />
      <main>
        <div className="py-10 px-6" style={{ background: 'var(--green)', color: '#fff' }}>
          <div className="max-w-6xl mx-auto">
            <h1 className="font-playfair text-4xl mb-2">Événements</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Découvrez et inscrivez-vous à toutes nos activités</p>
          </div>
        </div>
        <EvenementsClient evenements={(data ?? []) as any[]} />
      </main>
      <Footer />
    </>
  )
}

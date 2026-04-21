// src/app/actualites/page.tsx
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Actualite } from '@/types/database'

export const metadata = { title: 'Actualités' }

const CAT_BADGE: Record<string, string> = {
  association: 'badge-green', urgent: 'badge-red', partenariat: 'badge-yellow',
  rapport: 'badge-gray', guide: 'badge-green',
}

const CAT_EMOJI: Record<string, string> = {
  urgent: '🚨', partenariat: '🤝', rapport: '📊', guide: '📚',
}

export default async function ActualitesPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('actualites')
    .select('*')
    .eq('statut', 'publie')
    .order('created_at', { ascending: false })

  const actualites = (data ?? []) as Actualite[]

  return (
    <>
      <Navbar />
      <main>
        <div className="py-10 px-6" style={{ background: 'var(--green)', color: '#fff' }}>
          <div className="max-w-6xl mx-auto">
            <h1 className="font-playfair text-4xl mb-2">Actualités</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Les dernières nouvelles de l'AEAB et de la communauté</p>
          </div>
        </div>
        <div className="section">
          <div className="grid md:grid-cols-3 gap-5">
            {actualites.length > 0 ? actualites.map((a: Actualite) => (
              <Link key={a.id} href={`/actualites/${a.slug}`} className="card no-underline group cursor-pointer">
                <div
                  className="h-40 rounded-lg flex items-center justify-center text-4xl mb-4"
                  style={{ background: a.categorie === 'urgent' ? 'var(--red-light)' : 'var(--green-light)' }}
                >
                  {CAT_EMOJI[a.categorie] ?? '📰'}
                </div>
                <span className={CAT_BADGE[a.categorie] ?? 'badge-gray'}>{a.categorie}</span>
                <h3 className="font-semibold text-base mt-2 mb-2 group-hover:underline">{a.titre}</h3>
                {a.extrait && (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{a.extrait}</p>
                )}
                <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                  📅 {format(new Date(a.created_at), 'd MMMM yyyy', { locale: fr })}
                </p>
              </Link>
            )) : (
              <div className="col-span-3 text-center py-16" style={{ color: 'var(--text-muted)' }}>
                <div className="text-5xl mb-3">📰</div>
                <p>Aucune actualité publiée pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

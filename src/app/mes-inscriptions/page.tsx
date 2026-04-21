// src/app/mes-inscriptions/page.tsx
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export const metadata = { title: 'Mes inscriptions' }

export default async function MesInscriptionsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/mes-inscriptions')

  const { data } = await supabase
    .from('inscriptions_evenements')
    .select('id, statut, created_at, evenements(id, titre, date_debut, lieu, categorie)')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })

  const inscriptions = (data ?? []) as any[]
  const now = new Date()
  const avenir = inscriptions.filter(i => i.evenements && new Date(i.evenements.date_debut) >= now)
  const passes = inscriptions.filter(i => i.evenements && new Date(i.evenements.date_debut) < now)

  return (
    <>
      <Navbar />
      <main>
        <div className="py-10 px-6" style={{ background: 'var(--green)', color: '#fff' }}>
          <div className="max-w-4xl mx-auto">
            <h1 className="font-playfair text-4xl mb-2">Mes inscriptions</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Vos événements passés et à venir</p>
          </div>
        </div>
        <div className="section max-w-4xl">
          {inscriptions.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📅</div>
              <h2 className="font-playfair text-2xl mb-3">Aucune inscription</h2>
              <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Vous n'êtes inscrit à aucun événement.</p>
              <Link href="/evenements" className="btn-primary no-underline px-6 py-3 rounded-full">Voir les événements</Link>
            </div>
          )}

          {avenir.length > 0 && (
            <div className="mb-8">
              <h2 className="font-playfair text-2xl mb-5">À venir ({avenir.length})</h2>
              <div className="flex flex-col gap-4">
                {avenir.map((ins: any) => {
                  const evt = ins.evenements
                  if (!evt) return null
                  const date = new Date(evt.date_debut)
                  return (
                    <Link key={ins.id} href={`/evenements/${evt.id}`}
                      className="bg-white rounded-xl p-5 flex gap-4 items-start no-underline hover:shadow-md transition-all"
                      style={{ border: '1px solid var(--green)', boxShadow: '0 0 0 2px rgba(0,98,51,0.08)' }}>
                      <div className="rounded-xl p-3 text-center min-w-[60px] flex-shrink-0"
                        style={{ background: 'var(--green)', color: '#fff' }}>
                        <div className="text-xl font-bold font-playfair leading-none">
                          {format(date, 'd', { locale: fr })}
                        </div>
                        <div className="text-xs uppercase tracking-wide opacity-90">
                          {format(date, 'MMM', { locale: fr })}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{evt.titre}</h3>
                        <div className="flex gap-3 flex-wrap text-xs" style={{ color: 'var(--text-muted)' }}>
                          {evt.lieu && <span>📍 {evt.lieu}</span>}
                          <span>🕐 {format(date, 'HH:mm', { locale: fr })}</span>
                          <span className="badge-green">{ins.statut}</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {passes.length > 0 && (
            <div>
              <h2 className="font-playfair text-2xl mb-5" style={{ color: 'var(--text-muted)' }}>
                Passés ({passes.length})
              </h2>
              <div className="flex flex-col gap-3">
                {passes.map((ins: any) => {
                  const evt = ins.evenements
                  if (!evt) return null
                  return (
                    <div key={ins.id} className="p-4 rounded-xl flex items-center gap-4 opacity-65"
                      style={{ background: 'var(--off-white)', border: '1px solid var(--border)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-muted)', minWidth: 80 }}>
                        {format(new Date(evt.date_debut), 'd MMM yyyy', { locale: fr })}
                      </div>
                      <div className="flex-1 font-medium text-sm">{evt.titre}</div>
                      <span className="badge-gray">Terminé</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

// src/app/evenements/[id]/page.tsx
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import InscriptionForm from './InscriptionForm'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params
  const supabase = createClient()
  const { data } = await supabase
    .from('evenements')
    .select('titre, description')
    .eq('id', id)
    .single()
  return { title: (data as any)?.titre ?? 'Événement' }
}

export default async function EvenementDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: evtData } = await supabase
    .from('evenements')
    .select('*')
    .eq('id', id)
    .eq('statut', 'publie')
    .single()

  const evt = evtData as any
  if (!evt) notFound()

  const { count: nbInscrits } = await supabase
    .from('inscriptions_evenements')
    .select('*', { count: 'exact', head: true })
    .eq('evenement_id', id)
    .eq('statut', 'confirmee')

  let dejaInscrit = false
  if (user) {
    const { data: ins } = await supabase
      .from('inscriptions_evenements')
      .select('id')
      .eq('evenement_id', id)
      .eq('profile_id', user.id)
      .single()
    dejaInscrit = !!ins
  }

  const placesRestantes = (evt.capacite ?? 50) - (nbInscrits ?? 0)
  const dateDebut = new Date(evt.date_debut)
  const dateFin = evt.date_fin ? new Date(evt.date_fin) : null

  return (
    <>
      <Navbar />
      <main>
        <div className="py-10 px-6" style={{ background: 'var(--green)', color: '#fff' }}>
          <div className="max-w-4xl mx-auto">
            <Link href="/evenements" className="text-sm no-underline mb-4 block"
              style={{ color: 'rgba(255,255,255,0.7)' }}>
              ← Tous les événements
            </Link>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
              {evt.categorie}
            </span>
            <h1 className="font-playfair text-4xl mb-3">{evt.titre}</h1>
            <div className="flex flex-wrap gap-5 text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
              <span>📅 {format(dateDebut, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}</span>
              {dateFin && <span>→ {format(dateFin, 'HH:mm', { locale: fr })}</span>}
              {evt.lieu && <span>📍 {evt.lieu}</span>}
              <span>👥 {nbInscrits ?? 0} / {evt.capacite} inscrits</span>
            </div>
          </div>
        </div>

        <div className="section max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
                <h2 className="font-playfair text-xl mb-4">À propos de cet événement</h2>
                {evt.description && (
                  <p className="text-sm mb-4" style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                    {evt.description}
                  </p>
                )}
                {evt.contenu && (
                  <div className="text-sm" style={{ lineHeight: 1.8 }}
                    dangerouslySetInnerHTML={{ __html: evt.contenu }} />
                )}
                {!evt.description && !evt.contenu && (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Rejoignez-nous pour cet événement de l&apos;AEAB !
                  </p>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
                <h2 className="font-playfair text-xl mb-4">Infos pratiques</h2>
                <div className="space-y-3">
                  {[
                    { icon: '📅', label: 'Date', val: format(dateDebut, "EEEE d MMMM yyyy", { locale: fr }) },
                    { icon: '🕐', label: 'Heure', val: format(dateDebut, 'HH:mm', { locale: fr }) + (dateFin ? ` – ${format(dateFin, 'HH:mm', { locale: fr })}` : '') },
                    evt.lieu ? { icon: '📍', label: 'Lieu', val: evt.lieu } : null,
                    evt.adresse ? { icon: '🗺', label: 'Adresse', val: evt.adresse } : null,
                    { icon: '👥', label: 'Capacité', val: `${evt.capacite} personnes max` },
                    { icon: '💶', label: 'Tarif membres', val: evt.prix_membre === 0 ? 'Gratuit' : `${evt.prix_membre}€` },
                  ].filter(Boolean).map((item) => item && (
                    <div key={item.label} className="flex items-center gap-3 py-2 border-b last:border-0"
                      style={{ borderColor: 'var(--border)' }}>
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-medium w-24 flex-shrink-0">{item.label}</span>
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl p-5 sticky top-20" style={{ border: '1px solid var(--border)' }}>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-muted)' }}>Places disponibles</span>
                    <span className="font-semibold"
                      style={{ color: placesRestantes <= 5 ? 'var(--red)' : 'var(--green)' }}>
                      {Math.max(0, placesRestantes)} restantes
                    </span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, ((nbInscrits ?? 0) / (evt.capacite ?? 1)) * 100)}%`,
                        background: placesRestantes <= 5 ? 'var(--red)' : 'var(--green)',
                      }} />
                  </div>
                </div>

                {dejaInscrit ? (
                  <div className="text-center py-4">
                    <div className="text-3xl mb-2">✅</div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--green)' }}>Vous êtes inscrit(e) !</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Vous recevrez un rappel.</p>
                  </div>
                ) : !evt.inscriptions_ouvertes || placesRestantes <= 0 ? (
                  <div className="text-center py-4">
                    <div className="text-3xl mb-2">😔</div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--red)' }}>
                      {placesRestantes <= 0 ? 'Complet' : 'Inscriptions fermées'}
                    </p>
                    <Link href="/contact" className="block mt-3 text-sm no-underline text-center py-2 rounded-full"
                      style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                      Liste d&apos;attente
                    </Link>
                  </div>
                ) : (
                  <InscriptionForm evenementId={evt.id} user={user} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

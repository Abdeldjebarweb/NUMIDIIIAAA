// src/app/page.tsx
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default async function HomePage() {
  const supabase = createClient()

  const [{ data: evenementsData }, { data: actualitesData }] = await Promise.all([
    supabase.from('evenements').select('*').eq('statut', 'publie')
      .gte('date_debut', new Date().toISOString()).order('date_debut', { ascending: true }).limit(3),
    supabase.from('actualites').select('*').eq('statut', 'publie')
      .order('created_at', { ascending: false }).limit(3),
  ])

  const evenements = (evenementsData ?? []) as any[]
  const actualites = (actualitesData ?? []) as any[]

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden text-center py-20 px-6"
          style={{ background: 'linear-gradient(135deg, var(--green) 0%, #004a26 60%, #002f18 100%)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 80% 20%, rgba(210,16,52,0.15), transparent 60%)' }} />
          <div className="relative max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-6"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)' }}>
              ☪ Association loi 1901 · Bordeaux, France
            </div>
            <h1 className="text-4xl md:text-5xl text-white mb-4 leading-tight font-playfair">
              Ensemble, nous sommes<br />plus forts
            </h1>
            <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
              L'AEAB accompagne chaque étudiant algérien à Bordeaux : démarches administratives,
              logement, solidarité et vie associative.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/adhesion" className="no-underline px-7 py-3 rounded-full font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--red)' }}>
                🤝 Rejoindre l'association
              </Link>
              <Link href="/evenements" className="no-underline px-7 py-3 rounded-full font-semibold text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)' }}>
                📅 Voir les événements
              </Link>
              <Link href="/aide" className="no-underline px-7 py-3 rounded-full font-semibold text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)' }}>
                🆘 Demander de l'aide
              </Link>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="bg-white border-b py-8 px-6 flex flex-wrap justify-center gap-10"
          style={{ borderColor: 'var(--border)' }}>
          {[
            { num: '250+', label: 'Membres actifs' },
            { num: '5 ans', label: "D'existence" },
            { num: '120+', label: 'Étudiants aidés' },
            { num: '30+', label: 'Événements/an' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold font-playfair" style={{ color: 'var(--green)' }}>{s.num}</div>
              <div className="text-xs uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* SERVICES */}
        <section className="section">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="font-playfair text-3xl mb-2">Nos services</h2>
              <p style={{ color: 'var(--text-muted)' }}>Tout ce dont vous avez besoin pour réussir à Bordeaux</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { href: '/adhesion', emoji: '🤝', tag: 'Adhésion', title: 'Rejoignez la communauté', desc: 'Accédez à tous nos services, événements et réseau d\'entraide.' },
              { href: '/aide', emoji: '🆘', tag: 'Urgences', title: 'Aide d\'urgence', desc: 'Hébergement, aide alimentaire, soutien administratif.' },
              { href: '/guide', emoji: '📚', tag: 'Guide', title: 'Guide de l\'étudiant', desc: 'Visa, logement, CAF, sécurité sociale... tout ici.' },
              { href: '/evenements', emoji: '🎉', tag: 'Vie associative', title: 'Événements & sorties', desc: 'Soirées culturelles, sorties, célébrations algériennes.' },
            ].map(s => (
              <Link key={s.href} href={s.href} className="card cursor-pointer no-underline group">
                <div className="h-36 rounded-lg flex items-center justify-center text-5xl mb-4"
                  style={{ background: 'var(--green-light)' }}>
                  {s.emoji}
                </div>
                <span className="badge-green text-xs mb-2">{s.tag}</span>
                <h3 className="font-semibold text-base mb-1 mt-2">{s.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ÉVÉNEMENTS */}
        {evenements.length > 0 && (
          <section className="bg-white py-12 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h2 className="font-playfair text-3xl mb-2">Prochains événements</h2>
                  <p style={{ color: 'var(--text-muted)' }}>Ne ratez aucune de nos activités</p>
                </div>
                <Link href="/evenements" className="btn-primary no-underline text-sm px-5 py-2.5">Tout voir →</Link>
              </div>
              <div className="flex flex-col gap-4">
                {evenements.map((evt: any) => {
                  const date = new Date(evt.date_debut)
                  return (
                    <Link key={evt.id} href={`/evenements/${evt.id}`}
                      className="no-underline flex gap-4 items-start p-4 rounded-xl transition-all hover:shadow-md"
                      style={{ background: 'var(--off-white)', border: '1px solid var(--border)' }}>
                      <div className="rounded-xl p-3 text-center min-w-[60px] flex-shrink-0"
                        style={{ background: 'var(--green)', color: '#fff' }}>
                        <div className="text-2xl font-bold font-playfair leading-none">
                          {format(date, 'd', { locale: fr })}
                        </div>
                        <div className="text-xs uppercase tracking-wide opacity-90">
                          {format(date, 'MMM', { locale: fr })}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{evt.titre}</h4>
                        <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>{evt.description}</p>
                        <div className="flex flex-wrap gap-3 items-center">
                          {evt.inscriptions_ouvertes
                            ? <span className="badge-green">🎟 Inscription ouverte</span>
                            : <span className="badge-gray">Complet</span>}
                          {evt.lieu && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>📍 {evt.lieu}</span>}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ACTUALITÉS */}
        {actualites.length > 0 && (
          <section className="section">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <h2 className="font-playfair text-3xl mb-2">Dernières actualités</h2>
                <p style={{ color: 'var(--text-muted)' }}>Les nouvelles de l'AEAB et de la communauté</p>
              </div>
              <Link href="/actualites" className="btn-primary no-underline text-sm px-5 py-2.5">Tout lire →</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {actualites.map((actu: any) => (
                <Link key={actu.id} href={`/actualites/${actu.slug}`} className="card cursor-pointer no-underline group">
                  <div className="h-36 rounded-lg flex items-center justify-center text-4xl mb-4"
                    style={{ background: actu.categorie === 'urgent' ? 'var(--red-light)' : 'var(--green-light)' }}>
                    {actu.categorie === 'urgent' ? '🚨' : '📰'}
                  </div>
                  <span className={actu.categorie === 'urgent' ? 'badge-red' : 'badge-green'}>{actu.categorie}</span>
                  <h3 className="font-semibold text-base mt-2 mb-2 group-hover:underline" style={{ color: 'var(--text)' }}>
                    {actu.titre}
                  </h3>
                  {actu.extrait && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{actu.extrait}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* DON BAND */}
        <section className="py-16 px-6 text-center" style={{ background: 'var(--red)' }}>
          <div className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>💛 SOLIDARITÉ</div>
          <h2 className="font-playfair text-3xl text-white mb-3">Un étudiant en difficulté ? Aidez-nous à l'aider.</h2>
          <p className="max-w-lg mx-auto mb-6" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Chaque don permet de financer l'aide alimentaire, l'hébergement d'urgence et l'accompagnement administratif.
          </p>
          <Link href="/don"
            className="inline-block px-8 py-3 rounded-full font-bold text-base no-underline transition-all hover:-translate-y-0.5"
            style={{ background: '#fff', color: 'var(--red)' }}>
            💚 Faire un don
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}

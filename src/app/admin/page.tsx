// src/app/admin/page.tsx
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export const metadata = { title: 'Admin – Tableau de bord' }

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('role, nom, prenom')
    .eq('id', user.id)
    .single()

  const profile = profileData as { role: string; nom: string; prenom: string } | null
  if (!profile || !['admin', 'bureau'].includes(profile.role)) redirect('/')

  const [{ data: statsData }, { data: adhesionsData }, { data: demandesData }] = await Promise.all([
    supabase.from('stats_dashboard').select('*').single(),
    supabase.from('adhesions').select('*').eq('statut', 'en_attente').order('created_at', { ascending: false }).limit(5),
    supabase.from('demandes_aide').select('*').in('statut', ['en_attente', 'en_cours']).order('urgence', { ascending: false }).limit(5),
  ])

  const stats = statsData as any
  const adhesions = (adhesionsData ?? []) as any[]
  const demandes = (demandesData ?? []) as any[]

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--off-white)' }}>
      <AdminSidebar active="dashboard" />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-playfair text-2xl">Bonjour, {profile.prenom} 👋</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
            </p>
          </div>
          <Link href="/" className="text-sm no-underline px-4 py-2 rounded-full"
            style={{ background: '#fff', border: '1px solid var(--border)' }}>
            ← Voir le site
          </Link>
        </div>

        {(stats?.demandes_urgentes ?? 0) > 0 && (
          <div className="mb-5 p-4 rounded-xl flex items-center gap-3 flex-wrap"
            style={{ background: 'var(--red-light)', border: '1px solid var(--red)' }}>
            <span>🚨</span>
            <strong style={{ color: 'var(--red)' }}>
              {stats.demandes_urgentes} demande(s) très urgente(s) non traitées
            </strong>
            <Link href="/admin/demandes" className="no-underline text-sm font-bold px-4 py-2 rounded-full ml-auto"
              style={{ background: 'var(--red)', color: '#fff' }}>
              Traiter →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { val: stats?.membres_actifs ?? 0, label: 'Membres actifs', color: 'var(--green)' },
            { val: stats?.adhesions_en_attente ?? 0, label: 'Adhésions en attente', color: '#d97706' },
            { val: `€ ${(stats?.dons_ce_mois ?? 0).toFixed(0)}`, label: 'Dons ce mois', color: 'var(--green)' },
            { val: stats?.evenements_a_venir ?? 0, label: 'Événements à venir', color: '#1d4ed8' },
          ].map(m => (
            <div key={m.label} className="bg-white rounded-xl p-4" style={{ border: '1px solid var(--border)' }}>
              <div className="text-2xl font-bold font-playfair" style={{ color: m.color }}>{m.val}</div>
              <div className="text-xs uppercase tracking-wide mt-1" style={{ color: 'var(--text-muted)' }}>{m.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { href: '/admin/evenements', label: '+ Créer un événement', bg: 'var(--green)' },
            { href: '/admin/actualites', label: '+ Publier un article', bg: '#1d4ed8' },
            { href: '/admin/membres', label: '✅ Valider adhésions', bg: '#d97706' },
            { href: '/admin/demandes', label: '📩 Traiter demandes', bg: 'var(--red)' },
          ].map(a => (
            <Link key={a.href} href={a.href}
              className="no-underline text-center py-3 px-4 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
              style={{ background: a.bg }}>
              {a.label}
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <strong className="text-sm">Adhésions en attente</strong>
              <Link href="/admin/membres" className="text-xs no-underline font-semibold" style={{ color: 'var(--green)' }}>
                Tout voir →
              </Link>
            </div>
            <table className="w-full">
              <tbody>
                {adhesions.map((a: any) => (
                  <tr key={a.id} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-5 py-3">
                      <div className="font-medium text-sm">{a.prenom} {a.nom}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.email} · {a.etablissement}</div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href="/admin/membres" className="no-underline text-xs px-3 py-1.5 rounded-full font-semibold"
                        style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                        Valider
                      </Link>
                    </td>
                  </tr>
                ))}
                {adhesions.length === 0 && (
                  <tr><td colSpan={2} className="px-5 py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                    ✅ Aucune adhésion en attente
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <strong className="text-sm">Demandes d'aide ouvertes</strong>
              <Link href="/admin/demandes" className="text-xs no-underline font-semibold" style={{ color: 'var(--green)' }}>
                Tout voir →
              </Link>
            </div>
            <table className="w-full">
              <tbody>
                {demandes.map((d: any) => (
                  <tr key={d.id} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-5 py-3">
                      <div className="font-medium text-sm">{d.prenom} {d.nom}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{d.type_aide}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={d.urgence === 'tres_urgent' ? 'badge-red' : d.urgence === 'urgent' ? 'badge-yellow' : 'badge-green'}>
                        {d.urgence === 'tres_urgent' ? '🔴 Très urgent' : d.urgence === 'urgent' ? '🟡 Urgent' : '🟢 Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
                {demandes.length === 0 && (
                  <tr><td colSpan={2} className="px-5 py-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                    ✅ Aucune demande ouverte
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

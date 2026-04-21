'use client'
// src/app/admin/membres/MembresClient.tsx
import { useState, useTransition } from 'react'
import { validerAdhesion, refuserAdhesion, changerRoleMembre } from '@/lib/actions/admin'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'


type Tab = 'adhesions' | 'membres'

export default function MembresClient({ adhesions, membres }: { adhesions: any[], membres: any[] }) {
  const [tab, setTab] = useState<Tab>('adhesions')
  const [search, setSearch] = useState('')
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState<any | null>(null)

  const filteredAdhesions = adhesions.filter(a =>
    `${a.nom} ${a.prenom} ${a.email} ${a.etablissement}`.toLowerCase().includes(search.toLowerCase())
  )
  const filteredMembres = membres.filter(m =>
    `${m.nom} ${m.prenom} ${m.email}`.toLowerCase().includes(search.toLowerCase())
  )

  const pending = adhesions.filter(a => a.statut === 'en_attente')

  function handleValider(id: string) {
    startTransition(async () => {
      const r = await validerAdhesion(id)
      if (r.error) toast.error(r.error)
      else { toast.success(r.success!); location.reload() }
    })
  }
  function handleRefuser(id: string) {
    if (!confirm('Refuser cette adhésion ?')) return
    startTransition(async () => {
      const r = await refuserAdhesion(id)
      if (r.error) toast.error(r.error)
      else { toast.success('Adhésion refusée.'); location.reload() }
    })
  }
  function handleRole(profileId: string, role: string) {
    startTransition(async () => {
      const r = await changerRoleMembre(profileId, role)
      if (r.error) toast.error(r.error)
      else { toast.success('Rôle mis à jour !'); location.reload() }
    })
  }

  const BADGE: Record<string, string> = {
    en_attente: 'badge-yellow', approuve: 'badge-green', refuse: 'badge-red',
    actif: 'badge-green', inactif: 'badge-gray', suspendu: 'badge-red',
    admin: 'badge-red', bureau: 'badge-yellow', membre: 'badge-green', invite: 'badge-gray',
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-playfair text-2xl">👥 Gestion des membres</h1>
          {pending.length > 0 && (
            <div className="mt-1 text-sm" style={{ color: 'var(--red)' }}>
              ⚠️ {pending.length} adhésion(s) en attente de validation
            </div>
          )}
        </div>
        <input type="text" placeholder="🔍 Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
          className="input" style={{ width: 220 }} />
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6" style={{ borderColor: 'var(--border)' }}>
        {([['adhesions', `Demandes d'adhésion (${adhesions.filter(a => a.statut === 'en_attente').length} en attente)`], ['membres', `Membres (${membres.length})`]] as [Tab, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className="px-5 py-2.5 text-sm font-medium border-b-2 transition-all"
            style={{ borderColor: tab === key ? 'var(--green)' : 'transparent', color: tab === key ? 'var(--green)' : 'var(--text-muted)' }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'adhesions' && (
        <div className="table-wrapper">
          <table>
            <thead><tr>
              <th>Candidat</th><th>Établissement</th><th>Niveau</th><th>Date</th><th>Statut</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filteredAdhesions.map(a => (
                <tr key={a.id}>
                  <td>
                    <div className="font-medium">{a.prenom} {a.nom}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.email}</div>
                    {a.telephone && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.telephone}</div>}
                  </td>
                  <td className="text-sm">{a.etablissement}<br /><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{a.filiere}</span></td>
                  <td className="text-sm">{a.niveau}</td>
                  <td className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {format(new Date(a.created_at), 'd MMM yyyy', { locale: fr })}
                  </td>
                  <td><span className={BADGE[a.statut] || 'badge-gray'}>{a.statut}</span></td>
                  <td>
                    {a.statut === 'en_attente' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleValider(a.id)} disabled={isPending}
                          className="text-xs px-3 py-1.5 rounded-full font-semibold disabled:opacity-50"
                          style={{ background: 'var(--green-light)', color: 'var(--green)', border: '1px solid var(--green)' }}>
                          ✅ Valider
                        </button>
                        <button onClick={() => handleRefuser(a.id)} disabled={isPending}
                          className="text-xs px-3 py-1.5 rounded-full font-semibold disabled:opacity-50"
                          style={{ background: 'var(--red-light)', color: 'var(--red)', border: '1px solid var(--red)' }}>
                          ❌ Refuser
                        </button>
                      </div>
                    )}
                    {a.statut !== 'en_attente' && (
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Traité</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredAdhesions.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>Aucune adhésion trouvée</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'membres' && (
        <>
          <div className="table-wrapper">
            <table>
              <thead><tr>
                <th>Membre</th><th>Établissement</th><th>Niveau</th><th>Statut</th><th>Rôle</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {filteredMembres.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div className="font-medium">{m.prenom} {m.nom}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.email}</div>
                    </td>
                    <td className="text-sm">{m.etablissement || '—'}</td>
                    <td className="text-sm">{m.niveau || '—'}</td>
                    <td><span className={BADGE[m.statut] || 'badge-gray'}>{m.statut}</span></td>
                    <td><span className={BADGE[m.role] || 'badge-gray'}>{m.role}</span></td>
                    <td>
                      <div className="flex gap-2 items-center">
                        <select
                          defaultValue={m.role}
                          onChange={e => handleRole(m.id, e.target.value)}
                          disabled={isPending}
                          className="text-xs border rounded px-2 py-1"
                          style={{ borderColor: 'var(--border)', fontSize: '0.75rem' }}>
                          <option value="invite">Invité</option>
                          <option value="membre">Membre</option>
                          <option value="bureau">Bureau</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMembres.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>Aucun membre trouvé</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}

'use client'
// src/app/admin/evenements/EvenementsAdminClient.tsx
import { useState, useTransition } from 'react'
import { creerEvenement, modifierEvenement, supprimerEvenement } from '@/lib/actions/admin'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'


const CATS = ['culture', 'pro', 'sport', 'social', 'urgence']
const STATUTS = ['publie', 'brouillon', 'annule']

type Modal = { type: "create" } | { type: "edit"; evt: any } | null

export default function EvenementsAdminClient({ evenements }: { evenements: any[] }) {
  const [modal, setModal] = useState<Modal>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const r = modal?.type === 'edit'
        ? await modifierEvenement(modal.evt.id, fd)
        : await creerEvenement(fd)
      if (r.error) toast.error(r.error)
      else { toast.success(r.success!); setModal(null); location.reload() }
    })
  }

  function handleDelete(id: string, titre: string) {
    if (!confirm(`Supprimer "${titre}" ? Cette action est irréversible.`)) return
    startTransition(async () => {
      const r = await supprimerEvenement(id)
      if (r.error) toast.error(r.error)
      else { toast.success('Événement supprimé.'); location.reload() }
    })
  }

  const CAT_BADGE: Record<string, string> = {
    culture: 'badge-green', pro: '', sport: '', social: 'badge-green', urgence: 'badge-red'
  }

  const defaultEvt = modal?.type === 'edit' ? modal.evt : null

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-2xl">📅 Gestion des événements</h1>
        <button onClick={() => setModal({ type: 'create' })}
          className="btn-primary px-5 py-2.5 text-sm">
          + Nouvel événement
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead><tr>
            <th>Événement</th><th>Date</th><th>Lieu</th><th>Catégorie</th><th>Places</th><th>Statut</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {evenements.map(evt => (
              <tr key={evt.id}>
                <td>
                  <div className="font-medium">{evt.titre}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)', maxWidth: 220 }}>{evt.description?.slice(0, 60)}...</div>
                </td>
                <td className="text-sm">
                  {format(new Date(evt.date_debut), 'd MMM yyyy', { locale: fr })}
                  <br /><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {format(new Date(evt.date_debut), 'HH:mm', { locale: fr })}
                  </span>
                </td>
                <td className="text-sm" style={{ color: 'var(--text-muted)' }}>{evt.lieu || '—'}</td>
                <td><span className={`badge-green text-xs ${CAT_BADGE[evt.categorie]}`}>{evt.categorie}</span></td>
                <td className="text-sm">{evt.capacite}</td>
                <td>
                  <span className={evt.statut === 'publie' ? 'badge-green' : evt.statut === 'annule' ? 'badge-red' : 'badge-gray'}>
                    {evt.statut}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => setModal({ type: 'edit', evt })}
                      className="text-xs px-3 py-1.5 rounded-full font-semibold"
                      style={{ background: 'var(--green-light)', color: 'var(--green)', border: '1px solid var(--green)' }}>
                      ✏️ Modifier
                    </button>
                    <button onClick={() => handleDelete(evt.id, evt.titre)} disabled={isPending}
                      className="text-xs px-3 py-1.5 rounded-full font-semibold"
                      style={{ background: 'var(--red-light)', color: 'var(--red)', border: '1px solid var(--red)' }}>
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {evenements.length === 0 && (
              <tr><td colSpan={7} className="text-center py-10 text-sm" style={{ color: 'var(--text-muted)' }}>
                Aucun événement. Cliquez sur "+ Nouvel événement" pour commencer.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Créer / Modifier */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', minHeight: '100vh' }}
          onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-playfair text-xl">
                {modal.type === 'create' ? '➕ Nouvel événement' : '✏️ Modifier l\'événement'}
              </h2>
              <button onClick={() => setModal(null)} className="text-2xl leading-none" style={{ color: 'var(--text-muted)' }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Titre <span style={{ color: 'var(--red)' }}>*</span></label>
                <input name="titre" type="text" className="input" required defaultValue={defaultEvt?.titre} />
              </div>
              <div>
                <label className="label">Description courte</label>
                <textarea name="description" className="input" rows={2} defaultValue={defaultEvt?.description ?? ''} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Date et heure <span style={{ color: 'var(--red)' }}>*</span></label>
                  <input name="date_debut" type="datetime-local" className="input" required
                    defaultValue={defaultEvt ? new Date(defaultEvt.date_debut).toISOString().slice(0, 16) : ''} />
                </div>
                <div>
                  <label className="label">Fin (optionnel)</label>
                  <input name="date_fin" type="datetime-local" className="input"
                    defaultValue={defaultEvt?.date_fin ? new Date(defaultEvt.date_fin).toISOString().slice(0, 16) : ''} />
                </div>
              </div>
              <div>
                <label className="label">Lieu</label>
                <input name="lieu" type="text" className="input" placeholder="Salle, campus..." defaultValue={defaultEvt?.lieu ?? ''} />
              </div>
              <div>
                <label className="label">Adresse complète</label>
                <input name="adresse" type="text" className="input" placeholder="12 rue..." defaultValue={defaultEvt?.adresse ?? ''} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Catégorie</label>
                  <select name="categorie" className="input" defaultValue={defaultEvt?.categorie ?? 'social'}>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Places max</label>
                  <input name="capacite" type="number" className="input" min="1" defaultValue={defaultEvt?.capacite ?? 50} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Statut</label>
                  <select name="statut" className="input" defaultValue={defaultEvt?.statut ?? 'publie'}>
                    {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Inscriptions</label>
                  <select name="inscriptions_ouvertes" className="input"
                    defaultValue={defaultEvt?.inscriptions_ouvertes !== false ? 'true' : 'false'}>
                    <option value="true">Ouvertes</option>
                    <option value="false">Fermées</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)}
                  className="flex-1 py-2.5 rounded-full text-sm font-semibold"
                  style={{ background: 'var(--off-white)', border: '1px solid var(--border)' }}>
                  Annuler
                </button>
                <button type="submit" disabled={isPending}
                  className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white disabled:opacity-60"
                  style={{ background: 'var(--green)' }}>
                  {isPending ? '⏳ Enregistrement...' : modal.type === 'create' ? '✅ Créer' : '✅ Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

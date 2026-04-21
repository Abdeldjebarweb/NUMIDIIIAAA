'use client'
// src/app/admin/demandes/DemandesClient.tsx
import { useState, useTransition } from 'react'
import { prendreEnCharge, cloturerDemande } from '@/lib/actions/admin'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'


const URGENCE_BADGE: Record<string, string> = {
  tres_urgent: 'badge-red', urgent: 'badge-yellow', normal: 'badge-green'
}
const URGENCE_LABEL: Record<string, string> = {
  tres_urgent: '🔴 Très urgent', urgent: '🟡 Urgent', normal: '🟢 Normal'
}
const STATUT_BADGE: Record<string, string> = {
  en_attente: 'badge-yellow', en_cours: 'badge-green', traite: 'badge-gray', ferme: 'badge-gray'
}
const TYPE_EMOJI: Record<string, string> = {
  logement: '🏠', alimentaire: '🍽', administratif: '📋', sante: '🏥', psychologique: '🧠', financier: '💰', autre: '❓'
}

export default function DemandesClient({ demandes }: { demandes: any[] }) {
  const [filtre, setFiltre] = useState<string>('tous')
  const [selected, setSelected] = useState<any | null>(null)
  const [notes, setNotes] = useState('')
  const [isPending, startTransition] = useTransition()

  const filtered = filtre === 'tous' ? demandes : demandes.filter(d => d.statut === filtre)
  const urgentes = demandes.filter(d => d.urgence === 'tres_urgent' && d.statut === 'en_attente')

  function handlePrendreEnCharge(id: string) {
    startTransition(async () => {
      const r = await prendreEnCharge(id)
      if (r.error) toast.error(r.error)
      else { toast.success('Demande prise en charge !'); location.reload() }
    })
  }

  function handleCloturer(id: string) {
    startTransition(async () => {
      const r = await cloturerDemande(id, notes)
      if (r.error) toast.error(r.error)
      else { toast.success('Demande clôturée !'); setSelected(null); location.reload() }
    })
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div>
          <h1 className="font-playfair text-2xl">📩 Demandes d'aide</h1>
          {urgentes.length > 0 && (
            <div className="mt-1 text-sm font-semibold" style={{ color: 'var(--red)' }}>
              🚨 {urgentes.length} demande(s) TRÈS URGENTE(S) à traiter immédiatement !
            </div>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {['tous','en_attente','en_cours','traite'].map(f => (
            <button key={f} onClick={() => setFiltre(f)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: filtre === f ? 'var(--green)' : '#fff',
                color: filtre === f ? '#fff' : 'var(--text)',
                border: '1px solid var(--border)',
              }}>
              {f === 'tous' ? 'Toutes' : f.replace('_', ' ')} ({f === 'tous' ? demandes.length : demandes.filter(d => d.statut === f).length})
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map(d => (
          <div key={d.id}
            className="bg-white rounded-xl p-5"
            style={{
              border: `1px solid ${d.urgence === 'tres_urgent' && d.statut === 'en_attente' ? 'var(--red)' : 'var(--border)'}`,
              boxShadow: d.urgence === 'tres_urgent' && d.statut === 'en_attente' ? '0 0 0 2px rgba(210,16,52,0.1)' : 'none'
            }}>
            <div className="flex items-start gap-4 flex-wrap">
              <div className="text-3xl">{TYPE_EMOJI[d.type_aide] || '❓'}</div>
              <div className="flex-1 min-w-64">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-semibold">{d.prenom} {d.nom}</span>
                  <span className={URGENCE_BADGE[d.urgence]}>{URGENCE_LABEL[d.urgence]}</span>
                  <span className={STATUT_BADGE[d.statut]}>{d.statut.replace('_', ' ')}</span>
                </div>
                <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                  📧 {d.email} {d.telephone && `· 📞 ${d.telephone}`} · {format(new Date(d.created_at), 'd MMM yyyy à HH:mm', { locale: fr })}
                </div>
                <div className="text-sm mb-2">
                  <span className="font-medium capitalize">{d.type_aide}</span> — {d.description}
                </div>
                {d.notes_internes && (
                  <div className="text-xs p-2 rounded" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                    📝 Notes internes : {d.notes_internes}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {d.statut === 'en_attente' && (
                  <button onClick={() => handlePrendreEnCharge(d.id)} disabled={isPending}
                    className="text-xs px-4 py-2 rounded-full font-semibold whitespace-nowrap"
                    style={{ background: 'var(--green)', color: '#fff' }}>
                    ✋ Prendre en charge
                  </button>
                )}
                {d.statut === 'en_cours' && (
                  <button onClick={() => { setSelected(d); setNotes('') }}
                    className="text-xs px-4 py-2 rounded-full font-semibold whitespace-nowrap"
                    style={{ background: 'var(--green-light)', color: 'var(--green)', border: '1px solid var(--green)' }}>
                    ✅ Clôturer
                  </button>
                )}
                <a href={`mailto:${d.email}`}
                  className="text-xs px-4 py-2 rounded-full font-semibold text-center no-underline"
                  style={{ background: 'var(--off-white)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                  📧 Contacter
                </a>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
            <div className="text-4xl mb-3">✅</div>
            <p>Aucune demande dans cette catégorie.</p>
          </div>
        )}
      </div>

      {/* Modal clôture avec notes */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)', minHeight: '100vh' }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" style={{ border: '1px solid var(--border)' }}>
            <h3 className="font-playfair text-xl mb-4">✅ Clôturer la demande</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              Demande de <strong>{selected.prenom} {selected.nom}</strong> — {selected.type_aide}
            </p>
            <div className="mb-4">
              <label className="label">Notes internes (optionnel)</label>
              <textarea className="input" rows={4} value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Ex: Hébergement trouvé via réseau, étudiant contacté le 21/04..." />
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Ces notes sont visibles uniquement par l'équipe admin.</div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelected(null)}
                className="flex-1 py-2.5 rounded-full text-sm font-semibold"
                style={{ background: 'var(--off-white)', border: '1px solid var(--border)' }}>
                Annuler
              </button>
              <button onClick={() => handleCloturer(selected.id)} disabled={isPending}
                className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white disabled:opacity-60"
                style={{ background: 'var(--green)' }}>
                {isPending ? '⏳...' : '✅ Confirmer clôture'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

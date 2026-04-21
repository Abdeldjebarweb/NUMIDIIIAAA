'use client'
// src/app/evenements/EvenementsClient.tsx

import { useState, useTransition } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { inscrireEvenement } from '@/lib/actions/formulaires'
import { toast } from 'sonner'


const CATEGORIES = [
  { key: 'tous', label: 'Tous', emoji: '🎯' },
  { key: 'culture', label: 'Culture', emoji: '🎨' },
  { key: 'pro', label: 'Pro', emoji: '💼' },
  { key: 'sport', label: 'Sport', emoji: '⚽' },
  { key: 'social', label: 'Social', emoji: '🤝' },
]

const CAT_COLORS: Record<string, string> = {
  culture: 'badge-green',
  pro: 'text-blue-700',
  sport: 'text-blue-700',
  social: 'badge-green',
  urgence: 'badge-red',
}

interface Props { evenements: any[] }

export default function EvenementsClient({ evenements }: Props) {
  const [filtre, setFiltre] = useState('tous')
  const [selectedEvt, setSelectedEvt] = useState<any | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = filtre === 'tous'
    ? evenements
    : evenements.filter(e => e.categorie === filtre)

  const upcoming = filtered.filter(e => new Date(e.date_debut) >= new Date())
  const past = filtered.filter(e => new Date(e.date_debut) < new Date())

  function handleInscription(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedEvt) return
    const fd = new FormData(e.currentTarget)
    fd.set('evenement_id', selectedEvt.id)
    startTransition(async () => {
      const result = await inscrireEvenement(fd)
      if (result.error) toast.error(result.error)
      else {
        toast.success(result.success!)
        setSelectedEvt(null)
      }
    })
  }

  return (
    <div className="section">
      {/* Filtres */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button key={cat.key} onClick={() => setFiltre(cat.key)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap"
            style={{
              background: filtre === cat.key ? 'var(--green)' : '#fff',
              color: filtre === cat.key ? '#fff' : 'var(--text)',
              border: '1px solid var(--border)',
            }}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Événements à venir */}
      {upcoming.length > 0 && (
        <div className="mb-10">
          <h2 className="font-playfair text-2xl mb-5">À venir</h2>
          <div className="flex flex-col gap-4">
            {upcoming.map(evt => {
              const date = new Date(evt.date_debut)
              return (
                <div key={evt.id}
                  className="flex gap-4 items-start p-5 bg-white rounded-xl transition-all hover:shadow-md cursor-pointer"
                  style={{ border: '1px solid var(--border)' }}
                  onClick={() => setSelectedEvt(evt)}>
                  <div className="rounded-xl p-3 text-center min-w-[60px] flex-shrink-0"
                    style={{ background: 'var(--green)', color: '#fff' }}>
                    <div className="text-2xl font-bold font-playfair leading-none">
                      {format(date, 'd', { locale: fr })}
                    </div>
                    <div className="text-xs uppercase tracking-wider opacity-90">
                      {format(date, 'MMM', { locale: fr })}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="font-semibold text-base mb-1">{evt.titre}</h3>
                        <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>{evt.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center">
                      {evt.inscriptions_ouvertes
                        ? <span className="badge-green">🎟 Inscription ouverte</span>
                        : <span className="badge-red">❌ Complet</span>}
                      {evt.lieu && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>📍 {evt.lieu}</span>}
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        🕐 {format(date, 'HH:mm', { locale: fr })}
                      </span>
                      {evt.capacite && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>👥 {evt.capacite} places max</span>}
                    </div>
                  </div>
                  {evt.inscriptions_ouvertes && (
                    <button onClick={e => { e.stopPropagation(); setSelectedEvt(evt) }}
                      className="btn-primary text-xs px-4 py-2 flex-shrink-0 no-underline">
                      S'inscrire
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Événements passés */}
      {past.length > 0 && (
        <div>
          <h2 className="font-playfair text-2xl mb-5" style={{ color: 'var(--text-muted)' }}>Passés</h2>
          <div className="flex flex-col gap-3">
            {past.map(evt => (
              <div key={evt.id} className="flex gap-4 items-center p-4 rounded-xl opacity-60"
                style={{ background: '#f4f3ef', border: '1px solid var(--border)' }}>
                <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  {format(new Date(evt.date_debut), 'd MMM yyyy', { locale: fr })}
                </div>
                <div className="flex-1">
                  <span className="font-medium text-sm">{evt.titre}</span>
                  {evt.lieu && <span className="text-xs ml-3" style={{ color: 'var(--text-muted)' }}>📍 {evt.lieu}</span>}
                </div>
                <span className="badge-gray">Terminé</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="font-playfair text-xl mb-2">Aucun événement</h3>
          <p style={{ color: 'var(--text-muted)' }}>Revenez bientôt, de nouveaux événements seront ajoutés.</p>
        </div>
      )}

      {/* Modal Inscription */}
      {selectedEvt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setSelectedEvt(null) }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-playfair text-xl">{selectedEvt.titre}</h3>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  📅 {format(new Date(selectedEvt.date_debut), 'd MMMM yyyy à HH:mm', { locale: fr })}
                </p>
                {selectedEvt.lieu && (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>📍 {selectedEvt.lieu}</p>
                )}
              </div>
              <button onClick={() => setSelectedEvt(null)} className="text-2xl leading-none" style={{ color: 'var(--text-muted)' }}>✕</button>
            </div>

            {selectedEvt.description && (
              <p className="text-sm mb-5 p-3 rounded-lg" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                {selectedEvt.description}
              </p>
            )}

            <form onSubmit={handleInscription} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Nom <span style={{ color: 'var(--red)' }}>*</span></label>
                  <input name="nom" type="text" className="input" required />
                </div>
                <div>
                  <label className="label">Prénom <span style={{ color: 'var(--red)' }}>*</span></label>
                  <input name="prenom" type="text" className="input" required />
                </div>
              </div>
              <div>
                <label className="label">Email <span style={{ color: 'var(--red)' }}>*</span></label>
                <input name="email" type="email" className="input" required />
              </div>
              <div>
                <label className="label">Nombre de places</label>
                <select name="nombre_places" className="input">
                  <option value="1">1 place</option>
                  <option value="2">2 places</option>
                  <option value="3">3 places</option>
                </select>
              </div>
              <button type="submit" disabled={isPending}
                className="w-full py-3 rounded-full font-semibold text-sm text-white mt-2 disabled:opacity-60"
                style={{ background: 'var(--green)' }}>
                {isPending ? '⏳ Inscription...' : '✅ Confirmer l\'inscription gratuite'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

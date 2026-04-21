'use client'
// src/app/don/DonClient.tsx
import { useState, useTransition } from 'react'
import { creerSessionDon } from '@/lib/actions/paiement'
import { toast } from 'sonner'

const MONTANTS = [5, 10, 20, 50, 100]
const IMPACTS = [
  { montant: 5, emoji: '🍽', label: '1 repas pour un étudiant en difficulté' },
  { montant: 10, emoji: '📚', label: 'Fournitures scolaires essentielles' },
  { montant: 20, emoji: '🏠', label: '1 nuit d\'hébergement d\'urgence' },
  { montant: 50, emoji: '📋', label: 'Aide démarches administratives complètes' },
  { montant: 100, emoji: '🎓', label: '1 étudiant accompagné pendant 1 mois' },
]

export default function DonClient() {
  const [montant, setMontant] = useState(20)
  const [customMontant, setCustomMontant] = useState('')
  const [anonyme, setAnonyme] = useState(false)
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  const montantFinal = customMontant ? parseFloat(customMontant) : montant
  const impact = [...IMPACTS].reverse().find(i => i.montant <= montantFinal) ?? IMPACTS[0]

  function handleDon() {
    if (!montantFinal || montantFinal < 1) { toast.error('Montant minimum : 1€'); return }
    startTransition(async () => {
      try { await creerSessionDon(montantFinal, anonyme, message || undefined) }
      catch (e: any) { toast.error(e.message || 'Erreur paiement') }
    })
  }

  return (
    <>
      <section className="py-16 px-6 text-center" style={{ background: 'var(--red)' }}>
        <div className="max-w-xl mx-auto">
          <div className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>💛 SOLIDARITÉ</div>
          <h1 className="font-playfair text-4xl text-white mb-3">Faites un don à l'AEAB</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)' }}>Chaque euro compte. Votre générosité permet d'aider un étudiant de plus.</p>
        </div>
      </section>
      <div className="section">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="bg-white rounded-2xl p-7" style={{ border: '1px solid var(--border)' }}>
            <h2 className="font-playfair text-xl mb-5">Choisissez votre montant</h2>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {MONTANTS.map(m => (
                <button key={m} onClick={() => { setMontant(m); setCustomMontant('') }}
                  className="py-3 rounded-xl font-bold text-sm transition-all"
                  style={{ background: montant === m && !customMontant ? 'var(--red)' : '#fff', color: montant === m && !customMontant ? '#fff' : 'var(--text)', border: `2px solid ${montant === m && !customMontant ? 'var(--red)' : 'var(--border)'}` }}>
                  {m}€
                </button>
              ))}
            </div>
            <div className="mb-5">
              <label className="label">Autre montant</label>
              <div className="relative">
                <input type="number" min="1" max="10000" placeholder="Ex: 30" value={customMontant}
                  onChange={e => { setCustomMontant(e.target.value); setMontant(0) }} className="input pr-8" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold" style={{ color: 'var(--text-muted)' }}>€</span>
              </div>
            </div>
            {montantFinal >= 1 && (
              <div className="mb-5 p-4 rounded-xl" style={{ background: 'var(--green-light)' }}>
                <div className="text-2xl mb-1">{impact.emoji}</div>
                <div className="text-sm font-medium" style={{ color: 'var(--green)' }}>{montantFinal}€ = {impact.label}</div>
              </div>
            )}
            <div className="mb-4">
              <label className="label">Message (optionnel)</label>
              <textarea className="input" rows={2} placeholder="Un mot pour les bénéficiaires..." value={message} onChange={e => setMessage(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 mb-6">
              <input type="checkbox" id="anonyme" checked={anonyme} onChange={e => setAnonyme(e.target.checked)} style={{ width: 'auto' }} />
              <label htmlFor="anonyme" className="text-sm" style={{ color: 'var(--text-muted)' }}>Don anonyme</label>
            </div>
            <button onClick={handleDon} disabled={isPending || montantFinal < 1}
              className="w-full py-4 rounded-full font-bold text-base text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: 'var(--red)' }}>
              {isPending ? '⏳ Redirection...' : `💳 Faire un don de ${montantFinal || '?'}€`}
            </button>
            <p className="text-center text-xs mt-3" style={{ color: 'var(--text-muted)' }}>🔒 Paiement sécurisé via Stripe · Reçu fiscal disponible</p>
          </div>
          <div className="space-y-5">
            <div>
              <h2 className="font-playfair text-2xl mb-4">L'impact de votre don</h2>
              <div className="space-y-3">
                {IMPACTS.map(i => (
                  <div key={i.montant} className="flex items-center gap-4 p-4 bg-white rounded-xl" style={{ border: '1px solid var(--border)' }}>
                    <div className="text-2xl">{i.emoji}</div>
                    <div>
                      <div className="font-bold" style={{ color: 'var(--red)' }}>{i.montant}€</div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{i.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

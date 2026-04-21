'use client'
// src/app/aide/AideClient.tsx
import { useTransition, useState } from 'react'
import { soumettreDemandeAide } from '@/lib/actions/formulaires'
import { toast } from 'sonner'
import Link from 'next/link'

const TYPES = [
  { val: 'logement', label: '🏠 Urgence logement' },
  { val: 'alimentaire', label: '🍽 Aide alimentaire' },
  { val: 'administratif', label: '📋 Démarches administratives' },
  { val: 'sante', label: '🏥 Orientation santé' },
  { val: 'psychologique', label: '🧠 Soutien psychologique' },
  { val: 'financier', label: '💰 Difficultés financières' },
  { val: 'autre', label: '❓ Autre' },
]

export default function AideClient() {
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await soumettreDemandeAide(fd)
      if (result.error) toast.error(result.error)
      else setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="section max-w-md mx-auto text-center py-16">
        <div className="text-6xl mb-4">🆘</div>
        <h2 className="font-playfair text-2xl mb-3">Demande reçue !</h2>
        <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
          Un membre du bureau vous contactera dans les plus brefs délais. Si c'est une urgence absolue, appelez directement le bureau.
        </p>
        <Link href="/" className="btn-primary no-underline px-6 py-3 rounded-full">Retour à l'accueil</Link>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { emoji: '🏠', title: 'Urgence logement', desc: 'Hébergement temporaire disponible', border: 'var(--green)' },
          { emoji: '🍽', title: 'Aide alimentaire', desc: 'Colis alimentaires chaque semaine', border: 'var(--red)' },
          { emoji: '📋', title: 'Administratif', desc: 'Aide pour vos démarches', border: '#d97706' },
          { emoji: '🧠', title: 'Soutien moral', desc: 'Écoute et orientation', border: '#1d4ed8' },
        ].map(s => (
          <div key={s.title} className="bg-white rounded-xl p-4" style={{ border: `1px solid var(--border)`, borderLeft: `3px solid ${s.border}` }}>
            <div className="text-2xl mb-2">{s.emoji}</div>
            <div className="font-semibold text-sm mb-1">{s.title}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.desc}</div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl mb-6 flex items-start gap-3" style={{ background: '#e6f0fb', border: '1px solid #bbd0f0' }}>
        <span>🔒</span>
        <div className="text-sm" style={{ color: '#1d4ed8' }}>
          <strong>Confidentialité garantie</strong> — Votre demande est traitée avec la plus grande discrétion. Seuls les membres du bureau y ont accès.
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl p-7" style={{ border: '1px solid var(--border)' }}>
          <h2 className="font-playfair text-xl mb-6">📩 Formulaire de demande d'aide</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="label">Téléphone</label>
              <input name="telephone" type="tel" className="input" placeholder="+33 6 XX XX XX XX" />
            </div>
            <div>
              <label className="label">Type d'aide <span style={{ color: 'var(--red)' }}>*</span></label>
              <select name="type_aide" className="input" required>
                <option value="">-- Choisir --</option>
                {TYPES.map(t => <option key={t.val} value={t.val}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Décrivez votre situation <span style={{ color: 'var(--red)' }}>*</span></label>
              <textarea name="description" className="input" rows={4} required
                placeholder="Plus vous donnez de détails, mieux nous pouvons vous aider..." />
            </div>
            <div>
              <label className="label">Degré d'urgence <span style={{ color: 'var(--red)' }}>*</span></label>
              <select name="urgence" className="input" required>
                <option value="normal">🟢 Non urgent (dans les 2 semaines)</option>
                <option value="urgent">🟡 Urgent (dans les 3 jours)</option>
                <option value="tres_urgent">🔴 Très urgent (aujourd'hui)</option>
              </select>
            </div>
            <button type="submit" disabled={isPending}
              className="w-full py-3 rounded-full font-semibold text-sm text-white disabled:opacity-60 transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--red)' }}>
              {isPending ? '⏳ Envoi...' : '🆘 Envoyer ma demande d\'aide'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

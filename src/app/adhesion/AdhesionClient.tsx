'use client'
// src/app/adhesion/AdhesionClient.tsx
import { useTransition, useState } from 'react'
import { soumettreAdhesion } from '@/lib/actions/formulaires'
import { toast } from 'sonner'
import Link from 'next/link'

const ETABLISSEMENTS = ['Université de Bordeaux','Bordeaux INP','Sciences Po Bordeaux','INSEEC Bordeaux','KEDGE Business School','IUT de Bordeaux','Autre']
const NIVEAUX = ['Licence 1','Licence 2','Licence 3','Master 1','Master 2','Doctorat','Autre']

export default function AdhesionClient() {
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await soumettreAdhesion(fd)
      if (result.error) toast.error(result.error)
      else setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="section max-w-md mx-auto text-center py-16">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="font-playfair text-2xl mb-3">Demande envoyée !</h2>
        <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
          Votre demande a bien été reçue. Un membre du bureau vous contactera sous 48h.
        </p>
        <Link href="/" className="btn-primary no-underline px-6 py-3 rounded-full">Retour à l'accueil</Link>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="flex gap-8 flex-wrap items-start">
        <div className="flex-1 min-w-72">
          <div className="bg-white rounded-2xl p-7" style={{ border: '1px solid var(--border)' }}>
            <h2 className="font-playfair text-xl mb-6">📝 Formulaire d'adhésion</h2>
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
                <label className="label">Établissement <span style={{ color: 'var(--red)' }}>*</span></label>
                <select name="etablissement" className="input" required>
                  <option value="">-- Choisir --</option>
                  {ETABLISSEMENTS.map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Filière</label>
                  <input name="filiere" type="text" className="input" placeholder="Ex: Informatique" />
                </div>
                <div>
                  <label className="label">Niveau</label>
                  <select name="niveau" className="input">
                    {NIVEAUX.map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Année d'arrivée en France</label>
                <input name="annee_arrivee" type="number" className="input" placeholder="2024" min="2010" max="2030" />
              </div>
              <div>
                <label className="label">Message (optionnel)</label>
                <textarea name="message" className="input" rows={3} placeholder="Parlez-nous de vous..." />
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="rgpd" required style={{ width: 'auto', marginTop: 3 }} />
                <label htmlFor="rgpd" className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  J'accepte la politique de confidentialité de l'AEAB <span style={{ color: 'var(--red)' }}>*</span>
                </label>
              </div>
              <button type="submit" disabled={isPending}
                className="w-full py-3 rounded-full font-semibold text-sm text-white disabled:opacity-60 transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--green)' }}>
                {isPending ? '⏳ Envoi...' : '✅ Envoyer ma demande d\'adhésion'}
              </button>
            </form>
          </div>
        </div>
        <div className="w-72 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--green)' }}>✅ Ce que vous obtenez</h3>
            <ul className="space-y-2">
              {['🎟 Accès gratuit aux événements membres','🤝 Réseau d\'entraide et mentorat','📋 Aide administrative prioritaire','🏠 Accès au réseau logement','📚 Guide et ressources exclusives'].map(item => (
                <li key={item} className="text-sm pb-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'var(--green-light)' }}>
            <div className="font-semibold text-sm" style={{ color: 'var(--green)' }}>💚 Adhésion 100% gratuite</div>
            <div className="text-xs mt-1" style={{ color: 'var(--green-mid)' }}>Aucun frais d'inscription</div>
          </div>
        </div>
      </div>
    </div>
  )
}

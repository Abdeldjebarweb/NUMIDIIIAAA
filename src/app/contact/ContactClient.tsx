'use client'
// src/app/contact/ContactClient.tsx
import { useTransition } from 'react'
import { soumettreContact } from '@/lib/actions/formulaires'
import { toast } from 'sonner'

export default function ContactClient() {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await soumettreContact(fd)
      if (result.error) toast.error(result.error)
      else { toast.success(result.success!); (e.target as HTMLFormElement).reset() }
    })
  }

  return (
    <div className="section">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Infos */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
            <h2 className="font-playfair text-xl mb-5">Informations de contact</h2>
            {[
              { icon: '📧', title: 'Email', val: 'contact@aeab.fr', href: 'mailto:contact@aeab.fr' },
              { icon: '📍', title: 'Adresse', val: 'Bordeaux, Gironde, France' },
              { icon: '🕐', title: 'Permanence', val: 'Mercredi 14h-17h · Vendredi 10h-12h' },
            ].map(info => (
              <div key={info.title} className="flex gap-3 mb-4 last:mb-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: 'var(--green-light)' }}>
                  {info.icon}
                </div>
                <div>
                  <div className="font-semibold text-sm">{info.title}</div>
                  {info.href
                    ? <a href={info.href} className="text-sm no-underline" style={{ color: 'var(--green)' }}>{info.val}</a>
                    : <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{info.val}</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
            <h3 className="font-semibold mb-4 text-sm">🌐 Réseaux sociaux</h3>
            {[
              { label: '📸 Instagram @aeab_bordeaux', href: '#' },
              { label: '👥 Facebook AEAB Bordeaux', href: '#' },
            ].map(s => (
              <a key={s.label} href={s.href}
                className="flex items-center gap-2 p-3 rounded-lg text-sm no-underline mb-2 last:mb-0 transition-colors hover:bg-gray-50"
                style={{ background: 'var(--off-white)', color: 'var(--text)' }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl p-7" style={{ border: '1px solid var(--border)' }}>
          <h2 className="font-playfair text-xl mb-6">✉️ Envoyer un message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Nom <span style={{ color: 'var(--red)' }}>*</span></label>
                <input name="nom" type="text" className="input" required />
              </div>
              <div>
                <label className="label">Email <span style={{ color: 'var(--red)' }}>*</span></label>
                <input name="email" type="email" className="input" required />
              </div>
            </div>
            <div>
              <label className="label">Sujet</label>
              <select name="sujet" className="input">
                <option>Information générale</option>
                <option>Adhésion</option>
                <option>Événement</option>
                <option>Demande d'aide</option>
                <option>Partenariat</option>
                <option>Autre</option>
              </select>
            </div>
            <div>
              <label className="label">Message <span style={{ color: 'var(--red)' }}>*</span></label>
              <textarea name="message" className="input" rows={5} required placeholder="Votre message..." />
            </div>
            <button type="submit" disabled={isPending}
              className="w-full py-3 rounded-full font-semibold text-sm text-white disabled:opacity-60 transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--green)' }}>
              {isPending ? '⏳ Envoi...' : '📨 Envoyer le message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

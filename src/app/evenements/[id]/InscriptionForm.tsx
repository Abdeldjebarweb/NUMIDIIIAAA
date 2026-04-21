'use client'
// src/app/evenements/[id]/InscriptionForm.tsx
import { useTransition, useState } from 'react'
import Link from 'next/link'
import { inscrireEvenement } from '@/lib/actions/formulaires'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'

export default function InscriptionForm({
  evenementId,
  user,
}: {
  evenementId: string
  user: User | null
}) {
  const [isPending, startTransition] = useTransition()
  const [done, setDone] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('evenement_id', evenementId)
    startTransition(async () => {
      const result = await inscrireEvenement(fd)
      if (result.error) toast.error(result.error)
      else { toast.success(result.success!); setDone(true) }
    })
  }

  if (done) {
    return (
      <div className="text-center py-4">
        <div className="text-3xl mb-2">🎉</div>
        <p className="font-semibold text-sm" style={{ color: 'var(--green)' }}>Inscription confirmée !</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Vérifiez vos emails.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="font-semibold text-sm mb-3">S'inscrire à cet événement</h3>
      <div>
        <label className="label text-xs">Nom <span style={{ color: 'var(--red)' }}>*</span></label>
        <input name="nom" type="text" className="input text-sm" required />
      </div>
      <div>
        <label className="label text-xs">Prénom <span style={{ color: 'var(--red)' }}>*</span></label>
        <input name="prenom" type="text" className="input text-sm" required />
      </div>
      <div>
        <label className="label text-xs">Email <span style={{ color: 'var(--red)' }}>*</span></label>
        <input name="email" type="email" className="input text-sm" required />
      </div>
      <div>
        <label className="label text-xs">Nombre de places</label>
        <select name="nombre_places" className="input text-sm">
          <option value="1">1 place</option>
          <option value="2">2 places</option>
          <option value="3">3 places</option>
        </select>
      </div>
      {!user && (
        <p className="text-xs p-2 rounded" style={{ background: 'var(--off-white)', color: 'var(--text-muted)' }}>
          💡 <Link href="/login" style={{ color: 'var(--green)' }}>Connectez-vous</Link> pour gérer vos inscriptions.
        </p>
      )}
      <button type="submit" disabled={isPending}
        className="w-full py-2.5 rounded-full font-semibold text-sm text-white disabled:opacity-60 transition-all"
        style={{ background: 'var(--green)' }}>
        {isPending ? '⏳ Inscription...' : '✅ Confirmer l\'inscription'}
      </button>
      <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
        Entrée gratuite pour les membres
      </p>
    </form>
  )
}

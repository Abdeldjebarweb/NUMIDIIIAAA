'use client'
import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const [pwd, setPwd] = useState('')
  const [pwd2, setPwd2] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pwd !== pwd2) { toast.error('Les mots de passe ne correspondent pas'); return }
    if (pwd.length < 8) { toast.error('Minimum 8 caractères'); return }
    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: pwd })
      if (error) toast.error('Erreur : ' + error.message)
      else { toast.success('Mot de passe mis à jour !'); router.push('/login') }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--off-white)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-3"
            style={{ background: 'var(--green)' }}>☪</div>
          <h1 className="font-playfair text-2xl">Nouveau mot de passe</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Choisissez un nouveau mot de passe sécurisé</p>
        </div>
        <div className="bg-white rounded-2xl p-7 shadow-sm" style={{ border: '1px solid var(--border)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Nouveau mot de passe</label>
              <input type="password" className="input" placeholder="8 caractères minimum"
                value={pwd} onChange={e => setPwd(e.target.value)} required />
            </div>
            <div>
              <label className="label">Confirmer</label>
              <input type="password" className="input" placeholder="••••••••"
                value={pwd2} onChange={e => setPwd2(e.target.value)} required />
            </div>
            <button type="submit" disabled={isPending}
              className="w-full py-3 rounded-full font-semibold text-sm text-white disabled:opacity-60"
              style={{ background: 'var(--green)' }}>
              {isPending ? '⏳ Mise à jour...' : '🔐 Changer le mot de passe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

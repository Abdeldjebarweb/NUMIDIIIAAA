// src/app/login/page.tsx
'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { login, resetPassword } from '@/lib/actions/auth'
import { toast } from 'sonner'

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()
  const [showPwd, setShowPwd] = useState(false)
  const [view, setView] = useState<'login' | 'reset'>('login')
  const [resetEmail, setResetEmail] = useState('')

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await login(fd)
      if (result?.error) toast.error(result.error)
    })
  }

  function handleReset(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await resetPassword(resetEmail)
      if (result.error) toast.error(result.error)
      else { toast.success(result.success!); setView('login') }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'var(--off-white)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-3"
            style={{ background: 'var(--green)' }}>
            ☪
          </div>
          <h1 className="font-playfair text-2xl">Espace membre</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {view === 'login' ? 'Connectez-vous à votre compte AEAB' : 'Réinitialiser votre mot de passe'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-7 shadow-sm" style={{ border: '1px solid var(--border)' }}>
          {view === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input name="email" type="email" className="input" placeholder="votre@email.com" required autoComplete="email" />
              </div>
              <div>
                <label className="label">Mot de passe</label>
                <div className="relative">
                  <input name="password" type={showPwd ? 'text' : 'password'} className="input pr-10"
                    placeholder="••••••••" required autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    {showPwd ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <button type="button" onClick={() => setView('reset')}
                  className="text-sm" style={{ color: 'var(--green)' }}>
                  Mot de passe oublié ?
                </button>
              </div>
              <button type="submit" disabled={isPending}
                className="w-full py-3 rounded-full font-semibold text-sm text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: 'var(--green)' }}>
                {isPending ? '⏳ Connexion...' : '🔐 Se connecter'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="label">Votre email</label>
                <input type="email" className="input" placeholder="votre@email.com" required
                  value={resetEmail} onChange={e => setResetEmail(e.target.value)} />
              </div>
              <button type="submit" disabled={isPending}
                className="w-full py-3 rounded-full font-semibold text-sm text-white"
                style={{ background: 'var(--green)' }}>
                {isPending ? '⏳ Envoi...' : '📧 Envoyer le lien'}
              </button>
              <button type="button" onClick={() => setView('login')}
                className="w-full text-sm" style={{ color: 'var(--text-muted)' }}>
                ← Retour à la connexion
              </button>
            </form>
          )}

          <div className="mt-5 pt-5 border-t text-center" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Pas encore membre ?{' '}
              <Link href="/register" style={{ color: 'var(--green)' }} className="font-semibold no-underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          🔒 Connexion sécurisée · Données chiffrées
        </p>
        <p className="text-center text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          <Link href="/" className="no-underline" style={{ color: 'var(--text-muted)' }}>← Retour au site</Link>
        </p>
      </div>
    </div>
  )
}

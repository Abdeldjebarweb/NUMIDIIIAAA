// src/app/register/page.tsx
'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { register } from '@/lib/actions/auth'
import { toast } from 'sonner'

function getStrength(pwd: string) {
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  const labels = ['', 'Faible', 'Moyen', 'Bon', 'Très fort']
  const colors = ['', '#e24b4a', '#ef9f27', '#63a000', '#006233']
  return { score, label: labels[score] || '', color: colors[score] || '' }
}

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition()
  const [showPwd, setShowPwd] = useState(false)
  const [pwd, setPwd] = useState('')
  const [success, setSuccess] = useState(false)
  const strength = getStrength(pwd)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await register(fd)
      if (result.error) toast.error(result.error)
      else setSuccess(true)
    })
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--off-white)' }}>
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="font-playfair text-2xl mb-2">Vérifiez vos emails</h2>
          <p style={{ color: 'var(--text-muted)' }} className="mb-6">
            Un lien de confirmation a été envoyé à votre adresse email. Cliquez dessus pour activer votre compte.
          </p>
          <Link href="/login" className="btn-primary no-underline">
            Aller à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'var(--off-white)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-3"
            style={{ background: 'var(--green)' }}>☪</div>
          <h1 className="font-playfair text-2xl">Créer un compte</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Rejoignez la communauté AEAB</p>
        </div>

        <div className="bg-white rounded-2xl p-7 shadow-sm" style={{ border: '1px solid var(--border)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Nom <span style={{ color: 'var(--red)' }}>*</span></label>
                <input name="nom" type="text" className="input" placeholder="Votre nom" required />
              </div>
              <div>
                <label className="label">Prénom <span style={{ color: 'var(--red)' }}>*</span></label>
                <input name="prenom" type="text" className="input" placeholder="Prénom" required />
              </div>
            </div>
            <div>
              <label className="label">Email <span style={{ color: 'var(--red)' }}>*</span></label>
              <input name="email" type="email" className="input" placeholder="votre@email.com" required />
            </div>
            <div>
              <label className="label">Mot de passe <span style={{ color: 'var(--red)' }}>*</span></label>
              <div className="relative">
                <input name="password" type={showPwd ? 'text' : 'password'} className="input pr-10"
                  placeholder="8 caractères minimum" required value={pwd} onChange={e => setPwd(e.target.value)} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  {showPwd ? '🙈' : '👁'}
                </button>
              </div>
              {pwd && (
                <div className="mt-2">
                  <div className="h-1 rounded-full mb-1" style={{ background: 'var(--border)' }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${strength.score * 25}%`, background: strength.color }} />
                  </div>
                  <span className="text-xs" style={{ color: strength.color }}>{strength.label}</span>
                </div>
              )}
            </div>
            <div>
              <label className="label">Confirmer <span style={{ color: 'var(--red)' }}>*</span></label>
              <input name="confirmPassword" type="password" className="input" placeholder="••••••••" required />
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" id="rgpd" required className="mt-0.5" style={{ width: 'auto' }} />
              <label htmlFor="rgpd" className="text-xs" style={{ color: 'var(--text-muted)' }}>
                J'accepte la{' '}
                <Link href="/confidentialite" className="no-underline" style={{ color: 'var(--green)' }}>
                  politique de confidentialité
                </Link>{' '}
                de l'AEAB <span style={{ color: 'var(--red)' }}>*</span>
              </label>
            </div>
            <button type="submit" disabled={isPending}
              className="w-full py-3 rounded-full font-semibold text-sm text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: 'var(--green)' }}>
              {isPending ? '⏳ Création...' : '✅ Créer mon compte'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t text-center" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Déjà un compte ?{' '}
              <Link href="/login" style={{ color: 'var(--green)' }} className="font-semibold no-underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          <Link href="/" className="no-underline" style={{ color: 'var(--text-muted)' }}>← Retour au site</Link>
        </p>
      </div>
    </div>
  )
}

'use client'
// src/app/admin/parametres/ParametresClient.tsx
import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'


export default function ParametresClient({ profile }: { profile: any | null }) {
  const [isPending, startTransition] = useTransition()
  const [pwdActuel, setPwdActuel] = useState('')
  const [pwdNouveau, setPwdNouveau] = useState('')
  const [pwdConfirm, setPwdConfirm] = useState('')
  const supabase = createClient()

  function handleChangePwd(e: React.FormEvent) {
    e.preventDefault()
    if (pwdNouveau !== pwdConfirm) { toast.error('Les mots de passe ne correspondent pas'); return }
    if (pwdNouveau.length < 8) { toast.error('Minimum 8 caractères'); return }
    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({ password: pwdNouveau })
      if (error) toast.error('Erreur : ' + error.message)
      else {
        toast.success('Mot de passe mis à jour !')
        setPwdActuel(''); setPwdNouveau(''); setPwdConfirm('')
      }
    })
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="font-playfair text-2xl">⚙️ Paramètres</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Gérez les paramètres de votre compte administrateur</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
        {/* Info compte */}
        <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
          <h2 className="font-playfair text-lg mb-5">👤 Compte admin</h2>
          <div className="space-y-3">
            {[
              { label: 'Nom', val: `${profile?.prenom} ${profile?.nom}` },
              { label: 'Email', val: profile?.email },
              { label: 'Rôle', val: profile?.role },
              { label: 'Statut', val: profile?.statut },
            ].map(item => (
              <div key={item.label} className="flex justify-between py-2 border-b last:border-0"
                style={{ borderColor: 'var(--border)' }}>
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Changer mot de passe */}
        <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
          <h2 className="font-playfair text-lg mb-5">🔐 Changer le mot de passe</h2>
          <form onSubmit={handleChangePwd} className="space-y-4">
            <div>
              <label className="label">Nouveau mot de passe</label>
              <input type="password" className="input" placeholder="8 caractères minimum"
                value={pwdNouveau} onChange={e => setPwdNouveau(e.target.value)} required />
            </div>
            <div>
              <label className="label">Confirmer</label>
              <input type="password" className="input" placeholder="••••••••"
                value={pwdConfirm} onChange={e => setPwdConfirm(e.target.value)} required />
            </div>
            <button type="submit" disabled={isPending}
              className="w-full py-2.5 rounded-full text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: 'var(--green)' }}>
              {isPending ? '⏳...' : '✅ Mettre à jour'}
            </button>
          </form>
        </div>

        {/* Infos site */}
        <div className="bg-white rounded-2xl p-6 md:col-span-2" style={{ border: '1px solid var(--border)' }}>
          <h2 className="font-playfair text-lg mb-5">🌐 Informations du site</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: 'Nom de l\'association', val: 'Association des Étudiants Algériens à Bordeaux' },
              { label: 'Email de contact', val: 'contact@aeab.fr' },
              { label: 'Téléphone', val: '+33 X XX XX XX XX' },
              { label: 'Adresse', val: 'Bordeaux, Gironde, France' },
            ].map(item => (
              <div key={item.label}>
                <label className="label">{item.label}</label>
                <input type="text" className="input" defaultValue={item.val}
                  onBlur={() => toast.info('Modification des paramètres du site : contactez votre développeur ou éditez directement .env.local')} />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: 'var(--off-white)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            ℹ️ Pour modifier les paramètres du site (URL, nom, email), éditez les variables dans <code>.env.local</code> et redéployez sur Vercel.
          </div>
        </div>

        {/* Exportation données */}
        <div className="bg-white rounded-2xl p-6 md:col-span-2" style={{ border: '1px solid var(--border)' }}>
          <h2 className="font-playfair text-lg mb-3">📊 Exportation des données (RGPD)</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Exportez les données des membres et des dons pour vos obligations légales.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => toast.info('Export disponible dans Supabase → Table Editor → Export CSV')}
              className="px-5 py-2.5 rounded-full text-sm font-semibold"
              style={{ background: 'var(--green-light)', color: 'var(--green)', border: '1px solid var(--green)' }}>
              📥 Exporter les membres (CSV)
            </button>
            <button onClick={() => toast.info('Export disponible dans Supabase → Table Editor → Export CSV')}
              className="px-5 py-2.5 rounded-full text-sm font-semibold"
              style={{ background: 'var(--green-light)', color: 'var(--green)', border: '1px solid var(--green)' }}>
              📥 Exporter les dons (CSV)
            </button>
            <button onClick={() => toast.info('Export disponible dans Supabase → Table Editor → Export CSV')}
              className="px-5 py-2.5 rounded-full text-sm font-semibold"
              style={{ background: 'var(--off-white)', border: '1px solid var(--border)' }}>
              📥 Toutes les demandes d'aide
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

'use client'
// src/app/admin/dons/DonsClient.tsx
import { useTransition } from 'react'
import { envoyerRecuFiscal } from '@/lib/actions/admin'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Props {
  dons: any[]
  stats: { dons_ce_mois: number; dons_cette_annee: number } | null
}

export default function DonsClient({ dons, stats }: Props) {
  const [isPending, startTransition] = useTransition()

  function handleRecu(id: string) {
    startTransition(async () => {
      const r = await envoyerRecuFiscal(id)
      if (r.error) toast.error(r.error)
      else { toast.success(r.success!); location.reload() }
    })
  }

  const donsComplets = dons.filter(d => d.statut === 'complete')
  const totalMois = donsComplets
    .filter(d => new Date(d.created_at).getMonth() === new Date().getMonth())
    .reduce((s: number, d: any) => s + Number(d.montant), 0)
  const totalAnnee = donsComplets
    .filter(d => new Date(d.created_at).getFullYear() === new Date().getFullYear())
    .reduce((s: number, d: any) => s + Number(d.montant), 0)
  const nbDonateurs = new Set(donsComplets.filter(d => d.email).map(d => d.email)).size
  const moyenne = donsComplets.length > 0 ? totalAnnee / donsComplets.length : 0

  return (
    <>
      <div className="mb-6">
        <h1 className="font-playfair text-2xl mb-5">💰 Gestion des dons</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Dons ce mois', val: `€ ${totalMois.toFixed(0)}`, color: 'var(--green)' },
            { label: 'Dons cette année', val: `€ ${totalAnnee.toFixed(0)}`, color: 'var(--green)' },
            { label: 'Donateurs uniques', val: nbDonateurs, color: '#1d4ed8' },
            { label: 'Don moyen', val: `€ ${moyenne.toFixed(0)}`, color: '#d97706' },
          ].map(m => (
            <div key={m.label} className="bg-white rounded-xl p-4" style={{ border: '1px solid var(--border)' }}>
              <div className="text-2xl font-bold font-playfair" style={{ color: m.color }}>{m.val}</div>
              <div className="text-xs uppercase tracking-wide mt-1" style={{ color: 'var(--text-muted)' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead><tr>
            <th>Donateur</th><th>Montant</th><th>Date</th><th>Statut</th><th>Reçu</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {dons.map((d: any) => (
              <tr key={d.id}>
                <td>
                  {d.anonyme ? (
                    <span className="italic" style={{ color: 'var(--text-muted)' }}>Anonyme</span>
                  ) : (
                    <div>
                      <div className="font-medium text-sm">{d.nom || '—'}</div>
                      {d.email && <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{d.email}</div>}
                    </div>
                  )}
                </td>
                <td>
                  <span className="font-bold" style={{ color: 'var(--green)' }}>€ {Number(d.montant).toFixed(2)}</span>
                </td>
                <td className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {format(new Date(d.created_at), 'd MMM yyyy HH:mm', { locale: fr })}
                </td>
                <td>
                  <span className={
                    d.statut === 'complete' ? 'badge-green' :
                    d.statut === 'echoue' ? 'badge-red' :
                    d.statut === 'rembourse' ? 'badge-yellow' : 'badge-gray'
                  }>
                    {d.statut === 'complete' ? '✅ Validé' :
                     d.statut === 'echoue' ? '❌ Échoué' :
                     d.statut === 'rembourse' ? '↩️ Remboursé' : '⏳ En attente'}
                  </span>
                </td>
                <td>
                  {d.recu_envoye
                    ? <span className="badge-green">✅ Envoyé</span>
                    : <span className="badge-gray">Non envoyé</span>}
                </td>
                <td>
                  {d.statut === 'complete' && !d.recu_envoye && d.email && (
                    <button onClick={() => handleRecu(d.id)} disabled={isPending}
                      className="text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap"
                      style={{ background: 'var(--green-light)', color: 'var(--green)', border: '1px solid var(--green)' }}>
                      📄 Envoyer reçu
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {dons.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-sm" style={{ color: 'var(--text-muted)' }}>
                Aucun don enregistré.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

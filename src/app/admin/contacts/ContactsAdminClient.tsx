'use client'
// src/app/admin/contacts/ContactsAdminClient.tsx
import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'


const STATUT_BADGE: Record<string, string> = {
  non_lu: 'badge-red',
  lu: 'badge-yellow',
  repondu: 'badge-green',
}

export default function ContactsAdminClient({ contacts }: { contacts: any[] }) {
  const [selected, setSelected] = useState<any | null>(null)
  const [isPending, startTransition] = useTransition()
  const [filtre, setFiltre] = useState('tous')
  const supabase = createClient()

  const filtered = filtre === 'tous' ? contacts : contacts.filter(c => c.statut === filtre)
  const nonLus = contacts.filter(c => c.statut === 'non_lu').length

  function markAs(id: string, statut: string) {
    startTransition(async () => {
      const { error } = await (supabase as any).from('contacts').update({ statut }).eq('id', id)
      if (error) toast.error('Erreur')
      else { toast.success('Statut mis à jour'); location.reload() }
    })
  }

  function openContact(c: any) {
    setSelected(c)
    if (c.statut === 'non_lu') markAs(c.id, 'lu')
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-playfair text-2xl">💬 Messages de contact</h1>
          {nonLus > 0 && (
            <p className="text-sm mt-1" style={{ color: 'var(--red)' }}>
              {nonLus} message(s) non lu(s)
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {['tous', 'non_lu', 'lu', 'repondu'].map(f => (
            <button key={f} onClick={() => setFiltre(f)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: filtre === f ? 'var(--green)' : '#fff',
                color: filtre === f ? '#fff' : 'var(--text)',
                border: '1px solid var(--border)',
              }}>
              {f === 'tous' ? 'Tous' : f.replace('_', ' ')} ({f === 'tous' ? contacts.length : contacts.filter(c => c.statut === f).length})
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-5" style={{ minHeight: 500 }}>
        {/* Liste */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-2">
          {filtered.map(c => (
            <div key={c.id}
              onClick={() => openContact(c)}
              className="bg-white rounded-xl p-4 cursor-pointer transition-all"
              style={{
                border: `1px solid ${selected?.id === c.id ? 'var(--green)' : 'var(--border)'}`,
                boxShadow: selected?.id === c.id ? '0 0 0 2px rgba(0,98,51,0.1)' : 'none',
              }}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="font-medium text-sm">{c.nom}</div>
                <span className={STATUT_BADGE[c.statut]}>{c.statut.replace('_', ' ')}</span>
              </div>
              <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{c.sujet || 'Sans sujet'}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {format(new Date(c.created_at), 'd MMM HH:mm', { locale: fr })}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-sm" style={{ color: 'var(--text-muted)' }}>Aucun message</div>
          )}
        </div>

        {/* Détail */}
        <div className="flex-1">
          {selected ? (
            <div className="bg-white rounded-2xl p-6 h-full" style={{ border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="font-semibold text-lg">{selected.sujet || 'Sans sujet'}</h2>
                  <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    De : <strong>{selected.nom}</strong> ({selected.email}) ·{' '}
                    {format(new Date(selected.created_at), 'd MMMM yyyy à HH:mm', { locale: fr })}
                  </div>
                </div>
                <span className={STATUT_BADGE[selected.statut]}>{selected.statut.replace('_', ' ')}</span>
              </div>

              <div className="p-4 rounded-xl mb-5" style={{ background: 'var(--off-white)', border: '1px solid var(--border)' }}>
                <p className="text-sm" style={{ lineHeight: 1.8, color: 'var(--text)' }}>{selected.message}</p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.sujet || 'Votre message'}`}
                  onClick={() => markAs(selected.id, 'repondu')}
                  className="btn-primary no-underline px-5 py-2.5 text-sm rounded-full">
                  📧 Répondre par email
                </a>
                {selected.statut !== 'repondu' && (
                  <button onClick={() => markAs(selected.id, 'repondu')} disabled={isPending}
                    className="px-5 py-2.5 rounded-full text-sm font-semibold"
                    style={{ background: 'var(--green-light)', color: 'var(--green)', border: '1px solid var(--green)' }}>
                    ✅ Marquer comme répondu
                  </button>
                )}
                <button onClick={() => setSelected(null)}
                  className="px-5 py-2.5 rounded-full text-sm"
                  style={{ background: 'var(--off-white)', border: '1px solid var(--border)' }}>
                  ✕ Fermer
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl h-full flex items-center justify-center"
              style={{ border: '1px solid var(--border)' }}>
              <div className="text-center" style={{ color: 'var(--text-muted)' }}>
                <div className="text-4xl mb-3">💬</div>
                <p>Sélectionnez un message pour le lire</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

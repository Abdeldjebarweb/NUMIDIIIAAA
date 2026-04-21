'use client'
// src/app/profil/ProfilClient.tsx
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Inscription {
  id: string
  statut: string
  created_at: string
  evenements: { titre: string; date_debut: string; lieu: string | null } | null
}

// Props
interface Props {
  profile: any | null
  adhesion: any | null
  inscriptions: Inscription[]
}

const NIVEAUX = ['Licence 1','Licence 2','Licence 3','Master 1','Master 2','Doctorat','Autre']
const ETABLISSEMENTS = ['Université de Bordeaux','Bordeaux INP','Sciences Po Bordeaux','INSEEC Bordeaux','KEDGE Business School','IUT de Bordeaux','Autre']

export default function ProfilClient({ profile, adhesion, inscriptions }: Props) {
  const [editing, setEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [nom, setNom] = useState(profile?.nom ?? '')
  const [prenom, setPrenom] = useState(profile?.prenom ?? '')
  const [telephone, setTelephone] = useState(profile?.telephone ?? '')
  const [etablissement, setEtablissement] = useState(profile?.etablissement ?? '')
  const [filiere, setFiliere] = useState(profile?.filiere ?? '')
  const [niveau, setNiveau] = useState(profile?.niveau ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')

  const supabase = createClient()

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ nom, prenom, telephone, etablissement, filiere, niveau, bio })
        .eq('id', profile!.id)
      if (error) toast.error('Erreur lors de la sauvegarde')
      else { toast.success('Profil mis à jour !'); setEditing(false) }
    })
  }

  const STATUT_ADHESION: Record<string, { label: string; style: string }> = {
    en_attente: { label: '⏳ En attente de validation', style: 'badge-yellow' },
    approuve: { label: '✅ Membre actif', style: 'badge-green' },
    refuse: { label: '❌ Refusée', style: 'badge-red' },
  }

  return (
    <div className="section max-w-4xl">
      <div className="grid md:grid-cols-3 gap-6">

        {/* Sidebar statut */}
        <div className="space-y-4">
          {/* Statut adhésion */}
          <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
            <h3 className="font-semibold text-sm mb-3">Statut adhésion</h3>
            {adhesion ? (
              <div>
                <span className={STATUT_ADHESION[adhesion.statut]?.style || 'badge-gray'}>
                  {STATUT_ADHESION[adhesion.statut]?.label || adhesion.statut}
                </span>
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  Demande du {format(new Date(adhesion.created_at), 'd MMM yyyy', { locale: fr })}
                </p>
              </div>
            ) : (
              <div>
                <span className="badge-gray">Non membre</span>
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  Vous n&apos;avez pas encore fait de demande d&apos;adhésion.
                </p>
                <Link href="/adhesion"
                  className="block mt-3 text-center py-2 rounded-full text-sm font-semibold text-white no-underline"
                  style={{ background: 'var(--green)' }}>
                  Adhérer maintenant
                </Link>
              </div>
            )}
          </div>

          {/* Mes inscriptions récentes */}
          <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
            <h3 className="font-semibold text-sm mb-3">Mes inscriptions</h3>
            {inscriptions.length > 0 ? (
              <div className="space-y-2">
                {inscriptions.map(ins => (
                  <div key={ins.id} className="p-3 rounded-lg text-sm" style={{ background: 'var(--off-white)' }}>
                    <div className="font-medium">{ins.evenements?.titre}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {ins.evenements?.date_debut
                        ? format(new Date(ins.evenements.date_debut), 'd MMM yyyy', { locale: fr })
                        : '—'}
                    </div>
                    <span className={ins.statut === 'confirmee' ? 'badge-green' : 'badge-gray'}
                      style={{ fontSize: '0.7rem', marginTop: 4, display: 'inline-block' }}>
                      {ins.statut}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Aucune inscription pour l&apos;instant.</p>
            )}
            <Link href="/evenements"
              className="block mt-3 text-center py-2 rounded-full text-sm font-semibold no-underline"
              style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
              Voir les événements
            </Link>
          </div>

          {/* Liens rapides */}
          <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
            <h3 className="font-semibold text-sm mb-3">Actions rapides</h3>
            <div className="space-y-2">
              <Link href="/aide" className="flex items-center gap-2 text-sm py-2 no-underline" style={{ color: 'var(--text)' }}>
                🆘 Demander de l&apos;aide
              </Link>
              <Link href="/don" className="flex items-center gap-2 text-sm py-2 no-underline" style={{ color: 'var(--text)' }}>
                💚 Faire un don
              </Link>
              <Link href="/evenements" className="flex items-center gap-2 text-sm py-2 no-underline" style={{ color: 'var(--text)' }}>
                📅 Voir les événements
              </Link>
            </div>
          </div>
        </div>

        {/* Formulaire profil */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl p-7" style={{ border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair text-xl">Mes informations</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)}
                  className="text-sm px-4 py-2 rounded-full font-semibold"
                  style={{ background: 'var(--green-light)', color: 'var(--green)', border: '1px solid var(--green)' }}>
                  ✏️ Modifier
                </button>
              ) : (
                <button onClick={() => setEditing(false)}
                  className="text-sm px-4 py-2 rounded-full"
                  style={{ color: 'var(--text-muted)' }}>
                  Annuler
                </button>
              )}
            </div>

            {!editing ? (
              <div className="space-y-4">
                {[
                  { label: 'Nom complet', val: `${profile?.prenom} ${profile?.nom}` },
                  { label: 'Téléphone', val: profile?.telephone || '—' },
                  { label: 'Établissement', val: profile?.etablissement || '—' },
                  { label: 'Filière', val: profile?.filiere || '—' },
                  { label: 'Niveau', val: profile?.niveau || '—' },
                  { label: 'Ville', val: profile?.ville || 'Bordeaux' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-3 border-b"
                    style={{ borderColor: 'var(--border)' }}>
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.val}</span>
                  </div>
                ))}
                {profile?.bio && (
                  <div className="py-3">
                    <span className="text-sm font-medium block mb-1">Bio</span>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{profile.bio}</p>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Nom</label>
                    <input className="input" value={nom} onChange={e => setNom(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Prénom</label>
                    <input className="input" value={prenom} onChange={e => setPrenom(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="label">Téléphone</label>
                  <input className="input" type="tel" value={telephone} onChange={e => setTelephone(e.target.value)} placeholder="+33 6 XX XX XX XX" />
                </div>
                <div>
                  <label className="label">Établissement</label>
                  <select className="input" value={etablissement} onChange={e => setEtablissement(e.target.value)}>
                    <option value="">-- Choisir --</option>
                    {ETABLISSEMENTS.map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Filière</label>
                    <input className="input" value={filiere} onChange={e => setFiliere(e.target.value)} placeholder="Ex: Informatique" />
                  </div>
                  <div>
                    <label className="label">Niveau</label>
                    <select className="input" value={niveau} onChange={e => setNiveau(e.target.value)}>
                      <option value="">-- Choisir --</option>
                      {NIVEAUX.map(n => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Bio (optionnel)</label>
                  <textarea className="input" rows={3} value={bio} onChange={e => setBio(e.target.value)}
                    placeholder="Quelques mots sur vous..." />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditing(false)}
                    className="flex-1 py-2.5 rounded-full text-sm font-semibold"
                    style={{ background: 'var(--off-white)', border: '1px solid var(--border)' }}>
                    Annuler
                  </button>
                  <button type="submit" disabled={isPending}
                    className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white disabled:opacity-60"
                    style={{ background: 'var(--green)' }}>
                    {isPending ? '⏳ Enregistrement...' : '✅ Sauvegarder'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

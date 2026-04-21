'use client'
// src/app/admin/actualites/ActualitesAdminClient.tsx
import { useState, useTransition } from 'react'
import { creerActualite, supprimerActualite } from '@/lib/actions/admin'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'


const CATS = ['association', 'urgent', 'partenariat', 'rapport', 'guide']
const BADGE: Record<string, string> = { association: 'badge-green', urgent: 'badge-red', partenariat: 'badge-yellow', rapport: 'badge-gray', guide: 'badge-green' }

export default function ActualitesAdminClient({ actualites }: { actualites: any[] }) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const r = await creerActualite(fd)
      if (r.error) toast.error(r.error)
      else { toast.success(r.success!); setShowForm(false); location.reload() }
    })
  }

  function handleDelete(id: string, titre: string) {
    if (!confirm(`Supprimer "${titre}" ?`)) return
    startTransition(async () => {
      const r = await supprimerActualite(id)
      if (r.error) toast.error(r.error)
      else { toast.success('Article supprimé.'); location.reload() }
    })
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-playfair text-2xl">📰 Gestion des actualités</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary px-5 py-2.5 text-sm">
          {showForm ? '✕ Fermer' : '+ Nouvel article'}
        </button>
      </div>

      {/* Formulaire création */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 mb-6" style={{ border: '1px solid var(--border)' }}>
          <h2 className="font-playfair text-lg mb-5">✍️ Rédiger un article</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Titre <span style={{ color: 'var(--red)' }}>*</span></label>
              <input name="titre" type="text" className="input" required placeholder="Titre de l'article" />
            </div>
            <div>
              <label className="label">Extrait (résumé visible en liste)</label>
              <textarea name="extrait" className="input" rows={2} placeholder="Courte description qui apparaît dans les listes..." />
            </div>
            <div>
              <label className="label">Contenu complet <span style={{ color: 'var(--red)' }}>*</span></label>
              <textarea name="contenu" className="input" rows={8} required
                placeholder="Rédigez votre article ici. HTML basique supporté : <p>, <strong>, <em>, <ul>, <li>, <h2>..." />
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                HTML basique accepté : &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;h2&gt;, &lt;a href=""&gt;
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label">Catégorie</label>
                <select name="categorie" className="input">
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Statut</label>
                <select name="statut" className="input">
                  <option value="publie">Publié</option>
                  <option value="brouillon">Brouillon</option>
                </select>
              </div>
              <div>
                <label className="label">Mise en avant</label>
                <select name="mis_en_avant" className="input">
                  <option value="false">Non</option>
                  <option value="true">Oui</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Image (URL)</label>
              <input name="image_url" type="url" className="input" placeholder="https://..." />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-full text-sm font-semibold"
                style={{ background: 'var(--off-white)', border: '1px solid var(--border)' }}>
                Annuler
              </button>
              <button type="submit" disabled={isPending}
                className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white disabled:opacity-60"
                style={{ background: 'var(--green)' }}>
                {isPending ? '⏳ Publication...' : '✅ Publier l\'article'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste articles */}
      <div className="table-wrapper">
        <table>
          <thead><tr>
            <th>Titre</th><th>Catégorie</th><th>Date</th><th>Statut</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {(actualites as any[]).map((a: any) => (
              <tr key={a.id}>
                <td>
                  <div className="font-medium">{a.titre}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.extrait?.slice(0, 60)}...</div>
                </td>
                <td><span className={BADGE[a.categorie] || 'badge-gray'}>{a.categorie}</span></td>
                <td className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {format(new Date(a.created_at), 'd MMM yyyy', { locale: fr })}
                </td>
                <td>
                  <span className={a.statut === 'publie' ? 'badge-green' : 'badge-gray'}>{a.statut}</span>
                  {a.mis_en_avant && <span className="badge-yellow ml-1">⭐ vedette</span>}
                </td>
                <td>
                  <div className="flex gap-2">
                    <a href={`/actualites/${a.slug}`} target="_blank"
                      className="text-xs px-3 py-1.5 rounded-full font-semibold no-underline"
                      style={{ background: 'var(--green-light)', color: 'var(--green)', border: '1px solid var(--green)' }}>
                      👁 Voir
                    </a>
                    <button onClick={() => handleDelete(a.id, a.titre)} disabled={isPending}
                      className="text-xs px-3 py-1.5 rounded-full font-semibold"
                      style={{ background: 'var(--red-light)', color: 'var(--red)', border: '1px solid var(--red)' }}>
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {actualites.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-sm" style={{ color: 'var(--text-muted)' }}>Aucun article. Créez votre premier article.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

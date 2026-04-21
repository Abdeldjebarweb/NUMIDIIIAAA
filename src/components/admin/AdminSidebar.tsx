// src/components/admin/AdminSidebar.tsx
import Link from 'next/link'

const NAV = [
  { key: 'dashboard', href: '/admin', label: '📊 Tableau de bord' },
  { key: 'membres', href: '/admin/membres', label: '👥 Membres' },
  { key: 'evenements', href: '/admin/evenements', label: '📅 Événements' },
  { key: 'demandes', href: '/admin/demandes', label: '📩 Demandes d\'aide' },
  { key: 'actualites', href: '/admin/actualites', label: '📰 Actualités' },
  { key: 'dons', href: '/admin/dons', label: '💰 Dons' },
  { key: 'contacts', href: '/admin/contacts', label: '💬 Messages' },
  { key: 'parametres', href: '/admin/parametres', label: '⚙️ Paramètres' },
]

export default function AdminSidebar({ active }: { active: string }) {
  return (
    <aside className="w-56 flex-shrink-0 sticky top-0 h-screen overflow-y-auto hidden md:block"
      style={{ background: 'var(--green)' }}>
      <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
        <Link href="/" className="no-underline">
          <div className="text-white font-bold text-lg">☪ AEAB</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Panneau admin</div>
        </Link>
      </div>
      <nav className="py-2">
        {NAV.map(item => (
          <Link key={item.key} href={item.href}
            className="flex items-center px-4 py-2.5 text-sm no-underline transition-all"
            style={{
              color: active === item.key ? '#fff' : 'rgba(255,255,255,0.7)',
              background: active === item.key ? 'rgba(255,255,255,0.15)' : 'transparent',
              fontWeight: active === item.key ? '600' : '400',
            }}>
            {item.label}
          </Link>
        ))}
        <div className="mx-4 mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
          <Link href="/" className="flex items-center py-2 text-sm no-underline"
            style={{ color: 'rgba(255,180,180,0.85)' }}>
            ← Retour au site public
          </Link>
        </div>
      </nav>
    </aside>
  )
}

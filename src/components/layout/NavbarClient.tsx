'use client'
// src/components/layout/NavbarClient.tsx

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavbarClientProps {
  user: { email: string; nom?: string; prenom?: string } | null
  isAdmin: boolean
  logoutAction: () => Promise<void>
}

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/evenements', label: 'Événements' },
  { href: '/actualites', label: 'Actualités' },
  { href: '/guide', label: 'Guide' },
  { href: '/aide', label: '🆘 Aide' },
  { href: '/contact', label: 'Contact' },
]

export default function NavbarClient({ user, isAdmin, logoutAction }: NavbarClientProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav className="sticky top-0 z-50 shadow-lg" style={{ background: 'var(--green)' }}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xl"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            ☪
          </div>
          <div>
            <div className="text-white font-playfair font-bold text-lg leading-tight">AEAB</div>
            <div className="text-xs leading-tight" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Étudiants Algériens à Bordeaux
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-md text-sm transition-all no-underline ${
                isActive(link.href)
                  ? 'bg-white/20 text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA + Auth */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/adhesion" className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--red)' }}>
            Adhérer
          </Link>
          <Link href="/don" className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
            💚 Don
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: 'rgba(255,255,255,0.2)' }}>
                  {user.prenom?.[0] ?? '?'}{user.nom?.[0] ?? ''}
                </div>
                <span className="text-sm">{user.prenom}</span>
                <span className="text-xs opacity-60">▾</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border z-50 overflow-hidden"
                  style={{ borderColor: 'var(--border)' }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <p className="font-semibold text-sm">{user.prenom} {user.nom}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>
                  {isAdmin && (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm no-underline transition-colors hover:bg-gray-50"
                      style={{ color: 'var(--green)' }}>
                      ⚙️ Panneau admin
                    </Link>
                  )}
                  <Link href="/profil" className="flex items-center gap-2 px-4 py-2.5 text-sm no-underline transition-colors hover:bg-gray-50"
                    style={{ color: 'var(--text)' }}>
                    👤 Mon profil
                  </Link>
                  <Link href="/mes-inscriptions" className="flex items-center gap-2 px-4 py-2.5 text-sm no-underline transition-colors hover:bg-gray-50"
                    style={{ color: 'var(--text)' }}>
                    🎟 Mes inscriptions
                  </Link>
                  <div className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <form action={logoutAction}>
                      <button type="submit" className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50"
                        style={{ color: 'var(--red)' }}>
                        🚪 Déconnexion
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-full text-sm transition-all"
              style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)' }}>
              Connexion
            </Link>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-1" style={{ background: 'var(--green)' }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm no-underline ${
                isActive(link.href) ? 'bg-white/20 text-white font-semibold' : 'text-white/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 mt-2">
            <Link href="/adhesion" onClick={() => setMenuOpen(false)}
              className="flex-1 py-2.5 rounded-full text-sm font-semibold text-center text-white no-underline"
              style={{ background: 'var(--red)' }}>
              Adhérer
            </Link>
            <Link href="/don" onClick={() => setMenuOpen(false)}
              className="flex-1 py-2.5 rounded-full text-sm font-semibold text-center no-underline"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
              💚 Don
            </Link>
          </div>
          {!user ? (
            <Link href="/login" onClick={() => setMenuOpen(false)}
              className="py-2.5 text-center rounded-lg text-sm no-underline"
              style={{ color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.3)' }}>
              Connexion
            </Link>
          ) : (
            <form action={logoutAction}>
              <button type="submit" className="w-full py-2.5 text-sm rounded-lg"
                style={{ color: 'rgba(255,150,150,0.9)', border: '1px solid rgba(255,255,255,0.2)' }}>
                🚪 Déconnexion
              </button>
            </form>
          )}
        </div>
      )}
    </nav>
  )
}

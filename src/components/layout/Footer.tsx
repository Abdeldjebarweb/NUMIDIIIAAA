// src/components/layout/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#0a1f10', color: 'rgba(255,255,255,0.7)' }}>
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-white font-semibold mb-4">☪ AEAB</h4>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Solidarité, entraide et accompagnement pour tous les étudiants algériens à Bordeaux depuis 2020.
            </p>
            <div className="flex gap-1.5 mt-4">
              <div className="w-6 h-3 rounded-sm" style={{ background: '#006233' }} />
              <div className="w-6 h-3 rounded-sm bg-white" />
              <div className="w-6 h-3 rounded-sm" style={{ background: '#D21034' }} />
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            {[
              { href: '/adhesion', label: 'Adhésion' },
              { href: '/evenements', label: 'Événements' },
              { href: '/actualites', label: 'Actualités' },
              { href: '/guide', label: 'Guide étudiant' },
              { href: '/galerie', label: 'Galerie' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="block text-sm mb-2 no-underline transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.6)' }}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Agir</h4>
            {[
              { href: '/don', label: '💚 Faire un don' },
              { href: '/aide', label: 'Demander de l\'aide' },
              { href: '/contact', label: 'Nous contacter' },
              { href: '/partenaires', label: 'Partenaires' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="block text-sm mb-2 no-underline transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.6)' }}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <a href="mailto:contact@aeab.fr"
              className="block text-sm mb-2 no-underline hover:text-white transition-colors"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              📧 contact@aeab.fr
            </a>
            <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>📍 Bordeaux, Gironde</p>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
              🕐 Mer 14h-17h · Ven 10h-12h
            </p>
            <div className="flex gap-2">
              <a href="#" className="text-xs px-3 py-1.5 rounded-full no-underline transition-all hover:bg-white/10"
                style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>
                Instagram
              </a>
              <a href="#" className="text-xs px-3 py-1.5 rounded-full no-underline transition-all hover:bg-white/10"
                style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>
                Facebook
              </a>
            </div>
          </div>
        </div>
        <div className="border-t pt-6 flex flex-wrap items-center justify-between gap-3"
          style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            © 2026 AEAB – Association loi 1901. Tous droits réservés.
          </span>
          <div className="flex gap-4">
            {[
              { href: '/mentions-legales', label: 'Mentions légales' },
              { href: '/confidentialite', label: 'Confidentialité' },
              { href: '/cgv', label: 'CGV' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="text-xs no-underline hover:text-white transition-colors"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

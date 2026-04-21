// src/app/partenaires/page.tsx
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = { title: 'Partenaires' }

const PARTENAIRES = [
  { nom: 'Université de Bordeaux', type: 'Académique', description: 'Convention d\'accueil pour les étudiants algériens nouvellement arrivés.', emoji: '🎓' },
  { nom: 'CROUS Bordeaux', type: 'Logement & Aides', description: 'Partenariat pour l\'accès au logement étudiant et aux aides sociales.', emoji: '🏠' },
  { nom: 'CAF Gironde', type: 'Aides financières', description: 'Accompagnement dans les démarches pour les APL et autres aides.', emoji: '💰' },
  { nom: 'Préfecture de la Gironde', type: 'Administratif', description: 'Collaboration pour simplifier les démarches titre de séjour.', emoji: '📋' },
  { nom: 'Banque Populaire Aquitaine', type: 'Financier', description: 'Offres bancaires préférentielles pour les étudiants membres de l\'AEAB.', emoji: '🏦' },
  { nom: 'Secours Populaire Bordeaux', type: 'Solidarité', description: 'Aide alimentaire d\'urgence pour les étudiants en difficulté.', emoji: '🤝' },
]

export default function PartenairesPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="py-10 px-6" style={{ background: 'var(--green)', color: '#fff' }}>
          <div className="max-w-6xl mx-auto">
            <h1 className="font-playfair text-4xl mb-2">Nos partenaires</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Les organisations qui nous aident à aider les étudiants</p>
          </div>
        </div>
        <div className="section">
          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {PARTENAIRES.map(p => (
              <div key={p.nom} className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
                <div className="text-4xl mb-4">{p.emoji}</div>
                <span className="badge-green text-xs mb-3 inline-block">{p.type}</span>
                <h3 className="font-semibold text-base mb-2">{p.nom}</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{p.description}</p>
              </div>
            ))}
          </div>

          {/* Devenir partenaire */}
          <div className="text-center py-12 px-6 rounded-2xl" style={{ background: 'var(--green-light)' }}>
            <h2 className="font-playfair text-2xl mb-3" style={{ color: 'var(--green)' }}>Devenir partenaire de l'AEAB</h2>
            <p className="mb-6" style={{ color: 'var(--green-mid)', maxWidth: 500, margin: '0 auto 1.5rem' }}>
              Vous souhaitez soutenir les étudiants algériens à Bordeaux ? Contactez-nous pour discuter d'un partenariat.
            </p>
            <Link href="/contact" className="btn-primary no-underline px-6 py-3 rounded-full">
              Nous contacter
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

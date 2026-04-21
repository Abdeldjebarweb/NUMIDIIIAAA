// src/app/don/merci/page.tsx
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export const metadata = { title: 'Merci pour votre don !' }

export default function DonMerciPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
          <div className="text-center max-w-md">
            <div className="text-7xl mb-6">💚</div>
            <h1 className="font-playfair text-3xl mb-3">Merci infiniment !</h1>
            <p className="text-lg mb-2" style={{ color: 'var(--text-muted)' }}>
              Votre don a bien été reçu.
            </p>
            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
              Un reçu fiscal vous sera envoyé par email sous 48h. Grâce à vous, nous pouvons continuer à aider les étudiants algériens à Bordeaux.
            </p>
            <div className="p-4 rounded-xl mb-6" style={{ background: 'var(--green-light)' }}>
              <p className="text-sm" style={{ color: 'var(--green)' }}>
                🤝 Vous pouvez également rejoindre l'AEAB en tant que membre pour vous impliquer directement dans nos actions.
              </p>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/" className="btn-primary no-underline px-6 py-3 rounded-full">Retour à l'accueil</Link>
              <Link href="/adhesion" className="no-underline px-6 py-3 rounded-full font-semibold text-sm"
                style={{ background: '#fff', border: '1px solid var(--border)' }}>
                Devenir membre
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

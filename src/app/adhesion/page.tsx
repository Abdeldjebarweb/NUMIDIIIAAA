// src/app/adhesion/page.tsx  — SERVER COMPONENT (pas de 'use client')
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AdhesionClient from './AdhesionClient'

export const metadata = { title: 'Rejoindre l\'AEAB' }

export default function AdhesionPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="py-10 px-6" style={{ background: 'var(--green)', color: '#fff' }}>
          <div className="max-w-6xl mx-auto">
            <h1 className="font-playfair text-4xl mb-2">Rejoindre l'AEAB</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Adhésion gratuite pour tous les étudiants algériens à Bordeaux</p>
          </div>
        </div>
        <AdhesionClient />
      </main>
      <Footer />
    </>
  )
}

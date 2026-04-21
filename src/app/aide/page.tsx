// src/app/aide/page.tsx — SERVER COMPONENT
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AideClient from './AideClient'

export const metadata = { title: 'Demander de l\'aide' }

export default function AidePage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="py-10 px-6" style={{ background: 'var(--red)', color: '#fff' }}>
          <div className="max-w-6xl mx-auto">
            <h1 className="font-playfair text-4xl mb-2">Demander de l'aide</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)' }}>En toute confidentialité — nous sommes là pour vous</p>
          </div>
        </div>
        <AideClient />
      </main>
      <Footer />
    </>
  )
}

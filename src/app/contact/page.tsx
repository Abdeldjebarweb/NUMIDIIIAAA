// src/app/contact/page.tsx — SERVER COMPONENT
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ContactClient from './ContactClient'

export const metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="py-10 px-6" style={{ background: 'var(--green)', color: '#fff' }}>
          <div className="max-w-6xl mx-auto">
            <h1 className="font-playfair text-4xl mb-2">Nous contacter</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Une question ? Nous répondons sous 48h.</p>
          </div>
        </div>
        <ContactClient />
      </main>
      <Footer />
    </>
  )
}

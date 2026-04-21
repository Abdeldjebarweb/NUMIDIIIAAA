// src/app/don/page.tsx — SERVER COMPONENT
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DonClient from './DonClient'

export const metadata = { title: 'Faire un don' }

export default function DonPage() {
  return (
    <>
      <Navbar />
      <main>
        <DonClient />
      </main>
      <Footer />
    </>
  )
}

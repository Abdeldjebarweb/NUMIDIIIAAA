// src/app/mentions-legales/page.tsx
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = { title: 'Mentions légales' }

export default function MentionsLegalesPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="py-10 px-6" style={{ background: 'var(--green)', color: '#fff' }}>
          <div className="max-w-3xl mx-auto">
            <h1 className="font-playfair text-4xl">Mentions légales</h1>
          </div>
        </div>
        <div className="section max-w-3xl">
          <div className="bg-white rounded-2xl p-8 space-y-6" style={{ border: '1px solid var(--border)' }}>
            {[
              {
                titre: '1. Informations légales',
                contenu: `Association des Étudiants Algériens à Bordeaux (AEAB)
Association loi 1901 — déclarée en préfecture de la Gironde
Siège social : Bordeaux (33), France
Email : contact@aeab.fr`
              },
              {
                titre: '2. Hébergement',
                contenu: `Le site est hébergé par Vercel Inc.
440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
vercel.com`
              },
              {
                titre: '3. Propriété intellectuelle',
                contenu: `L'ensemble du contenu de ce site (textes, images, logos) est la propriété exclusive de l'AEAB. Toute reproduction ou utilisation sans autorisation préalable est interdite.`
              },
              {
                titre: '4. Responsabilité',
                contenu: `L'AEAB s'efforce de fournir des informations exactes et à jour mais ne peut garantir l'exactitude absolue des informations publiées.`
              },
              {
                titre: '5. Contact',
                contenu: `Pour toute question : contact@aeab.fr`
              },
            ].map(section => (
              <div key={section.titre}>
                <h2 className="font-playfair text-xl mb-3" style={{ color: 'var(--green)' }}>{section.titre}</h2>
                <p className="text-sm whitespace-pre-line" style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>{section.contenu}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

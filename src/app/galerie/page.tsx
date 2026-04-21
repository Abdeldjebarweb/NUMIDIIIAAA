// src/app/galerie/page.tsx
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = { title: 'Galerie' }

const PLACEHOLDER_PHOTOS = [
  { titre: 'Soirée Yennayer 2025', date: 'Janvier 2025', emoji: '🌙' },
  { titre: 'Tournoi de foot 2025', date: 'Mai 2025', emoji: '⚽' },
  { titre: 'Pique-nique interculturel', date: 'Juin 2025', emoji: '🌳' },
  { titre: 'Atelier CV & Entretien', date: 'Mars 2025', emoji: '💼' },
  { titre: 'Fête de l\'Aïd', date: 'Avril 2025', emoji: '🌙' },
  { titre: 'Assemblée générale 2025', date: 'Octobre 2025', emoji: '🤝' },
]

export default function GaleriePage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="py-10 px-6" style={{ background: 'var(--green)', color: '#fff' }}>
          <div className="max-w-6xl mx-auto">
            <h1 className="font-playfair text-4xl mb-2">Galerie</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Les moments forts de l'AEAB en images</p>
          </div>
        </div>
        <div className="section">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PLACEHOLDER_PHOTOS.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ border: '1px solid var(--border)' }}>
                <div className="h-48 flex items-center justify-center text-6xl"
                  style={{ background: i % 2 === 0 ? 'var(--green-light)' : '#fdeaed' }}>
                  {p.emoji}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1">{p.titre}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>📅 {p.date}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center p-8 rounded-2xl" style={{ background: 'var(--off-white)', border: '1px dashed var(--border)' }}>
            <div className="text-4xl mb-3">📸</div>
            <h3 className="font-semibold mb-2">Partagez vos photos</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Vous avez des photos d'un événement AEAB ? Envoyez-les à{' '}
              <a href="mailto:contact@aeab.fr" style={{ color: 'var(--green)' }}>contact@aeab.fr</a>{' '}
              pour qu'elles apparaissent ici.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

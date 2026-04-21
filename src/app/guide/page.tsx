// src/app/guide/page.tsx
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = { title: 'Guide de l\'étudiant' }

const SECTIONS = [
  {
    id: 'visa', emoji: '🛂', titre: 'Visa & titre de séjour',
    alerte: '⚠️ Renouvelez votre titre de séjour 2 mois avant expiration !',
    contenu: [
      'Valider votre visa sur <strong>administration-etrangers-en-france.interieur.gouv.fr</strong> dans les 3 mois suivant l\'arrivée.',
      'Passer la visite médicale OFII (convocation envoyée par courrier).',
      'Renouveler le titre de séjour chaque année à la préfecture de Bordeaux.',
      'Documents : passeport, photos, justificatif logement, justificatif scolarité, attestation assurance maladie.',
    ],
  },
  {
    id: 'logement', emoji: '🏠', titre: 'Logement',
    alerte: null,
    contenu: [
      '<strong>CROUS Bordeaux</strong> : résidences universitaires, demande via <em>messervices.etudiant.gouv.fr</em>.',
      '<strong>Colocation</strong> : LeBonCoin, Facebook Marketplace, groupes AEAB.',
      '<strong>Garantie Visale</strong> : caution gratuite de l\'État, obligatoire pour certains bailleurs.',
      'L\'AEAB dispose d\'une liste de propriétaires accueillants — contactez-nous.',
    ],
  },
  {
    id: 'secu', emoji: '🏥', titre: 'Sécurité sociale',
    alerte: null,
    contenu: [
      'Affiliation automatique via votre inscription universitaire depuis 2018.',
      'Ouvrir un compte sur <strong>ameli.fr</strong> pour accéder à vos remboursements.',
      'Télécharger la carte Vitale via l\'application Ameli.',
      'Complémentaire santé recommandée : LMDE, HEYME ou autre mutuelle étudiante.',
    ],
  },
  {
    id: 'caf', emoji: '💰', titre: 'CAF & aides financières',
    alerte: null,
    contenu: [
      'Faire la demande d\'APL sur <strong>caf.fr</strong> dès l\'entrée dans le logement.',
      'Aide moyenne : 150 à 300€/mois selon votre loyer.',
      'Bourse CROUS disponible sous conditions de ressources parentales.',
      'Aide d\'urgence CVEC disponible auprès du CROUS.',
    ],
  },
  {
    id: 'banque', emoji: '🏦', titre: 'Compte bancaire',
    alerte: null,
    contenu: [
      '<strong>BNP Paribas, Société Générale</strong> : comptes étudiants classiques avec CB gratuite.',
      '<strong>Revolut, Lydia</strong> : solutions numériques rapides, sans frais, idéales en attendant.',
      'Le compte bancaire est indispensable pour la CAF et les virements de bourse.',
      'Apportez : passeport, justificatif de domicile, certificat de scolarité.',
    ],
  },
  {
    id: 'transport', emoji: '🚌', titre: 'Transports à Bordeaux',
    alerte: null,
    contenu: [
      '<strong>TBM</strong> (tramway + bus) : abonnement étudiant à tarif réduit.',
      'Carte TBM Jeunes : environ 30€/mois pour un accès illimité.',
      'Vélos en libre-service : <strong>V3</strong> disponibles dans toute la ville.',
      'SNCF : carte Avantage Jeunes pour les trajets interrégionaux.',
    ],
  },
]

export default function GuidePage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="py-10 px-6" style={{ background: 'var(--green)', color: '#fff' }}>
          <div className="max-w-6xl mx-auto">
            <h1 className="font-playfair text-4xl mb-2">Guide de l'étudiant</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Toutes les infos essentielles pour bien s'installer à Bordeaux</p>
          </div>
        </div>
        <div className="section">
          <div className="flex gap-8 items-start flex-wrap lg:flex-nowrap">
            {/* Sommaire */}
            <div className="w-full lg:w-56 flex-shrink-0">
              <div className="bg-white rounded-2xl p-5 sticky top-20" style={{ border: '1px solid var(--border)' }}>
                <h4 className="font-semibold text-sm mb-3">📋 Sommaire</h4>
                {SECTIONS.map(s => (
                  <a key={s.id} href={`#${s.id}`}
                    className="flex items-center gap-2 py-2 text-sm no-underline border-b last:border-0 transition-colors hover:text-green"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                    <span>{s.emoji}</span> {s.titre}
                  </a>
                ))}
              </div>
            </div>

            {/* Contenu */}
            <div className="flex-1 space-y-6">
              {SECTIONS.map(s => (
                <div key={s.id} id={s.id} className="bg-white rounded-2xl p-7" style={{ border: '1px solid var(--border)' }}>
                  <h2 className="font-playfair text-2xl mb-4" style={{ color: 'var(--green)' }}>
                    {s.emoji} {s.titre}
                  </h2>
                  {s.alerte && (
                    <div className="p-3 rounded-lg mb-4 text-sm" style={{ background: 'var(--red-light)', color: 'var(--red)' }}>
                      {s.alerte}
                    </div>
                  )}
                  <ul className="space-y-2">
                    {s.contenu.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                        <span className="mt-0.5 flex-shrink-0" style={{ color: 'var(--green)' }}>•</span>
                        <span dangerouslySetInnerHTML={{ __html: item }} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="bg-white rounded-2xl p-7" style={{ border: '1px solid var(--border)' }}>
                <h2 className="font-playfair text-2xl mb-4" style={{ color: 'var(--green)' }}>📞 Contacts utiles</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { label: 'AEAB', val: 'contact@aeab.fr' },
                    { label: 'Préfecture Bordeaux', val: 'pref-etranger@gironde.gouv.fr' },
                    { label: 'CROUS Bordeaux', val: 'crous-bordeaux.fr' },
                    { label: 'CAF Gironde', val: 'caf.fr → Bordeaux' },
                    { label: 'CPAM Bordeaux', val: 'ameli.fr' },
                    { label: 'OFII Bordeaux', val: 'ofii.fr' },
                  ].map(c => (
                    <div key={c.label} className="p-3 rounded-lg" style={{ background: 'var(--off-white)', border: '1px solid var(--border)' }}>
                      <div className="font-semibold text-sm">{c.label}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

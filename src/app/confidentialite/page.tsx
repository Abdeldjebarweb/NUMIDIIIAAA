// src/app/confidentialite/page.tsx
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata = { title: 'Politique de confidentialité' }

export default function ConfidentialitePage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="py-10 px-6" style={{ background: 'var(--green)', color: '#fff' }}>
          <div className="max-w-3xl mx-auto">
            <h1 className="font-playfair text-4xl">Politique de confidentialité</h1>
            <p className="mt-2" style={{ color: 'rgba(255,255,255,0.8)' }}>Conformément au RGPD — Règlement Général sur la Protection des Données</p>
          </div>
        </div>
        <div className="section max-w-3xl">
          <div className="bg-white rounded-2xl p-8 space-y-6" style={{ border: '1px solid var(--border)' }}>
            {[
              {
                titre: '1. Responsable du traitement',
                contenu: 'L\'AEAB (Association des Étudiants Algériens à Bordeaux) est responsable du traitement de vos données personnelles. Contact : contact@aeab.fr'
              },
              {
                titre: '2. Données collectées',
                contenu: `Nous collectons les données suivantes :
• Données d'identification : nom, prénom, email, téléphone
• Données académiques : établissement, filière, niveau d'études
• Données de navigation : adresse IP, cookies de session (Supabase Auth)
• Données de paiement : montant du don (traitées par Stripe — jamais stockées directement)`
              },
              {
                titre: '3. Finalités du traitement',
                contenu: `Vos données sont utilisées pour :
• Gérer votre adhésion à l'association
• Traiter vos inscriptions aux événements
• Répondre à vos demandes d'aide
• Vous envoyer des notifications liées à votre compte
• Traiter les dons (via Stripe)
• Statistiques anonymisées sur l'activité de l'association`
              },
              {
                titre: '4. Conservation des données',
                contenu: 'Vos données sont conservées pendant la durée de votre adhésion, puis 3 ans après votre départ pour des obligations légales. Les données de dons sont conservées 10 ans (obligations comptables).'
              },
              {
                titre: '5. Vos droits',
                contenu: `Conformément au RGPD, vous disposez des droits suivants :
• Droit d'accès à vos données
• Droit de rectification
• Droit à l'effacement ("droit à l'oubli")
• Droit à la portabilité
• Droit d'opposition

Pour exercer ces droits : contact@aeab.fr`
              },
              {
                titre: '6. Sécurité',
                contenu: 'Vos données sont stockées de façon sécurisée sur Supabase (infrastructure chiffrée). Les paiements sont traités par Stripe (certifié PCI DSS). Aucune donnée bancaire n\'est stockée par l\'AEAB.'
              },
              {
                titre: '7. Cookies',
                contenu: 'Nous utilisons uniquement des cookies strictement nécessaires au fonctionnement du site (session d\'authentification). Aucun cookie publicitaire ou de tracking tiers.'
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

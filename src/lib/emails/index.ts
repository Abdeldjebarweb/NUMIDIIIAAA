// src/lib/emails/index.ts
// Service email avec Resend — toutes les notifications transactionnelles

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM ?? 'AEAB <contact@aeab.fr>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aeab.fr'

// ─── Templates HTML inline (pas de dépendance react-email nécessaire) ───────

function baseTemplate(content: string, titre: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f3ef;font-family:'DM Sans',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden">
        <!-- Header -->
        <tr><td style="background:#006233;padding:24px 32px;text-align:center">
          <p style="margin:0;color:#fff;font-size:28px">☪</p>
          <h1 style="margin:4px 0 0;color:#fff;font-size:20px;font-weight:700">AEAB</h1>
          <p style="margin:2px 0 0;color:rgba(255,255,255,0.7);font-size:12px">Étudiants Algériens à Bordeaux</p>
        </td></tr>
        <!-- Titre -->
        <tr><td style="padding:32px 32px 0;border-top:3px solid #D21034">
          <h2 style="margin:0;font-size:22px;color:#1a1a1a">${titre}</h2>
        </td></tr>
        <!-- Contenu -->
        <tr><td style="padding:20px 32px 32px">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f4f3ef;padding:20px 32px;text-align:center">
          <p style="margin:0;font-size:11px;color:#6b6b6b">
            © 2026 AEAB · Association loi 1901 · Bordeaux, France<br>
            <a href="${APP_URL}/confidentialite" style="color:#006233">Politique de confidentialité</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── Emails individuels ───────────────────────────────────────────────────────

/**
 * Email de confirmation d'adhésion reçue
 */
export async function sendConfirmationAdhesion(to: string, prenom: string) {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: '🎉 Votre demande d\'adhésion à l\'AEAB a bien été reçue',
      html: baseTemplate(`
        <p style="color:#6b6b6b;line-height:1.7">Bonjour <strong>${prenom}</strong>,</p>
        <p style="color:#6b6b6b;line-height:1.7">
          Nous avons bien reçu votre demande d'adhésion à l'AEAB.
          Un membre du bureau va l'examiner et vous contacter sous <strong>48h</strong>.
        </p>
        <div style="background:#e8f5ee;border-radius:12px;padding:20px;margin:20px 0">
          <p style="margin:0;color:#006233;font-weight:600">⏳ Statut : En attente de validation</p>
        </div>
        <p style="color:#6b6b6b;line-height:1.7">
          En attendant, n'hésitez pas à consulter notre 
          <a href="${APP_URL}/guide" style="color:#006233">guide de l'étudiant</a>
          ou à rejoindre nos <a href="${APP_URL}/evenements" style="color:#006233">prochains événements</a>.
        </p>
        <p style="color:#6b6b6b">À très bientôt,<br><strong>L'équipe AEAB</strong></p>
      `, 'Demande d\'adhésion reçue !'),
    })
  } catch (err) {
    console.error('[EMAIL] sendConfirmationAdhesion:', err)
  }
}

/**
 * Email de validation de l'adhésion (approuvée)
 */
export async function sendAdhesionApprouvee(to: string, prenom: string) {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: '✅ Bienvenue dans l\'AEAB ! Votre adhésion est confirmée',
      html: baseTemplate(`
        <p style="color:#6b6b6b;line-height:1.7">Bonjour <strong>${prenom}</strong>,</p>
        <p style="color:#6b6b6b;line-height:1.7">
          Excellente nouvelle ! Votre adhésion à l'AEAB a été <strong>approuvée</strong>.
          Vous faites maintenant officiellement partie de notre communauté.
        </p>
        <div style="background:#e8f5ee;border-radius:12px;padding:20px;margin:20px 0">
          <p style="margin:0 0 8px;color:#006233;font-weight:700;font-size:16px">✅ Membre actif</p>
          <ul style="margin:0;padding-left:20px;color:#2d8a5e">
            <li>Accès gratuit à tous les événements membres</li>
            <li>Aide administrative prioritaire</li>
            <li>Réseau d'entraide et mentorat</li>
          </ul>
        </div>
        <div style="text-align:center;margin:24px 0">
          <a href="${APP_URL}/profil" style="background:#006233;color:#fff;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px">
            Accéder à mon espace membre →
          </a>
        </div>
        <p style="color:#6b6b6b">Solidairement,<br><strong>L'équipe AEAB</strong></p>
      `, 'Bienvenue dans l\'AEAB !'),
    })
  } catch (err) {
    console.error('[EMAIL] sendAdhesionApprouvee:', err)
  }
}

/**
 * Email de confirmation d'inscription à un événement
 */
export async function sendConfirmationInscription(
  to: string,
  prenom: string,
  titreEvenement: string,
  dateEvenement: string,
  lieuEvenement: string
) {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `🎟 Inscription confirmée : ${titreEvenement}`,
      html: baseTemplate(`
        <p style="color:#6b6b6b;line-height:1.7">Bonjour <strong>${prenom}</strong>,</p>
        <p style="color:#6b6b6b;line-height:1.7">
          Votre inscription à l'événement suivant est confirmée :
        </p>
        <div style="background:#e8f5ee;border-radius:12px;padding:20px;margin:20px 0">
          <h3 style="margin:0 0 12px;color:#006233">${titreEvenement}</h3>
          <p style="margin:4px 0;color:#2d8a5e;font-size:14px">📅 ${dateEvenement}</p>
          <p style="margin:4px 0;color:#2d8a5e;font-size:14px">📍 ${lieuEvenement}</p>
        </div>
        <p style="color:#6b6b6b;line-height:1.7;font-size:14px">
          Vous pouvez annuler votre inscription depuis votre 
          <a href="${APP_URL}/mes-inscriptions" style="color:#006233">espace membre</a>.
        </p>
        <p style="color:#6b6b6b">À bientôt,<br><strong>L'équipe AEAB</strong></p>
      `, `Inscription confirmée : ${titreEvenement}`),
    })
  } catch (err) {
    console.error('[EMAIL] sendConfirmationInscription:', err)
  }
}

/**
 * Email de confirmation de don avec reçu fiscal
 */
export async function sendConfirmationDon(
  to: string,
  nom: string,
  montant: number,
  donId: string
) {
  const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `💚 Merci pour votre don de ${montant}€ à l'AEAB`,
      html: baseTemplate(`
        <p style="color:#6b6b6b;line-height:1.7">Bonjour <strong>${nom}</strong>,</p>
        <p style="color:#6b6b6b;line-height:1.7">
          Merci infiniment pour votre don à l'AEAB ! Votre générosité nous permet de continuer
          à aider les étudiants algériens à Bordeaux.
        </p>
        <div style="border:2px solid #006233;border-radius:12px;padding:20px;margin:20px 0">
          <p style="margin:0 0 4px;color:#6b6b6b;font-size:12px;text-transform:uppercase">Reçu de don</p>
          <p style="margin:0;font-size:28px;font-weight:700;color:#006233">${montant} €</p>
          <p style="margin:4px 0 0;color:#6b6b6b;font-size:13px">
            AEAB · Association loi 1901 · ${date}<br>
            Référence : ${donId.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <p style="color:#6b6b6b;line-height:1.7;font-size:13px">
          Ce reçu peut être utilisé à titre de justificatif. Pour un reçu fiscal officiel 
          en vue d'une déduction fiscale, contactez-nous à <a href="mailto:contact@aeab.fr" style="color:#006233">contact@aeab.fr</a>.
        </p>
        <p style="color:#6b6b6b">Avec toute notre gratitude,<br><strong>L'équipe AEAB</strong></p>
      `, `Merci pour votre don de ${montant}€`),
    })
  } catch (err) {
    console.error('[EMAIL] sendConfirmationDon:', err)
  }
}

/**
 * Notification admin — nouvelle demande d'aide urgente
 */
export async function sendAlertDemandeUrgente(
  prenom: string,
  nom: string,
  typeAide: string,
  urgence: string,
  email: string
) {
  const adminEmail = process.env.EMAIL_FROM ?? 'contact@aeab.fr'
  try {
    await resend.emails.send({
      from: FROM,
      to: adminEmail,
      subject: `🚨 Demande urgente : ${typeAide} — ${prenom} ${nom}`,
      html: baseTemplate(`
        <div style="background:#fdeaed;border:2px solid #D21034;border-radius:12px;padding:20px;margin-bottom:20px">
          <p style="margin:0;color:#D21034;font-weight:700;font-size:16px">
            🚨 ${urgence === 'tres_urgent' ? 'TRÈS URGENTE' : 'URGENTE'} — À traiter immédiatement
          </p>
        </div>
        <table style="width:100%;border-collapse:collapse">
          ${[
            ['Étudiant', `${prenom} ${nom}`],
            ['Email', email],
            ['Type d\'aide', typeAide],
            ['Urgence', urgence],
          ].map(([k, v]) => `
            <tr>
              <td style="padding:8px;background:#f4f3ef;font-weight:600;font-size:13px;width:40%">${k}</td>
              <td style="padding:8px;font-size:13px">${v}</td>
            </tr>
          `).join('')}
        </table>
        <div style="text-align:center;margin:24px 0">
          <a href="${APP_URL}/admin/demandes" style="background:#D21034;color:#fff;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px">
            Traiter cette demande →
          </a>
        </div>
      `, 'Nouvelle demande d\'aide urgente'),
    })
  } catch (err) {
    console.error('[EMAIL] sendAlertDemandeUrgente:', err)
  }
}

/**
 * Notification admin — nouvelle adhésion
 */
export async function sendAlertNouvelleAdhesion(prenom: string, nom: string, etablissement: string) {
  const adminEmail = process.env.EMAIL_FROM ?? 'contact@aeab.fr'
  try {
    await resend.emails.send({
      from: FROM,
      to: adminEmail,
      subject: `👤 Nouvelle adhésion : ${prenom} ${nom}`,
      html: baseTemplate(`
        <p style="color:#6b6b6b;line-height:1.7">
          Une nouvelle demande d'adhésion vient d'être soumise :
        </p>
        <div style="background:#e8f5ee;border-radius:12px;padding:20px;margin:20px 0">
          <p style="margin:0;font-weight:700;color:#006233;font-size:16px">${prenom} ${nom}</p>
          <p style="margin:4px 0 0;color:#2d8a5e;font-size:14px">${etablissement}</p>
        </div>
        <div style="text-align:center;margin:24px 0">
          <a href="${APP_URL}/admin/membres" style="background:#006233;color:#fff;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:600;font-size:14px">
            Valider l'adhésion →
          </a>
        </div>
      `, 'Nouvelle demande d\'adhésion'),
    })
  } catch (err) {
    console.error('[EMAIL] sendAlertNouvelleAdhesion:', err)
  }
}

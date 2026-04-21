# 🇩🇿 AEAB – Association des Étudiants Algériens à Bordeaux
### Stack : Next.js 14 · Supabase · Stripe · Resend · TypeScript · Tailwind

---

## 📁 Structure du projet

```
aeab/
├── src/
│   ├── app/
│   │   ├── page.tsx                    ← Accueil (Server Component)
│   │   ├── login/page.tsx              ← Connexion
│   │   ├── register/page.tsx           ← Inscription
│   │   ├── adhesion/page.tsx           ← Formulaire adhésion
│   │   ├── evenements/
│   │   │   ├── page.tsx                ← Liste événements (SSR)
│   │   │   └── EvenementsClient.tsx    ← Filtres + modal (Client)
│   │   ├── don/page.tsx                ← Page don Stripe
│   │   ├── aide/page.tsx               ← Demande d'aide
│   │   ├── contact/page.tsx            ← Contact
│   │   ├── actualites/page.tsx         ← Actualités
│   │   ├── guide/page.tsx              ← Guide étudiant
│   │   ├── admin/
│   │   │   ├── page.tsx                ← Dashboard admin
│   │   │   ├── membres/page.tsx        ← Gestion membres
│   │   │   ├── evenements/page.tsx     ← Gestion événements
│   │   │   ├── demandes/page.tsx       ← Demandes d'aide
│   │   │   ├── actualites/page.tsx     ← Gestion articles
│   │   │   └── dons/page.tsx           ← Gestion dons
│   │   ├── auth/callback/route.ts      ← OAuth callback
│   │   └── api/webhooks/stripe/route.ts ← Webhook Stripe
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx              ← Navigation (Server)
│   │   │   ├── NavbarClient.tsx        ← Navigation (Client, menu)
│   │   │   └── Footer.tsx
│   │   ├── forms/                      ← Composants formulaires réutilisables
│   │   ├── ui/                         ← Boutons, badges, cards
│   │   └── admin/                      ← Composants admin
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts               ← Client navigateur
│   │   │   └── server.ts               ← Client serveur + admin
│   │   └── actions/
│   │       ├── auth.ts                 ← Login, register, logout
│   │       ├── formulaires.ts          ← Adhésion, aide, contact, inscriptions
│   │       ├── admin.ts                ← Actions admin
│   │       └── paiement.ts             ← Stripe checkout
│   ├── middleware.ts                   ← Protection des routes
│   └── types/
│       └── database.ts                 ← Types TypeScript Supabase
├── supabase/
│   └── migrations/
│       └── 001_schema_complet.sql      ← Schéma BD complet
├── .env.example                        ← Template variables d'environnement
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

---

## 🚀 Installation

### 1. Cloner et installer

```bash
git clone https://github.com/votre-org/aeab.git
cd aeab
npm install
```

### 2. Configurer Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans **SQL Editor**
3. Copier-coller et exécuter le contenu de `supabase/migrations/001_schema_complet.sql`
4. Aller dans **Settings > API** et copier :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configurer Stripe

1. Créer un compte sur [stripe.com](https://stripe.com)
2. Aller dans **Developers > API Keys**
3. Copier les clés dans `.env.local`
4. Pour le webhook local : `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### 4. Configurer Resend (emails)

1. Créer un compte sur [resend.com](https://resend.com)
2. Vérifier votre domaine (`aeab.fr`)
3. Créer une clé API → `RESEND_API_KEY`

### 5. Variables d'environnement

```bash
cp .env.example .env.local
# Remplir toutes les valeurs dans .env.local
```

### 6. Lancer en développement

```bash
npm run dev
# → http://localhost:3000
```

---

## 🗄️ Base de données Supabase

### Tables principales

| Table | Description |
|-------|-------------|
| `profiles` | Profils liés à `auth.users` |
| `adhesions` | Demandes d'adhésion |
| `evenements` | Événements de l'association |
| `inscriptions_evenements` | Inscriptions aux événements |
| `actualites` | Articles et actualités |
| `demandes_aide` | Demandes d'aide d'urgence |
| `dons` | Historique des dons (Stripe) |
| `contacts` | Messages de contact |
| `notifications` | Notifications in-app |

### Vue admin
```sql
-- Statistiques dashboard en une seule requête
SELECT * FROM stats_dashboard;
```

### Row Level Security (RLS)
Toutes les tables ont RLS activé. La logique :
- **Public** : lire événements/actualités publiés, créer contacts/dons
- **Membre** : voir ses inscriptions, modifier son profil
- **Admin/Bureau** : tout gérer

---

## 🔐 Authentification

### Rôles utilisateurs
- `admin` – accès complet
- `bureau` – gestion membres, événements, demandes
- `membre` – accès espace membre, inscriptions
- `invite` – compte créé, pas encore validé

### Promouvoir un admin
```sql
-- Dans Supabase SQL Editor
UPDATE profiles SET role = 'admin' WHERE email = 'votre@email.fr';
```

### Routes protégées (middleware)
- `/admin/*` → admin/bureau uniquement
- `/profil`, `/mes-inscriptions` → connecté requis
- `/login`, `/register` → redirige si déjà connecté

---

## 💳 Paiements Stripe

### Flux don
1. Utilisateur choisit un montant sur `/don`
2. Server Action `creerSessionDon()` → crée session Stripe Checkout
3. Redirection vers Stripe (hébergé, sécurisé)
4. Après paiement → redirect vers `/don/merci`
5. Webhook Stripe → met à jour statut en `complete` dans Supabase

### Configuration webhook
```bash
# Développement
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Production (Stripe Dashboard)
# URL : https://aeab.fr/api/webhooks/stripe
# Events : checkout.session.completed, payment_intent.payment_failed, charge.refunded
```

---

## 📧 Emails transactionnels (Resend)

Emails à implémenter dans `src/lib/emails/` :
- Confirmation d'adhésion
- Confirmation d'inscription événement
- Reçu fiscal don
- Alerte admin nouvelle demande urgente
- Réinitialisation mot de passe (géré par Supabase)

---

## 🚀 Déploiement Vercel

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Déployer
vercel

# 3. Configurer les variables d'environnement dans Vercel Dashboard
# Settings > Environment Variables → copier depuis .env.local

# 4. Domaine personnalisé
# Settings > Domains → ajouter aeab.fr
```

### Variables requises sur Vercel
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
EMAIL_FROM
NEXT_PUBLIC_APP_URL
```

---

## 🛡️ Sécurité

- ✅ **RLS Supabase** – policies par rôle sur toutes les tables
- ✅ **Middleware Next.js** – protection des routes
- ✅ **Stripe** – paiements hébergés (pas de données CB sur nos serveurs)
- ✅ **Validation Zod** – validation côté serveur sur toutes les actions
- ✅ **CSRF** – protégé nativement par Next.js Server Actions
- ✅ **Rate limiting** – à ajouter avec Upstash (optionnel)
- ✅ **Cookies sécurisés** – gérés par `@supabase/ssr`
- ✅ **HTTPS** – obligatoire en production
- ✅ **Headers sécurité** – à configurer dans `next.config.mjs`

---

## 📱 Mobile

Le site est 100% responsive avec :
- Menu hamburger sur mobile
- Grilles adaptatives (CSS Grid auto-fit)
- Formulaires optimisés mobile
- Boutons avec zones de toucher suffisantes

---

## 🤝 Contribution

1. Fork le repo
2. Créer une branche `feature/ma-fonctionnalite`
3. Committer et pousser
4. Ouvrir une Pull Request

---

*Développé avec ❤️ pour la communauté algérienne de Bordeaux*

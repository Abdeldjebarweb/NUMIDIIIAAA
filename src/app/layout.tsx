// src/app/layout.tsx
import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'AEAB – Association des Étudiants Algériens à Bordeaux',
    template: '%s | AEAB',
  },
  description: 'Solidarité, entraide et accompagnement pour chaque étudiant algérien à Bordeaux.',
  keywords: ['AEAB', 'étudiants algériens', 'Bordeaux', 'association', 'aide', 'solidarité'],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://aeab.fr',
    siteName: 'AEAB',
    title: 'AEAB – Association des Étudiants Algériens à Bordeaux',
    description: 'Solidarité, entraide et accompagnement pour chaque étudiant algérien à Bordeaux.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AEAB',
    description: 'Solidarité pour les étudiants algériens à Bordeaux',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-off-white font-dm text-text antialiased">
        {children}
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{
            duration: 4000,
            classNames: {
              toast: 'font-dm',
            },
          }}
        />
      </body>
    </html>
  )
}

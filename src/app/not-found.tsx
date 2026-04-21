// src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--off-white)' }}>
      <div className="text-center">
        <div className="text-6xl mb-4">☪</div>
        <h1 className="font-playfair text-4xl mb-2">Page introuvable</h1>
        <p className="mb-6" style={{ color: 'var(--text-muted)' }}>La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <Link href="/" className="btn-primary no-underline px-6 py-3 rounded-full">← Retour à l'accueil</Link>
      </div>
    </div>
  )
}

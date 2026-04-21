// src/app/actualites/[slug]/page.tsx
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createClient()
  const { data } = await supabase
    .from('actualites')
    .select('titre, extrait')
    .eq('slug', slug)
    .single()
  return { title: (data as any)?.titre ?? 'Article', description: (data as any)?.extrait }
}

export default async function ActualiteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createClient()
  const { data } = await supabase
    .from('actualites')
    .select('*')
    .eq('slug', slug)
    .eq('statut', 'publie')
    .single()

  const article = data as any
  if (!article) notFound()

  return (
    <>
      <Navbar />
      <main>
        <div className="py-10 px-6" style={{ background: 'var(--green)', color: '#fff' }}>
          <div className="max-w-3xl mx-auto">
            <Link href="/actualites" className="text-sm no-underline mb-4 block"
              style={{ color: 'rgba(255,255,255,0.7)' }}>
              ← Toutes les actualités
            </Link>
            <span className="badge-green mb-3 inline-block">{article.categorie}</span>
            <h1 className="font-playfair text-4xl mb-3">{article.titre}</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)' }}>
              📅 {format(new Date(article.created_at), 'd MMMM yyyy', { locale: fr })}
            </p>
          </div>
        </div>
        <div className="section max-w-3xl">
          <div className="bg-white rounded-2xl p-8" style={{ border: '1px solid var(--border)' }}>
            {article.image_url && (
              <div className="relative w-full mb-6" style={{ height: 400 }}>
                <Image
                  src={article.image_url}
                  alt={article.titre}
                  fill
                  className="rounded-xl object-cover"
                />
              </div>
            )}
            <div
              className="prose max-w-none"
              style={{ lineHeight: 1.8, color: 'var(--text)' }}
              dangerouslySetInnerHTML={{ __html: article.contenu }}
            />
          </div>
          <div className="mt-6 text-center">
            <Link href="/actualites" className="btn-primary no-underline px-6 py-3 rounded-full">
              ← Retour aux actualités
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

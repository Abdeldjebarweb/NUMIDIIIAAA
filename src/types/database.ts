// src/types/database.ts
// Types TypeScript générés depuis le schéma Supabase

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          nom: string
          prenom: string
          telephone: string | null
          ville: string | null
          etablissement: string | null
          filiere: string | null
          niveau: string | null
          annee_arrivee: number | null
          role: 'admin' | 'bureau' | 'membre' | 'invite'
          statut: 'actif' | 'en_attente' | 'inactif' | 'suspendu'
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      adhesions: {
        Row: {
          id: string
          profile_id: string | null
          nom: string
          prenom: string
          email: string
          telephone: string | null
          etablissement: string
          filiere: string | null
          niveau: string | null
          annee_arrivee: number | null
          message: string | null
          statut: 'en_attente' | 'approuve' | 'refuse'
          traite_par: string | null
          traite_le: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['adhesions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['adhesions']['Insert']>
      }
      evenements: {
        Row: {
          id: string
          titre: string
          description: string | null
          contenu: string | null
          date_debut: string
          date_fin: string | null
          lieu: string | null
          adresse: string | null
          capacite: number
          prix_membre: number
          prix_non_membre: number
          categorie: 'culture' | 'pro' | 'sport' | 'social' | 'urgence'
          image_url: string | null
          statut: 'brouillon' | 'publie' | 'annule' | 'passe'
          inscriptions_ouvertes: boolean
          cree_par: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['evenements']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['evenements']['Insert']>
      }
      inscriptions_evenements: {
        Row: {
          id: string
          evenement_id: string
          profile_id: string
          nom: string
          prenom: string
          email: string
          nombre_places: number
          statut: 'confirmee' | 'liste_attente' | 'annulee'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['inscriptions_evenements']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['inscriptions_evenements']['Insert']>
      }
      actualites: {
        Row: {
          id: string
          titre: string
          slug: string
          extrait: string | null
          contenu: string
          image_url: string | null
          categorie: 'association' | 'urgent' | 'partenariat' | 'rapport' | 'guide'
          statut: 'brouillon' | 'publie' | 'archive'
          mis_en_avant: boolean
          cree_par: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['actualites']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['actualites']['Insert']>
      }
      demandes_aide: {
        Row: {
          id: string
          profile_id: string | null
          nom: string
          prenom: string
          email: string
          telephone: string | null
          type_aide: 'logement' | 'alimentaire' | 'administratif' | 'sante' | 'psychologique' | 'financier' | 'autre'
          description: string
          urgence: 'normal' | 'urgent' | 'tres_urgent'
          statut: 'en_attente' | 'en_cours' | 'traite' | 'ferme'
          traite_par: string | null
          notes_internes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['demandes_aide']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['demandes_aide']['Insert']>
      }
      dons: {
        Row: {
          id: string
          profile_id: string | null
          nom: string | null
          email: string | null
          montant: number
          devise: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          statut: 'en_attente' | 'complete' | 'echoue' | 'rembourse'
          anonyme: boolean
          recu_envoye: boolean
          message: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['dons']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['dons']['Insert']>
      }
      contacts: {
        Row: {
          id: string
          nom: string
          email: string
          sujet: string | null
          message: string
          statut: 'non_lu' | 'lu' | 'repondu'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['contacts']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['contacts']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          profile_id: string
          titre: string
          message: string
          type: 'info' | 'succes' | 'avertissement' | 'erreur'
          lu: boolean
          lien: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
    }
    Views: {
      stats_dashboard: {
        Row: {
          membres_actifs: number
          adhesions_en_attente: number
          demandes_ouvertes: number
          demandes_urgentes: number
          dons_ce_mois: number
          dons_cette_annee: number
          evenements_a_venir: number
          messages_non_lus: number
        }
      }
    }
    Functions: {}
    Enums: {}
  }
}

// Helpers
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Evenement = Database['public']['Tables']['evenements']['Row']
export type Actualite = Database['public']['Tables']['actualites']['Row']
export type Adhesion = Database['public']['Tables']['adhesions']['Row']
export type DemandeAide = Database['public']['Tables']['demandes_aide']['Row']
export type Don = Database['public']['Tables']['dons']['Row']
export type Contact = Database['public']['Tables']['contacts']['Row']
export type StatsDashboard = Database['public']['Views']['stats_dashboard']['Row']

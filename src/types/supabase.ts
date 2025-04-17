export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string | null
          role: 'user' | 'admin'
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          name?: string | null
          role?: 'user' | 'admin'
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string | null
          role?: 'user' | 'admin'
        }
      }
      // Add other tables as needed
    }
  }
}
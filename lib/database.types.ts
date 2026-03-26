export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          first_name: string
          last_name: string
          subscription_status: 'active' | 'inactive' | 'cancelled'
          subscription_plan: 'monthly' | 'yearly' | null
          subscription_start_date: string | null
          subscription_end_date: string | null
          stripe_customer_id: string | null
          selected_charity_id: string | null
          charity_contribution_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          first_name: string
          last_name: string
          subscription_status?: 'active' | 'inactive' | 'cancelled'
          subscription_plan?: 'monthly' | 'yearly' | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          stripe_customer_id?: string | null
          selected_charity_id?: string | null
          charity_contribution_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          first_name?: string
          last_name?: string
          subscription_status?: 'active' | 'inactive' | 'cancelled'
          subscription_plan?: 'monthly' | 'yearly' | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
          stripe_customer_id?: string | null
          selected_charity_id?: string | null
          charity_contribution_percentage?: number
          created_at?: string
          updated_at?: string
        }
      }
      golf_scores: {
        Row: {
          id: string
          user_id: string
          score: number
          score_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score: number
          score_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          score?: number
          score_date?: string
          created_at?: string
        }
      }
      charities: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string | null
          website_url: string | null
          is_featured: boolean
          upcoming_events: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url?: string | null
          website_url?: string | null
          is_featured?: boolean
          upcoming_events?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string | null
          website_url?: string | null
          is_featured?: boolean
          upcoming_events?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      draws: {
        Row: {
          id: string
          draw_date: string
          draw_type: 'random' | 'algorithmic'
          winning_numbers: number[]
          total_prize_pool: number
          five_match_pool: number
          four_match_pool: number
          three_match_pool: number
          jackpot_rollover: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          draw_date: string
          draw_type: 'random' | 'algorithmic'
          winning_numbers: number[]
          total_prize_pool: number
          five_match_pool: number
          four_match_pool: number
          three_match_pool: number
          jackpot_rollover?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          draw_date?: string
          draw_type?: 'random' | 'algorithmic'
          winning_numbers?: number[]
          total_prize_pool?: number
          five_match_pool?: number
          four_match_pool?: number
          three_match_pool?: number
          jackpot_rollover?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      draw_entries: {
        Row: {
          id: string
          user_id: string
          draw_id: string
          user_numbers: number[]
          matches: number
          prize_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          draw_id: string
          user_numbers: number[]
          matches?: number
          prize_amount?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          draw_id?: string
          user_numbers?: number[]
          matches?: number
          prize_amount?: number
          created_at?: string
        }
      }
      winners: {
        Row: {
          id: string
          user_id: string
          draw_id: string
          match_type: '3-match' | '4-match' | '5-match'
          prize_amount: number
          verification_status: 'pending' | 'approved' | 'rejected'
          payment_status: 'pending' | 'paid'
          proof_screenshot_url: string | null
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          draw_id: string
          match_type: '3-match' | '4-match' | '5-match'
          prize_amount: number
          verification_status?: 'pending' | 'approved' | 'rejected'
          payment_status?: 'pending' | 'paid'
          proof_screenshot_url?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          draw_id?: string
          match_type?: '3-match' | '4-match' | '5-match'
          prize_amount?: number
          verification_status?: 'pending' | 'approved' | 'rejected'
          payment_status?: 'pending' | 'paid'
          proof_screenshot_url?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      charity_contributions: {
        Row: {
          id: string
          user_id: string
          charity_id: string
          amount: number
          contribution_date: string
          subscription_related: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          charity_id: string
          amount: number
          contribution_date: string
          subscription_related?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          charity_id?: string
          amount?: number
          contribution_date?: string
          subscription_related?: boolean
          created_at?: string
        }
      }
    }
  }
}
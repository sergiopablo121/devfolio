export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          avatar_url: string | null;
          name: string | null;
          bio: string | null;
          location: string | null;
          blog: string | null;
          twitter_username: string | null;
          github_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username: string;
          avatar_url?: string | null;
          name?: string | null;
          bio?: string | null;
          location?: string | null;
          blog?: string | null;
          twitter_username?: string | null;
          github_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string;
          avatar_url?: string | null;
          name?: string | null;
          bio?: string | null;
          location?: string | null;
          blog?: string | null;
          twitter_username?: string | null;
          github_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      portfolios: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          theme_color: string;
          accent_color: string;
          show_email: boolean;
          show_location: boolean;
          show_blog: boolean;
          show_twitter: boolean;
          hidden_repos: string[];
          custom_domain: string | null;
          subscription_tier: string;
          subscription_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username: string;
          theme_color?: string;
          accent_color?: string;
          show_email?: boolean;
          show_location?: boolean;
          show_blog?: boolean;
          show_twitter?: boolean;
          hidden_repos?: string[];
          custom_domain?: string | null;
          subscription_tier?: string;
          subscription_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string;
          theme_color?: string;
          accent_color?: string;
          show_email?: boolean;
          show_location?: boolean;
          show_blog?: boolean;
          show_twitter?: boolean;
          hidden_repos?: string[];
          custom_domain?: string | null;
          subscription_tier?: string;
          subscription_status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          tier: string;
          status: string;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tier: string;
          status: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tier?: string;
          status?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

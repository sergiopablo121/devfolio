import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { GitHubAPI } from '@/lib/github';
import type { PortfolioSettings, PortfolioData, GitHubLanguage } from '@/types';

const defaultSettings: PortfolioSettings = {
  user_id: '',
  username: '',
  theme_color: 'blue',
  accent_color: 'indigo',
  show_email: true,
  show_location: true,
  show_blog: true,
  show_twitter: true,
  hidden_repos: [],
  subscription_tier: 'free',
  subscription_status: 'inactive',
};

export function usePortfolio() {
  const [settings, setSettings] = useState<PortfolioSettings>(defaultSettings);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', uid)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching portfolio settings:', error);
      return;
    }

    if (data) {
      setSettings(data as PortfolioSettings);
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', uid)
        .single();

      const newSettings: PortfolioSettings = {
        ...defaultSettings,
        user_id: uid,
        username: profile?.username || '',
      };

      await supabase.from('portfolios').insert([newSettings as any]);
      setSettings(newSettings);
    }
  }, []);

  const fetchGitHubData = useCallback(async (username: string, token?: string) => {
    setLoading(true);
    setError(null);
    try {
      const api = token ? new GitHubAPI(token) : new GitHubAPI();
      const [user, repos, contributions] = await Promise.all([
        api.getUser(username),
        api.getRepos(username),
        api.getContributions(username),
      ]);

      if (!user) {
        throw new Error('GitHub user not found');
      }

      const langTotals: GitHubLanguage = {};
      const seen = new Set<string>();
      for (const repo of repos.slice(0, 15)) {
        if (seen.has(repo.name)) continue;
        seen.add(repo.name);
        try {
          const langs = await api.getLanguages(username, repo.name);
          for (const [lang, bytes] of Object.entries(langs)) {
            langTotals[lang] = (langTotals[lang] || 0) + (bytes as number);
          }
        } catch {
          // Skip
        }
      }

      setPortfolioData({
        user,
        repos: repos.filter(r => !settings.hidden_repos.includes(r.name)),
        languages: langTotals,
        contributions,
        settings,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data');
    } finally {
      setLoading(false);
    }
  }, [settings]);

  const updateSettings = useCallback(async (updates: Partial<PortfolioSettings>) => {
    if (!settings.user_id) return;

    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);

    const { error } = await supabase.from('portfolios').update(updates as any).eq('user_id', settings.user_id);

    if (error) {
      console.error('Error updating settings:', error);
      setSettings(settings);
      throw error;
    }
  }, [settings]);

  const toggleRepoVisibility = useCallback(async (repoName: string) => {
    const hidden = new Set(settings.hidden_repos);
    if (hidden.has(repoName)) {
      hidden.delete(repoName);
    } else {
      hidden.add(repoName);
    }
    await updateSettings({ hidden_repos: Array.from(hidden) });
  }, [settings, updateSettings]);

  return {
    settings,
    portfolioData,
    loading,
    error,
    fetchSettings,
    fetchGitHubData,
    updateSettings,
    toggleRepoVisibility,
  };
}

import type { GitHubRepo, GitHubUser, GitHubLanguage, GitHubContribution } from '@/types';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubAPI {
  private token: string | null = null;

  constructor(token?: string) {
    this.token = token || null;
  }

  private async fetch(path: string): Promise<Response> {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (this.token) {
      headers.Authorization = `token ${this.token}`;
    }
    return fetch(`${GITHUB_API_BASE}${path}`, { headers });
  }

  async getUser(username?: string): Promise<GitHubUser | null> {
    const path = username ? `/users/${username}` : '/user';
    const res = await this.fetch(path);
    if (!res.ok) return null;
    return res.json();
  }

  async getRepos(username?: string, perPage = 100): Promise<GitHubRepo[]> {
    const path = username 
      ? `/users/${username}/repos?per_page=${perPage}&sort=updated&direction=desc` 
      : `/user/repos?per_page=${perPage}&sort=updated&direction=desc&visibility=public`;
    const res = await this.fetch(path);
    if (!res.ok) return [];
    const repos: GitHubRepo[] = await res.json();
    return repos.filter(r => !r.fork && !r.private);
  }

  async getLanguages(username: string, repoName: string): Promise<GitHubLanguage> {
    const res = await this.fetch(`/repos/${username}/${repoName}/languages`);
    if (!res.ok) return {};
    return res.json();
  }

  async getAllLanguages(repos: GitHubRepo[]): Promise<GitHubLanguage> {
    const langTotals: GitHubLanguage = {};
    const seen = new Set<string>();

    for (const repo of repos.slice(0, 20)) {
      if (seen.has(repo.name)) continue;
      seen.add(repo.name);
      try {
        const langs = await this.getLanguages(repo.owner?.login || '', repo.name);
        for (const [lang, bytes] of Object.entries(langs)) {
          langTotals[lang] = (langTotals[lang] || 0) + bytes;
        }
      } catch {
        // Skip repos without language data
      }
    }

    return langTotals;
  }

  async getContributions(username: string): Promise<GitHubContribution[]> {
    const res = await this.fetch(`/users/${username}/events?per_page=100`);
    if (!res.ok) return [];
    const events = await res.json();
    
    const contributions: Record<string, number> = {};
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

    for (const event of events) {
      const date = event.created_at?.split('T')[0];
      if (!date) continue;
      const eventDate = new Date(date);
      if (eventDate < oneYearAgo) continue;
      contributions[date] = (contributions[date] || 0) + 1;
    }

    return Object.entries(contributions)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getAuthenticatedUser(token: string): Promise<GitHubUser | null> {
    this.token = token;
    return this.getUser();
  }
}

export const githubAPI = new GitHubAPI();

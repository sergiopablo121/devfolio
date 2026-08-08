import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { githubAPI } from '@/lib/github';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Github, 
  Star, 
  GitFork, 
  Code2, 
  ExternalLink,
  Loader2,
  MapPin,
  Link as LinkIcon,
  Twitter
} from 'lucide-react';
import type { PortfolioSettings, GitHubUser, GitHubRepo, GitHubLanguage, GitHubContribution } from '@/types';

export function PortfolioPage() {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<{
    user: GitHubUser;
    repos: GitHubRepo[];
    languages: GitHubLanguage;
    contributions: GitHubContribution[];
    settings: PortfolioSettings;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    async function load(uname: string) {
      try {
        // Try to get settings from our DB
        const { data: portfolioSettings } = await supabase
          .from('portfolios')
          .select('*')
          .eq('username', uname)
          .single();

        const settings: PortfolioSettings = portfolioSettings || {
          user_id: '',
          username: uname,
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

        const [user, repos, contributions] = await Promise.all([
          githubAPI.getUser(uname),
          githubAPI.getRepos(uname),
          githubAPI.getContributions(uname),
        ]);

        if (!user) {
          throw new Error('User not found');
        }

        // Calculate languages
        const langTotals: GitHubLanguage = {};
        const seen = new Set<string>();
        for (const repo of repos.slice(0, 15)) {
          if (seen.has(repo.name)) continue;
          seen.add(repo.name);
          try {
            const langs = await githubAPI.getLanguages(uname, repo.name);
            for (const [lang, bytes] of Object.entries(langs)) {
              langTotals[lang] = (langTotals[lang] || 0) + (bytes as number);
            }
          } catch {
            // Skip
          }
        }

        const visibleRepos = repos
          .filter(r => !settings.hidden_repos.includes(r.name))
          .filter(r => !r.fork && !r.private);

        setData({
          user,
          repos: visibleRepos,
          languages: langTotals,
          contributions,
          settings,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    }

    load(username);
  }, [username]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Ошибка</h1>
          <p className="mt-2 text-muted-foreground">{error || 'Portfolio not found'}</p>
        </div>
      </div>
    );
  }

  const { user, repos, languages, contributions, settings } = data;
  const topLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
  const totalForks = repos.reduce((acc, r) => acc + r.forks_count, 0);

  const themeColor = settings.theme_color || 'blue';
  const accentMap: Record<string, string> = {
    blue: 'from-blue-500 to-indigo-500',
    indigo: 'from-indigo-500 to-purple-500',
    violet: 'from-violet-500 to-purple-500',
    purple: 'from-purple-500 to-pink-500',
    pink: 'from-pink-500 to-rose-500',
    rose: 'from-rose-500 to-red-500',
    red: 'from-red-500 to-orange-500',
    orange: 'from-orange-500 to-amber-500',
    amber: 'from-amber-500 to-yellow-500',
    yellow: 'from-yellow-500 to-lime-500',
    lime: 'from-lime-500 to-green-500',
    green: 'from-green-500 to-emerald-500',
    emerald: 'from-emerald-500 to-teal-500',
    teal: 'from-teal-500 to-cyan-500',
    cyan: 'from-cyan-500 to-sky-500',
    sky: 'from-sky-500 to-blue-500',
    slate: 'from-slate-500 to-gray-500',
    zinc: 'from-zinc-500 to-neutral-500',
    stone: 'from-stone-500 to-orange-500',
    gray: 'from-gray-500 to-slate-500',
    neutral: 'from-neutral-500 to-gray-500',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className={`bg-gradient-to-br ${accentMap[themeColor] || accentMap.blue} px-4 py-16 text-white sm:px-6`}>
        <div className="mx-auto max-w-4xl text-center">
          <img 
            src={user.avatar_url} 
            alt={user.name || user.login}
            className="mx-auto mb-6 h-32 w-32 rounded-full border-4 border-white/30 shadow-2xl"
          />
          <h1 className="text-4xl font-bold">{user.name || user.login}</h1>
          <p className="mt-2 text-lg text-white/80">@{user.login}</p>
          {user.bio && <p className="mx-auto mt-4 max-w-xl text-white/90">{user.bio}</p>}
          
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {settings.show_location && user.location && (
              <span className="flex items-center gap-1 text-sm text-white/80">
                <MapPin className="h-4 w-4" />{user.location}
              </span>
            )}
            {settings.show_blog && user.blog && (
              <a href={user.blog} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-white/80 hover:text-white">
                <LinkIcon className="h-4 w-4" />{user.blog}
              </a>
            )}
            {settings.show_twitter && user.twitter_username && (
              <a href={`https://twitter.com/${user.twitter_username}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-white/80 hover:text-white">
                <Twitter className="h-4 w-4" />@{user.twitter_username}
              </a>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-none">
              <Github className="mr-1 h-3 w-3" />
              {user.public_repos} репозиториев
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-none">
              <Star className="mr-1 h-3 w-3" />
              {user.followers} подписчиков
            </Badge>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {/* Stats */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-background p-6 text-center">
            <Star className="mx-auto mb-2 h-6 w-6 text-yellow-500" />
            <div className="text-3xl font-bold">{totalStars}</div>
            <div className="text-sm text-muted-foreground">Всего звёзд</div>
          </div>
          <div className="rounded-xl border bg-background p-6 text-center">
            <GitFork className="mx-auto mb-2 h-6 w-6 text-blue-500" />
            <div className="text-3xl font-bold">{totalForks}</div>
            <div className="text-sm text-muted-foreground">Форков</div>
          </div>
          <div className="rounded-xl border bg-background p-6 text-center">
            <Code2 className="mx-auto mb-2 h-6 w-6 text-green-500" />
            <div className="text-3xl font-bold">{topLanguages.length}</div>
            <div className="text-sm text-muted-foreground">Языков</div>
          </div>
        </div>

        {/* Languages */}
        {topLanguages.length > 0 && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Языки программирования</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topLanguages.map(([lang, bytes]) => {
                  const total = topLanguages.reduce((a, b) => a + b[1], 0);
                  const pct = Math.round((bytes / total) * 100);
                  return (
                    <div key={lang}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>{lang}</span>
                        <span className="text-muted-foreground">{pct}%</span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-muted">
                        <div 
                          className={`h-2.5 rounded-full bg-${themeColor}-500 transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Проекты</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {repos.slice(0, 12).map((repo) => (
              <a 
                key={repo.id} 
                href={repo.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group rounded-xl border bg-background p-5 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{repo.name}</h3>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{repo.description || 'Нет описания'}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  {repo.language && (
                    <Badge variant="secondary" className="text-xs">{repo.language}</Badge>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />{repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" />{repo.forks_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Contributions */}
        {contributions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Активность за последние 3 месяца</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {contributions.slice(-90).map((c) => (
                  <div
                    key={c.date}
                    className={`h-3 w-3 rounded-sm ${getContributionColor(c.count)}`}
                    title={`${c.date}: ${c.count} событий`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <div className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>Создано с помощью <a href="/" className="font-semibold text-foreground hover:underline">DevFolio</a></p>
      </div>
    </div>
  );
}

function getContributionColor(count: number): string {
  if (count === 0) return 'bg-muted';
  if (count < 3) return 'bg-green-200 dark:bg-green-900';
  if (count < 6) return 'bg-green-300 dark:bg-green-800';
  if (count < 10) return 'bg-green-400 dark:bg-green-700';
  return 'bg-green-500 dark:bg-green-600';
}

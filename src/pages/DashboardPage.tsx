import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  Github, 
  Loader2, 
  Eye, 
  Download, 
  ExternalLink,
  Palette,
  Star,
  GitFork,
  Code2,
  FileText,
  RefreshCw
} from 'lucide-react';
import { generatePDF, buildResumeData } from '@/lib/pdf';
import type { PortfolioData, ResumeExperience, ResumeEducation } from '@/types';

export function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { 
    settings, 
    portfolioData, 
    loading, 
    error, 
    fetchSettings, 
    fetchGitHubData, 
    updateSettings, 
    toggleRepoVisibility 
  } = usePortfolio();
  
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [experiences, setExperiences] = useState<ResumeExperience[]>([]);
  const [education, setEducation] = useState<ResumeEducation[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user?.id) {
      fetchSettings(user.id);
    }
  }, [user?.id, fetchSettings]);

  useEffect(() => {
    if (settings.username) {
      const token = user?.identities?.find(i => i.provider === 'github')?.identity_data?.provider_token;
      fetchGitHubData(settings.username, token as string | undefined);
    }
  }, [settings.username, user, fetchGitHubData]);

  const handleGeneratePDF = async () => {
    if (!resumeRef.current) return;
    setGeneratingPDF(true);
    try {
      const isPro = settings.subscription_tier === 'pro' && settings.subscription_status === 'active';
      await generatePDF(resumeRef.current, `resume-${settings.username}`, {
        watermark: !isPro,
        text: 'DEVFOLIO',
      });
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleRefresh = async () => {
    const token = user?.identities?.find(i => i.provider === 'github')?.identity_data?.provider_token;
    if (settings.username) {
      await fetchGitHubData(settings.username, token as string | undefined);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Дашборд</h1>
          <p className="text-muted-foreground">Управляйте своим портфолио и резюме</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Обновить
          </Button>
          <Button onClick={handleGeneratePDF} disabled={generatingPDF} className="gap-2">
            {generatingPDF ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Скачать PDF
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      <Tabs defaultValue="preview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="h-4 w-4" />
            Предпросмотр
          </TabsTrigger>
          <TabsTrigger value="repos" className="gap-2">
            <Github className="h-4 w-4" />
            Репозитории
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Palette className="h-4 w-4" />
            Настройки
          </TabsTrigger>
          <TabsTrigger value="resume" className="gap-2">
            <FileText className="h-4 w-4" />
            Резюме
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          {portfolioData && <PortfolioPreview data={portfolioData} />}
        </TabsContent>

        <TabsContent value="repos">
          <Card>
            <CardHeader>
              <CardTitle>Репозитории</CardTitle>
              <CardDescription>Выберите, какие проекты показывать в портфолио</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {portfolioData?.repos.map((repo) => (
                <div key={repo.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold truncate">{repo.name}</h4>
                      {repo.language && (
                        <Badge variant="secondary" className="text-xs shrink-0">{repo.language}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{repo.description}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Star className="h-3 w-3" />{repo.stargazers_count}</span>
                      <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{repo.forks_count}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-2 shrink-0">
                    <Switch
                      checked={!settings.hidden_repos.includes(repo.name)}
                      onCheckedChange={() => toggleRepoVisibility(repo.name)}
                    />
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </a>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Настройки портфолио</CardTitle>
              <CardDescription>Кастомизируйте внешний вид и содержимое</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Цвет темы</Label>
                <div className="flex flex-wrap gap-2">
                  {['blue', 'indigo', 'violet', 'purple', 'pink', 'rose', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'slate'].map((color) => (
                    <button
                      key={color}
                      onClick={() => updateSettings({ theme_color: color })}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${
                        settings.theme_color === color ? 'border-foreground scale-110' : 'border-transparent hover:scale-105'
                      } bg-${color}-500`}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Отображаемая информация</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-location" className="cursor-pointer">Локация</Label>
                    <Switch
                      id="show-location"
                      checked={settings.show_location}
                      onCheckedChange={(v) => updateSettings({ show_location: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-blog" className="cursor-pointer">Блог / Сайт</Label>
                    <Switch
                      id="show-blog"
                      checked={settings.show_blog}
                      onCheckedChange={(v) => updateSettings({ show_blog: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-twitter" className="cursor-pointer">Twitter</Label>
                    <Switch
                      id="show-twitter"
                      checked={settings.show_twitter}
                      onCheckedChange={(v) => updateSettings({ show_twitter: v })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label htmlFor="custom-domain">Кастомный домен</Label>
                <Input
                  id="custom-domain"
                  placeholder="yourdomain.com"
                  value={settings.custom_domain || ''}
                  onChange={(e) => updateSettings({ custom_domain: e.target.value || null })}
                  disabled={settings.subscription_tier !== 'pro'}
                />
                {settings.subscription_tier !== 'pro' && (
                  <p className="text-xs text-muted-foreground">
                    Доступно только на Pro тарифе. <Link to="/pricing" className="text-primary hover:underline">Обновить</Link>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resume">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Редактировать резюме</CardTitle>
                <CardDescription>Добавьте опыт работы и образование</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block">Опыт работы</Label>
                  {experiences.map((exp, i) => (
                    <div key={exp.id} className="mb-3 grid gap-2 rounded-lg border p-3 sm:grid-cols-2">
                      <Input placeholder="Компания" value={exp.company} onChange={(e) => {
                        const copy = [...experiences];
                        copy[i].company = e.target.value;
                        setExperiences(copy);
                      }} />
                      <Input placeholder="Должность" value={exp.position} onChange={(e) => {
                        const copy = [...experiences];
                        copy[i].position = e.target.value;
                        setExperiences(copy);
                      }} />
                      <Input placeholder="Начало (YYYY-MM)" value={exp.startDate} onChange={(e) => {
                        const copy = [...experiences];
                        copy[i].startDate = e.target.value;
                        setExperiences(copy);
                      }} />
                      <Input placeholder="Окончание (YYYY-MM)" value={exp.endDate} onChange={(e) => {
                        const copy = [...experiences];
                        copy[i].endDate = e.target.value;
                        setExperiences(copy);
                      }} />
                      <Input className="sm:col-span-2" placeholder="Описание" value={exp.description} onChange={(e) => {
                        const copy = [...experiences];
                        copy[i].description = e.target.value;
                        setExperiences(copy);
                      }} />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setExperiences([...experiences, { id: crypto.randomUUID(), company: '', position: '', startDate: '', endDate: '', description: '' }])}>
                    + Добавить опыт
                  </Button>
                </div>

                <Separator />

                <div>
                  <Label className="mb-2 block">Образование</Label>
                  {education.map((edu, i) => (
                    <div key={edu.id} className="mb-3 grid gap-2 rounded-lg border p-3 sm:grid-cols-2">
                      <Input placeholder="Учебное заведение" value={edu.institution} onChange={(e) => {
                        const copy = [...education];
                        copy[i].institution = e.target.value;
                        setEducation(copy);
                      }} />
                      <Input placeholder="Степень" value={edu.degree} onChange={(e) => {
                        const copy = [...education];
                        copy[i].degree = e.target.value;
                        setEducation(copy);
                      }} />
                      <Input placeholder="Специальность" value={edu.field} onChange={(e) => {
                        const copy = [...education];
                        copy[i].field = e.target.value;
                        setEducation(copy);
                      }} />
                      <Input placeholder="Годы" value={edu.startDate} onChange={(e) => {
                        const copy = [...education];
                        copy[i].startDate = e.target.value;
                        setEducation(copy);
                      }} />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setEducation([...education, { id: crypto.randomUUID(), institution: '', degree: '', field: '', startDate: '', endDate: '' }])}>
                    + Добавить образование
                  </Button>
                </div>
              </CardContent>
            </Card>

            {portfolioData && (
              <div className="rounded-lg border bg-white p-8" ref={resumeRef}>
                <ResumeTemplate data={buildResumeData(portfolioData, experiences, education)} />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PortfolioPreview({ data }: { data: PortfolioData }) {
  const { user, repos, languages, contributions } = data;
  const topLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
  const totalForks = repos.reduce((acc, r) => acc + r.forks_count, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-6 rounded-2xl border bg-gradient-to-b from-background to-muted/30 p-8 text-center sm:flex-row sm:text-left">
        <img 
          src={user.avatar_url} 
          alt={user.name || user.login}
          className="h-28 w-28 rounded-full border-4 border-background shadow-lg"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{user.name || user.login}</h2>
          <p className="text-muted-foreground">@{user.login}</p>
          {user.bio && <p className="mt-2 max-w-lg">{user.bio}</p>}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
            {user.location && <span>{user.location}</span>}
            {user.blog && <a href={user.blog} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{user.blog}</a>}
            {user.twitter_username && <span>@{user.twitter_username}</span>}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
            <Badge variant="secondary"><Github className="mr-1 h-3 w-3" />{user.public_repos} репо</Badge>
            <Badge variant="secondary"><Star className="mr-1 h-3 w-3" />{user.followers} подписчиков</Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Star className="h-5 w-5 text-yellow-500" />} label="Всего звёзд" value={totalStars} />
        <StatCard icon={<GitFork className="h-5 w-5 text-blue-500" />} label="Форков" value={totalForks} />
        <StatCard icon={<Code2 className="h-5 w-5 text-green-500" />} label="Языков" value={topLanguages.length} />
      </div>

      {topLanguages.length > 0 && (
        <Card>
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
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div 
                        className="h-2 rounded-full bg-primary transition-all"
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

      <div>
        <h3 className="mb-4 text-xl font-bold">Проекты</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {repos.slice(0, 9).map((repo) => (
            <a 
              key={repo.id} 
              href={repo.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group rounded-xl border bg-background p-5 transition-all hover:border-primary/50 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold group-hover:text-primary">{repo.name}</h4>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{repo.description || 'Нет описания'}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                {repo.language && <Badge variant="secondary" className="text-xs">{repo.language}</Badge>}
                <span className="flex items-center gap-1"><Star className="h-3 w-3" />{repo.stargazers_count}</span>
                <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{repo.forks_count}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {contributions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Активность</CardTitle>
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
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-background p-4 text-center">
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
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

function ResumeTemplate({ data }: { data: ReturnType<typeof buildResumeData> }) {
  const { user, repos, skills, experiences, education } = data;
  
  return (
    <div className="space-y-6 text-sm">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">{user.name || user.login}</h1>
        <p className="text-muted-foreground">@{user.login}</p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {user.location && <span>{user.location}</span>}
          {user.blog && <span>{user.blog}</span>}
          {user.html_url && <span>{user.html_url}</span>}
        </div>
        {user.bio && <p className="mt-2">{user.bio}</p>}
      </div>

      {skills.length > 0 && (
        <div>
          <h2 className="mb-2 text-lg font-bold">Навыки</h2>
          <div className="flex flex-wrap gap-1">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
            ))}
          </div>
        </div>
      )}

      {experiences.length > 0 && (
        <div>
          <h2 className="mb-2 text-lg font-bold">Опыт работы</h2>
          <div className="space-y-3">
            {experiences.filter(e => e.company).map((exp) => (
              <div key={exp.id}>
                <div className="font-semibold">{exp.position}</div>
                <div className="text-muted-foreground">{exp.company} | {exp.startDate} — {exp.endDate || 'настоящее время'}</div>
                <p className="mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div>
          <h2 className="mb-2 text-lg font-bold">Образование</h2>
          <div className="space-y-3">
            {education.filter(e => e.institution).map((edu) => (
              <div key={edu.id}>
                <div className="font-semibold">{edu.institution}</div>
                <div className="text-muted-foreground">{edu.degree}, {edu.field} | {edu.startDate}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {repos.length > 0 && (
        <div>
          <h2 className="mb-2 text-lg font-bold">Проекты</h2>
          <div className="space-y-2">
            {repos.map((repo) => (
              <div key={repo.id}>
                <div className="font-semibold">{repo.name}</div>
                <p className="text-muted-foreground">{repo.description}</p>
                <div className="mt-1 text-xs text-muted-foreground">
                  {repo.language && <span>{repo.language} • </span>}
                  <span>⭐ {repo.stargazers_count} • 🍴 {repo.forks_count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  private: boolean;
  fork: boolean;
  owner?: {
    login: string;
  };
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubLanguage {
  [key: string]: number;
}

export interface GitHubContribution {
  date: string;
  count: number;
}

export interface PortfolioSettings {
  id?: string;
  user_id: string;
  username: string;
  theme_color: string;
  accent_color: string;
  show_email: boolean;
  show_location: boolean;
  show_blog: boolean;
  show_twitter: boolean;
  hidden_repos: string[];
  custom_domain?: string | null;
  subscription_tier: 'free' | 'pro';
  subscription_status: 'active' | 'inactive' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

export interface PortfolioData {
  user: GitHubUser;
  repos: GitHubRepo[];
  languages: GitHubLanguage;
  contributions: GitHubContribution[];
  settings: PortfolioSettings;
}

export interface ResumeData {
  user: GitHubUser;
  repos: GitHubRepo[];
  languages: GitHubLanguage;
  skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
}

export interface ResumeExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export type ThemeColor = 
  | 'slate' | 'zinc' | 'stone' | 'gray' | 'neutral'
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime'
  | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky'
  | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia'
  | 'pink' | 'rose';

export const THEME_COLORS: { value: ThemeColor; label: string; class: string }[] = [
  { value: 'blue', label: 'Синий', class: 'bg-blue-500' },
  { value: 'indigo', label: 'Индиго', class: 'bg-indigo-500' },
  { value: 'violet', label: 'Фиолетовый', class: 'bg-violet-500' },
  { value: 'purple', label: 'Пурпурный', class: 'bg-purple-500' },
  { value: 'fuchsia', label: 'Фуксия', class: 'bg-fuchsia-500' },
  { value: 'pink', label: 'Розовый', class: 'bg-pink-500' },
  { value: 'rose', label: 'Роза', class: 'bg-rose-500' },
  { value: 'red', label: 'Красный', class: 'bg-red-500' },
  { value: 'orange', label: 'Оранжевый', class: 'bg-orange-500' },
  { value: 'amber', label: 'Янтарный', class: 'bg-amber-500' },
  { value: 'yellow', label: 'Жёлтый', class: 'bg-yellow-500' },
  { value: 'lime', label: 'Лайм', class: 'bg-lime-500' },
  { value: 'green', label: 'Зелёный', class: 'bg-green-500' },
  { value: 'emerald', label: 'Изумрудный', class: 'bg-emerald-500' },
  { value: 'teal', label: 'Бирюзовый', class: 'bg-teal-500' },
  { value: 'cyan', label: 'Циан', class: 'bg-cyan-500' },
  { value: 'sky', label: 'Небесный', class: 'bg-sky-500' },
  { value: 'slate', label: 'Сланцевый', class: 'bg-slate-500' },
  { value: 'zinc', label: 'Цинк', class: 'bg-zinc-500' },
  { value: 'stone', label: 'Каменный', class: 'bg-stone-500' },
  { value: 'gray', label: 'Серый', class: 'bg-gray-500' },
  { value: 'neutral', label: 'Нейтральный', class: 'bg-neutral-500' },
];

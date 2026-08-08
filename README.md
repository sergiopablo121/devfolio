# DevFolio

Автоматический генератор резюме + портфолио для разработчиков.

## Возможности

- Авторизация через GitHub OAuth
- Автоимпорт репозиториев, языков программирования и активности
- Генерация красивого одностраничного портфолио
- Генерация PDF резюме (с водяным знаком на бесплатном тарифе)
- Кастомизация цветов темы
- Скрытие/показ проектов
- Публичные портфолио по адресу `/portfolio/:username`
- Монетизация: Free и Pro ($4/мес) тарифы

## Технологии

- React 19 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Supabase (Auth + Database)
- GitHub REST API
- jsPDF + html2canvas для PDF

## Настройка

### 1. Supabase

1. Создайте проект на [supabase.com](https://supabase.com)
2. Включите GitHub OAuth в Authentication → Providers:
   - Client ID и Secret из GitHub OAuth App
   - Callback URL: `https://your-project.supabase.co/auth/v1/callback`
3. Выполните SQL из `supabase_schema.sql` в SQL Editor
4. Скопируйте URL и Anon Key в `.env`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 2. GitHub OAuth App

1. Зайдите в Settings → Developer settings → OAuth Apps
2. Создайте новое приложение:
   - Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
3. Скопируйте Client ID и Secret в Supabase Auth Provider settings

### 3. Локальная разработка

```bash
npm install
npm run dev
```

### 4. Деплой

Соберите production build:
```bash
npm run build
```

Загрузите `dist/` на любой static hosting (Vercel, Netlify, GitHub Pages).

## Структура проекта

```
src/
  components/
    layout/       # Navbar, Footer
    ui/           # shadcn/ui components
  hooks/
    useAuth.ts    # GitHub OAuth через Supabase
    usePortfolio.ts # Управление портфолио
  lib/
    supabase.ts   # Supabase client
    github.ts     # GitHub API helper
    pdf.ts        # PDF generation
  pages/
    LandingPage.tsx
    AuthPage.tsx
    DashboardPage.tsx
    PortfolioPage.tsx
    PricingPage.tsx
  types/
    index.ts      # TypeScript типы
```

## Монетизация

- **Free**: Водяной знак на PDF, поддомен devfolio.app
- **Pro ($4/мес)**: Свой домен, PDF без водяного знака, приоритетная поддержка

Для интеграции платежей подключите Stripe и создайте Edge Function в Supabase.

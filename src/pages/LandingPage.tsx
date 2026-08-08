import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Github, 
  FileText, 
  Palette, 
  Globe, 
  Zap, 
  Shield, 
  ArrowRight,
  Star,
  Code2,
  Layout
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4 gap-1">
            <Zap className="h-3 w-3" />
            Бесплатно для всех разработчиков
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Создайте{' '}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              идеальное портфолио
            </span>{' '}
            за минуты
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            DevFolio автоматически импортирует ваши репозитории, языки программирования 
            и активность из GitHub — и создаёт красивое портфолио + PDF резюме.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                <Github className="h-5 w-5" />
                Начать бесплатно
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="gap-2">
                Посмотреть тарифы
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Всё, что нужно для поиска работы</h2>
            <p className="mt-4 text-muted-foreground">Больше не тратьте время на оформление резюме</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Github className="h-6 w-6" />}
              title="Автоимпорт из GitHub"
              description="Подключите GitHub — мы сами подтянем репозитории, языки и статистику"
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="PDF резюме"
              description="Генерация профессионального PDF резюме одним кликом"
            />
            <FeatureCard
              icon={<Palette className="h-6 w-6" />}
              title="Кастомизация"
              description="Выбирайте цвета темы, скрывайте проекты, настраивайте вид"
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="Свой домен"
              description="На Pro тарифе подключите собственный домен к портфолио"
            />
            <FeatureCard
              icon={<Layout className="h-6 w-6" />}
              title="Одностраничное портфолио"
              description="Красивое, отзывчивое портфолио для быстрого просмотра"
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Безопасность"
              description="Только публичные данные. Никаких паролей — OAuth через GitHub"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/40 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Как это работает</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <StepCard
              number="1"
              icon={<Github className="h-6 w-6" />}
              title="Авторизуйтесь"
              description="Один клик — вход через GitHub OAuth"
            />
            <StepCard
              number="2"
              icon={<Code2 className="h-6 w-6" />}
              title="Данные подтянутся"
              description="Репозитории, языки, активность — автоматически"
            />
            <StepCard
              number="3"
              icon={<Star className="h-6 w-6" />}
              title="Получите результат"
              description="Портфолио + PDF резюме готовы к использованию"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold">Готовы выделиться?</h2>
          <p className="mt-4 text-muted-foreground">
            Присоединяйтесь к тысячам разработчиков, которые уже используют DevFolio
          </p>
          <Link to="/auth" className="mt-8 inline-block">
            <Button size="lg" className="gap-2">
              <Github className="h-5 w-5" />
              Создать портфолио
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border/40 bg-background p-6 transition-all hover:border-border hover:shadow-sm">
      <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function StepCard({ number, icon, title, description }: { number: string; icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="relative text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="absolute -top-2 left-1/2 flex h-6 w-6 -translate-x-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {number}
      </div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

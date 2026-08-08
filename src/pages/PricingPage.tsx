import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Github, Zap, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'навсегда',
    icon: <Zap className="h-5 w-5" />,
    description: 'Для начала карьеры',
    features: [
      { text: 'Автоимпорт из GitHub', included: true },
      { text: 'Одностраничное портфолио', included: true },
      { text: 'Кастомизация цветов', included: true },
      { text: 'Скрытие проектов', included: true },
      { text: 'PDF резюме', included: true },
      { text: 'Водяной знак на PDF', included: true },
      { text: 'Поддомен devfolio.app', included: true },
      { text: 'Свой домен', included: false },
      { text: 'PDF без водяного знака', included: false },
      { text: 'Приоритетная поддержка', included: false },
    ],
    cta: 'Начать бесплатно',
    popular: false,
  },
  {
    name: 'Pro',
    price: 4,
    period: '/ месяц',
    icon: <Crown className="h-5 w-5" />,
    description: 'Для серьёзных кандидатов',
    features: [
      { text: 'Всё из Free', included: true },
      { text: 'Автоимпорт из GitHub', included: true },
      { text: 'Одностраничное портфолио', included: true },
      { text: 'Кастомизация цветов', included: true },
      { text: 'Скрытие проектов', included: true },
      { text: 'PDF резюме', included: true },
      { text: 'Свой домен', included: true },
      { text: 'PDF без водяного знака', included: true },
      { text: 'Приоритетная поддержка', included: true },
      { text: 'Экспорт в несколько форматов', included: true },
    ],
    cta: 'Перейти на Pro',
    popular: true,
  },
];

export function PricingPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="mb-4">
          <Crown className="mr-1 h-3 w-3" />
          Простая и прозрачная цена
        </Badge>
        <h1 className="text-4xl font-bold">Выберите свой тариф</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Начните бесплатно, обновитесь когда будете готовы
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  Популярный выбор
                </Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                {plan.icon}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground"> {plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="h-4 w-4 shrink-0 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className={feature.included ? '' : 'text-muted-foreground'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                {user ? (
                  <Link to="/dashboard">
                    <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button className="w-full gap-2" variant={plan.popular ? 'default' : 'outline'}>
                      <Github className="h-4 w-4" />
                      {plan.cta}
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>Оплата через Stripe. Отмена в любой момент. Нет скрытых платежей.</p>
      </div>
    </div>
  );
}

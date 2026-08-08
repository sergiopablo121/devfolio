import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Loader2 } from 'lucide-react';

export function AuthPage() {
  const { user, loading, signInWithGitHub } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Добро пожаловать в DevFolio</CardTitle>
          <CardDescription>
            Войдите через GitHub, чтобы создать своё портфолио
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={signInWithGitHub}
            className="w-full gap-2"
            size="lg"
          >
            <Github className="h-5 w-5" />
            Войти через GitHub
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Мы получаем доступ только к публичным репозиториям и профилю
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

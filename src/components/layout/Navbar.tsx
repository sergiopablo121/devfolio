import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Github, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Github className="h-6 w-6" />
          <span>DevFolio</span>
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <Link to="/pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Тарифы
          </Link>
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Дашборд
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Выйти
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="gap-2">
                <Github className="h-4 w-4" />
                Войти через GitHub
              </Button>
            </Link>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/40 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link to="/pricing" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground">
              Тарифы
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium">
                  Дашборд
                </Link>
                <button onClick={() => { handleSignOut(); setMobileOpen(false); }} className="text-left text-sm font-medium text-red-500">
                  Выйти
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full gap-2">
                  <Github className="h-4 w-4" />
                  Войти через GitHub
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

import { Github, Heart, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Github className="h-4 w-4" />
          <span>DevFolio</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Сделано с <Heart className="inline h-3 w-3 text-red-500" /> для разработчиков
        </p>
        <a href="mailto:support@devfolio.app" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <Mail className="h-3 w-3" />
          support@devfolio.app
        </a>
      </div>
    </footer>
  );
}

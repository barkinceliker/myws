import Link from 'next/link';
import { Aperture, Home, User, Briefcase, FileText, BarChart3, GraduationCap, LogIn, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavLink } from './nav-link';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { href: '/about', label: 'About Me', icon: <User className="h-4 w-4" /> },
    { href: '/projects', label: 'Projects', icon: <Briefcase className="h-4 w-4" /> },
    { href: '/blog', label: 'Blog', icon: <FileText className="h-4 w-4" /> },
    { href: '/skills', label: 'Skills', icon: <BarChart3 className="h-4 w-4" /> },
    { href: '/resume', label: 'Resume', icon: <GraduationCap className="h-4 w-4" /> },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Aperture className="h-7 w-7 text-primary" />
            <span className="font-headline text-xl font-bold text-primary">Aperture Portfolio</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
            <Button variant="outline" size="sm" asChild className="transition-colors hover:bg-accent hover:text-accent-foreground">
              <Link href="/admin/login">
                <LogIn className="mr-2 h-4 w-4" />
                Admin Login
              </Link>
            </Button>
          </nav>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    <Link href="/" className="flex items-center gap-2">
                      <Aperture className="h-7 w-7 text-primary" />
                      <span className="font-headline text-xl font-bold text-primary">Aperture Portfolio</span>
                    </Link>
                  </div>
                  <nav className="flex flex-col gap-2 p-4 flex-1">
                    {navItems.map((item) => (
                      <NavLink key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-muted" activeClassName="bg-muted">
                         {item.icon} {item.label}
                      </NavLink>
                    ))}
                  </nav>
                   <div className="mt-auto p-4 border-t">
                     <Button variant="outline" className="w-full transition-colors hover:bg-accent hover:text-accent-foreground" asChild>
                        <Link href="/admin/login">
                          <LogIn className="mr-2 h-4 w-4" />
                          Admin Login
                        </Link>
                      </Button>
                   </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border/40 bg-background/95">
        <div className="container flex flex-col items-center justify-center gap-4 h-20 py-6 md:h-24 md:flex-row md:py-0">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Aperture Portfolio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}


import Link from 'next/link';
import { Aperture, LogIn, Menu, Home, User, Briefcase, FileText, BarChartBig, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavLink } from './nav-link'; // NavLink componentini import ediyoruz

const navItems = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/#about', label: 'About', Icon: User },
  { href: '/#projects', label: 'Projects', Icon: Briefcase },
  { href: '/#blog', label: 'Blog', Icon: FileText },
  { href: '/#skills', label: 'Skills', Icon: BarChartBig },
  { href: '/#resume', label: 'Resume', Icon: GraduationCap },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <Aperture className="h-7 w-7 text-primary" />
            <span className="font-headline text-xl font-bold text-primary">Aperture Portfolio</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                href={item.href}
                className="px-3 py-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
                activeClassName="bg-accent text-accent-foreground"
              >
                {item.label}
              </NavLink>
            ))}
             <Button variant="outline" size="sm" asChild className="ml-4 transition-colors hover:bg-accent hover:text-accent-foreground">
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
              <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0 flex flex-col">
                <div className="p-6 border-b">
                  <Link href="/" className="flex items-center gap-2">
                    <Aperture className="h-7 w-7 text-primary" />
                    <span className="font-headline text-xl font-bold text-primary">Aperture Portfolio</span>
                  </Link>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                  {navItems.map((item) => (
                    <Button key={item.label} variant="ghost" className="w-full justify-start" asChild>
                      <Link href={item.href}>
                        <item.Icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </Link>
                    </Button>
                  ))}
                </nav>
                 <div className="p-4 border-t mt-auto">
                   <Button variant="outline" className="w-full transition-colors hover:bg-accent hover:text-accent-foreground" asChild>
                      <Link href="/admin/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        Admin Login
                      </Link>
                    </Button>
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

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Briefcase, FileText, User } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('/subtle-pattern.svg')" }}></div>
        <div className="container relative text-center">
          <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6 text-primary animate-fade-in-down">
            Welcome to Aperture Portfolio
          </h1>
          <p className="text-xl md:text-2xl text-foreground mb-10 max-w-3xl mx-auto animate-fade-in-up">
            Discover my journey, projects, and skills. Let&apos;s build something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
            <Button size="lg" asChild className="transition-transform hover:scale-105">
              <Link href="/projects">
                View My Work <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="transition-transform hover:scale-105">
              <Link href="/about">
                Learn More About Me
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Explore My World
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="/about" className="group">
              <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <User className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="font-headline text-2xl">About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Dive into my background, passions, and the story behind my work.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
            <Link href="/projects" className="group">
              <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <Briefcase className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="font-headline text-2xl">Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Explore a curated selection of projects I&apos;ve built and contributed to.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
            <Link href="/blog" className="group">
              <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <FileText className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="font-headline text-2xl">Blog</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Read my thoughts on technology, design, and creative endeavors.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-primary">
            Ready to Collaborate?
          </h2>
          <p className="text-lg text-foreground mb-8 max-w-xl mx-auto">
            I&apos;m always excited to discuss new projects and opportunities. Let&apos;s connect!
          </p>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-transform hover:scale-105">
            Get In Touch
          </Button>
        </div>
      </section>
    </>
  );
}

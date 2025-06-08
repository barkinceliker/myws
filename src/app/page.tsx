
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Briefcase, FileText, User } from 'lucide-react';

import { AboutSection } from './about/page';
import { ProjectsSection } from './projects/page';
import { BlogSection } from './blog/page';
import { SkillsSection } from './skills/page';
import { ResumeSection } from './resume/page';

import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import type { HomeContentFormData } from '@/types';

async function getHomeContent(): Promise<HomeContentFormData | null> {
  if (!app) {
    console.error("Firebase app is not initialized.");
    return null;
  }
  const db = getFirestore(app);
  const docRef = doc(db, 'homeContent', 'main');
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as HomeContentFormData;
    } else {
      console.log("No home content document found in Firestore.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching home content from Firestore:", error);
    return null;
  }
}

// Default content in case Firestore data is not available
const defaultHomeContent: HomeContentFormData = {
  heroTitle: 'Welcome to Aperture Portfolio',
  heroSubtitle: 'Discover my journey, projects, and skills. Let\'s build something amazing together.',
  heroCtaButtonText: 'View My Work',
  heroCtaLink: '#projects',
  heroSecondaryButtonText: 'Learn More About Me',
  heroSecondaryLink: '#about',
  exploreTitle: 'Explore My World',
  exploreAboutTitle: 'About Me',
  exploreAboutDescription: "Dive into my background, passions, and the story behind my work.",
  exploreProjectsTitle: 'Projects',
  exploreProjectsDescription: "Explore a curated selection of projects I've built and contributed to.",
  exploreBlogTitle: 'Blog',
  exploreBlogDescription: "Read my thoughts on technology, design, and creative endeavors.",
  ctaTitle: 'Ready to Collaborate?',
  ctaSubtitle: "I'm always excited to discuss new projects and opportunities. Let's connect!",
  ctaButtonText: 'Get In Touch',
  ctaButtonLink: 'mailto:your-email@example.com',
};


export default async function SinglePageLayout() {
  const homeContentData = await getHomeContent();
  const content = homeContentData || defaultHomeContent;

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('/subtle-pattern.svg')" }}></div>
        <div className="container relative text-center">
          <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6 text-primary animate-fade-in-down">
            {content.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-foreground mb-10 max-w-3xl mx-auto animate-fade-in-up">
            {content.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
            {content.heroCtaLink && content.heroCtaButtonText && (
              <Button size="lg" asChild className="transition-transform hover:scale-105">
                <Link href={content.heroCtaLink}>
                  {content.heroCtaButtonText} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
            {content.heroSecondaryLink && content.heroSecondaryButtonText && (
              <Button size="lg" variant="outline" asChild className="transition-transform hover:scale-105">
                <Link href={content.heroSecondaryLink}>
                  {content.heroSecondaryButtonText}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section id="explore" className="py-16 md:py-24">
        <div className="container">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            {content.exploreTitle}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Link href="#about" className="group">
              <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <User className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="font-headline text-2xl">{content.exploreAboutTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {content.exploreAboutDescription}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
            <Link href="#projects" className="group">
              <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <Briefcase className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="font-headline text-2xl">{content.exploreProjectsTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {content.exploreProjectsDescription}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
            <Link href="#blog" className="group">
              <Card className="h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <FileText className="h-12 w-12 text-accent mb-4" />
                  <CardTitle className="font-headline text-2xl">{content.exploreBlogTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {content.exploreBlogDescription}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="contact" className="py-16 md:py-24 bg-secondary/50">
        <div className="container text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-primary">
            {content.ctaTitle}
          </h2>
          <p className="text-lg text-foreground mb-8 max-w-xl mx-auto">
            {content.ctaSubtitle}
          </p>
          {content.ctaButtonLink && content.ctaButtonText && (
            <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 transition-transform hover:scale-105">
              <Link href={content.ctaButtonLink}>
                {content.ctaButtonText}
              </Link>
            </Button>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about">
        <AboutSection />
      </section>

      {/* Projects Section */}
      <section id="projects">
        <ProjectsSection />
      </section>

      {/* Blog Section */}
      <section id="blog">
        <BlogSection />
      </section>

      {/* Skills Section */}
      <section id="skills">
        <SkillsSection />
      </section>

      {/* Resume Section */}
      <section id="resume">
        <ResumeSection />
      </section>
    </>
  );
}

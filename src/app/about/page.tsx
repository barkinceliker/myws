import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Target, Users } from 'lucide-react';

export function AboutSection() {
  return (
    <>
      <PageHeader
        title="About Me"
        description="A glimpse into my journey, aspirations, and what drives me."
      />
      <div className="container py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1 flex justify-center">
            <Card className="overflow-hidden w-full max-w-sm shadow-lg">
              <Image
                src="https://placehold.co/600x600.png"
                alt="My Portrait"
                width={600}
                height={600}
                className="object-cover aspect-square transition-transform duration-500 hover:scale-105"
                data-ai-hint="professional portrait"
              />
            </Card>
          </div>
          <div className="md:col-span-2">
            <h2 className="font-headline text-3xl font-bold text-primary mb-6">
              Hi, I&apos;m [Your Name]
            </h2>
            <div className="space-y-6 text-lg text-foreground/90 leading-relaxed">
              <p>
                I am a passionate and results-oriented [Your Profession/Title] with a strong foundation in [Key Skill 1], [Key Skill 2], and [Key Skill 3]. My journey into the world of [Your Field] began with a fascination for [Initial Spark/Interest], and since then, I&apos;ve been dedicated to crafting innovative solutions and pushing creative boundaries.
              </p>
              <p>
                I thrive in collaborative environments and believe that the best work comes from diverse perspectives and shared enthusiasm. My approach is rooted in continuous learning and a commitment to excellence, always striving to deliver impactful and meaningful outcomes.
              </p>
              <p>
                Beyond my professional pursuits, I&apos;m an avid [Hobby 1], enjoy [Hobby 2], and am always on the lookout for new challenges and opportunities to grow, both personally and professionally.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-16 md:mt-24">
          <h3 className="font-headline text-2xl md:text-3xl font-bold text-primary text-center mb-10">
            My Core Values
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow">
              <CardContent>
                <Award className="h-12 w-12 text-accent mx-auto mb-4" />
                <h4 className="font-headline text-xl font-semibold mb-2">Excellence</h4>
                <p className="text-muted-foreground">
                  Striving for the highest quality in everything I do, paying attention to detail and delivering outstanding results.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow">
              <CardContent>
                <Target className="h-12 w-12 text-accent mx-auto mb-4" />
                <h4 className="font-headline text-xl font-semibold mb-2">Innovation</h4>
                <p className="text-muted-foreground">
                  Constantly seeking new ideas and creative solutions to solve complex problems and drive progress.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow">
              <CardContent>
                <Users className="h-12 w-12 text-accent mx-auto mb-4" />
                <h4 className="font-headline text-xl font-semibold mb-2">Collaboration</h4>
                <p className="text-muted-foreground">
                  Believing in the power of teamwork and fostering an environment of open communication and mutual respect.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}

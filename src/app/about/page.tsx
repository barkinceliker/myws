
import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Target, Users, Building, Palette, Brain, LucideIcon } from 'lucide-react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import type { AboutContentFormData, CoreValueFormData } from '@/types';

async function getAboutContent(): Promise<AboutContentFormData | null> {
  if (!app) {
    console.error("Firebase app is not initialized for About page.");
    return null;
  }
  const db = getFirestore(app);
  const docRef = doc(db, 'aboutContent', 'main');
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as AboutContentFormData;
      // Ensure coreValues is an array, provide default if not.
      return {
        ...data,
        coreValues: Array.isArray(data.coreValues) ? data.coreValues : defaultAboutContent.coreValues,
      };
    } else {
      console.log("No about content document found in Firestore. Using default.");
      return defaultAboutContent;
    }
  } catch (error) {
    console.error("Error fetching about content from Firestore:", error);
    return defaultAboutContent; // Fallback to default on error
  }
}

const defaultCoreValues: CoreValueFormData[] = [
  { title: 'Excellence', description: 'Striving for the highest quality and paying attention to detail.' },
  { title: 'Innovation', description: 'Seeking new ideas and creative solutions to complex problems.' },
  { title: 'Collaboration', description: 'Believing in teamwork and fostering open communication.' },
];

const defaultAboutContent: AboutContentFormData = {
  pageTitle: 'About Me',
  pageDescription: 'A glimpse into my journey, aspirations, and what drives me.',
  portraitImageUrl: 'https://placehold.co/600x600.png',
  portraitImageHint: 'professional portrait',
  greetingName: '[Your Name Here]',
  profession: '[Your Profession/Title]',
  keySkill1: '[Skill 1]',
  keySkill2: '[Skill 2]',
  keySkill3: '[Skill 3]',
  bioIntro: "My journey into [Your Field] began with a fascination for [Initial Spark/Interest]. I'm dedicated to crafting innovative solutions.",
  bioCollaboration: "I thrive in collaborative environments, believing diverse perspectives lead to the best work. My approach is rooted in continuous learning.",
  bioPersonal: "Beyond professional pursuits, I enjoy [Hobby 1] and [Hobby 2], always seeking growth.",
  coreValuesTitle: 'My Core Values',
  coreValues: defaultCoreValues,
};

export async function AboutSection() {
  const content = await getAboutContent() || defaultAboutContent;

  return (
    <>
      <PageHeader
        title={content.pageTitle}
        description={content.pageDescription}
      />
      <div className="container py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1 flex justify-center">
            <Card className="overflow-hidden w-full max-w-sm shadow-lg">
              <Image
                src={content.portraitImageUrl || 'https://placehold.co/600x600.png'}
                alt="My Portrait"
                width={600}
                height={600}
                className="object-cover aspect-square transition-transform duration-500 hover:scale-105"
                data-ai-hint={content.portraitImageHint || "professional portrait"}
                priority // Prioritize loading this image
              />
            </Card>
          </div>
          <div className="md:col-span-2">
            <h2 className="font-headline text-3xl font-bold text-primary mb-6">
              Hi, I&apos;m {content.greetingName}
            </h2>
            <div className="space-y-6 text-lg text-foreground/90 leading-relaxed">
              <p>
                I am a passionate and results-oriented {content.profession} with a strong foundation in {content.keySkill1}, {content.keySkill2}, and {content.keySkill3}. {content.bioIntro}
              </p>
              <p>
                {content.bioCollaboration}
              </p>
              <p>
                {content.bioPersonal}
              </p>
            </div>
          </div>
        </div>

        {content.coreValues && content.coreValues.length > 0 && (
          <section className="mt-16 md:mt-24">
            <h3 className="font-headline text-2xl md:text-3xl font-bold text-primary text-center mb-10">
              {content.coreValuesTitle}
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {content.coreValues.map((value, index) => {
                const lowerTitle = value.title.toLowerCase();
                let IconComponent: LucideIcon = Building; // Default icon

                if (lowerTitle.includes('excellence') || lowerTitle.includes('quality')) {
                  IconComponent = Award;
                } else if (lowerTitle.includes('innovation') || lowerTitle.includes('creative')) {
                  IconComponent = Brain;
                } else if (lowerTitle.includes('collaboration') || lowerTitle.includes('team')) {
                  IconComponent = Users;
                } else if (lowerTitle.includes('integrity') || lowerTitle.includes('honesty')) {
                  IconComponent = Target;
                } else if (lowerTitle.includes('learning') || lowerTitle.includes('growth')) {
                  IconComponent = Palette;
                }

                return (
                  <Card key={index} className="text-center p-6 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent>
                      <IconComponent className="h-12 w-12 text-accent mx-auto mb-4" />
                      <h4 className="font-headline text-xl font-semibold mb-2">{value.title}</h4>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

// Ensure this file acts as a page for the /about route
export default AboutSection;

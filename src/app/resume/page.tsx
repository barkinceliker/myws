
import { PageHeader } from '@/components/page-header';
import { TimelineItem } from '@/components/timeline-item';
import { Briefcase, GraduationCap, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import type { ExperienceItem, EducationItem } from '@/types'; // Ensure these types match Firestore structure
import { format } from 'date-fns'; // For formatting dates (optional here, could be done in admin)

async function getResumeData(): Promise<{ experiences: ExperienceItem[], education: EducationItem[] }> {
  if (!app) {
    console.error("Firebase app is not initialized for Resume page.");
    return { experiences: [], education: [] };
  }
  const db = getFirestore(app);
  
  const experiencesData: ExperienceItem[] = [];
  const educationData: EducationItem[] = [];

  try {
    // Fetch Experiences
    const expCollection = collection(db, 'experiences');
    // Assuming 'createdAt' or a specific 'order' field for sorting.
    // If you use 'dateRange' for sorting, ensure it's consistently formatted or use Timestamps.
    const expQuery = query(expCollection, orderBy('createdAt', 'desc')); // Or 'dateRange' if you manage its sorting
    const expSnapshot = await getDocs(expQuery);
    expSnapshot.forEach(doc => {
      experiencesData.push({ id: doc.id, ...(doc.data() as Omit<ExperienceItem, 'id'>) });
    });

    // Fetch Education
    const eduCollection = collection(db, 'educationItems');
    const eduQuery = query(eduCollection, orderBy('createdAt', 'desc')); // Or 'dateRange'
    const eduSnapshot = await getDocs(eduQuery);
    eduSnapshot.forEach(doc => {
      educationData.push({ id: doc.id, ...(doc.data() as Omit<EducationItem, 'id'>) });
    });

  } catch (error) {
    console.error("Error fetching resume data from Firestore:", error);
  }
  
  return { experiences: experiencesData, education: educationData };
}

const defaultExperience: ExperienceItem[] = [
  {
    id: 'exp-fallback',
    role: 'Senior Developer (Sample)',
    company: 'Tech Solutions (Sample)',
    dateRange: 'Jan 2022 - Present',
    responsibilities: ['Led development of web apps.', 'Mentored junior developers.'],
  },
];

const defaultEducation: EducationItem[] = [
  {
    id: 'edu-fallback',
    degree: 'MSc Computer Science (Sample)',
    institution: 'University of Technology (Sample)',
    dateRange: '2020 - 2022',
    details: 'Specialized in AI.',
  },
];


export async function ResumeSection() {
  const { experiences, education } = await getResumeData();
  const displayExperiences = experiences.length > 0 ? experiences : defaultExperience;
  const displayEducation = education.length > 0 ? education : defaultEducation;

  return (
    <>
      <PageHeader
        title="My Resume"
        description="A summary of my professional experience, education, and key achievements."
      />
      <div className="container py-12 md:py-16">
        <div className="text-center mb-12">
           <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-transform hover:scale-105 shadow-md">
            {/* Replace with actual link to your resume PDF, maybe from Firestore too? */}
            <Link href="/placeholder-resume.pdf" target="_blank" download="YourName_Resume.pdf">
              <Download className="mr-2 h-5 w-5" />
              Download Resume (PDF)
            </Link>
          </Button>
        </div>

        {/* Professional Experience Section */}
        <section className="mb-16">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-10 flex items-center">
            <Briefcase className="mr-4 h-8 w-8 text-accent" />
            Professional Experience
          </h2>
          {displayExperiences.length === 0 && !experiences.length ? (
             <div className="text-center py-6">
                <p className="text-lg text-muted-foreground">No professional experience listed yet. Add some from the admin panel!</p>
            </div>
          ) : (
            <div className="space-y-0">
                {displayExperiences.map((exp, index) => (
                <TimelineItem
                    key={exp.id}
                    title={exp.role}
                    subtitle={exp.company}
                    dateRange={exp.dateRange}
                    description={exp.responsibilities} // This is already an array of strings
                    icon={<Briefcase size={18} />}
                    isLast={index === displayExperiences.length - 1}
                />
                ))}
            </div>
          )}
        </section>

        {/* Education Section */}
        <section>
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-10 flex items-center">
            <GraduationCap className="mr-4 h-8 w-8 text-accent" />
            Education
          </h2>
           {displayEducation.length === 0 && !education.length ? (
             <div className="text-center py-6">
                <p className="text-lg text-muted-foreground">No education history listed yet. Add some from the admin panel!</p>
            </div>
          ) : (
            <div className="space-y-0">
                {displayEducation.map((edu, index) => (
                <TimelineItem
                    key={edu.id}
                    title={edu.degree}
                    subtitle={edu.institution}
                    dateRange={edu.dateRange}
                    description={edu.details} // This is a string
                    icon={<GraduationCap size={18} />}
                    isLast={index === displayEducation.length - 1}
                />
                ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

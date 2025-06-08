import { PageHeader } from '@/components/page-header';
import { TimelineItem } from '@/components/timeline-item';
import { Briefcase, GraduationCap, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Experience {
  role: string;
  company: string;
  dateRange: string;
  responsibilities: string[];
}

interface Education {
  degree: string;
  institution: string;
  dateRange: string;
  details: string;
}

const experiences: Experience[] = [
  {
    role: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    dateRange: 'Jan 2021 - Present',
    responsibilities: [
      'Led the development of scalable web applications using React, Next.js, and TypeScript.',
      'Collaborated with UX/UI designers to implement responsive and accessible user interfaces.',
      'Mentored junior developers and conducted code reviews to maintain code quality.',
      'Improved application performance by 20% through code optimization and modern techniques.',
    ],
  },
  {
    role: 'Full Stack Developer',
    company: 'Innovatech Ltd.',
    dateRange: 'Jun 2018 - Dec 2020',
    responsibilities: [
      'Developed and maintained full-stack applications using Node.js, Express, and React.',
      'Designed and implemented RESTful APIs for various client projects.',
      'Worked in an Agile environment, participating in sprint planning and daily stand-ups.',
      'Contributed to database design and management using PostgreSQL and MongoDB.',
    ],
  },
  {
    role: 'Junior Web Developer',
    company: 'Web Wizards Co.',
    dateRange: 'Jul 2016 - May 2018',
    responsibilities: [
      'Assisted in developing and testing websites for small to medium-sized businesses.',
      'Gained proficiency in HTML, CSS, JavaScript, and jQuery.',
      'Learned version control with Git and collaborated on projects using GitHub.',
    ],
  },
];

const education: Education[] = [
  {
    degree: 'Master of Science in Computer Science',
    institution: 'University of Advanced Technology',
    dateRange: '2014 - 2016',
    details: 'Specialized in Software Engineering and Human-Computer Interaction. Thesis on "Efficient UI Design Patterns".',
  },
  {
    degree: 'Bachelor of Science in Information Technology',
    institution: 'State University',
    dateRange: '2010 - 2014',
    details: 'Graduated with honors. Active member of the coding club and participated in several hackathons.',
  },
];

export function ResumeSection() {
  return (
    <>
      <PageHeader
        title="My Resume"
        description="A summary of my professional experience, education, and key achievements."
      />
      <div className="container py-12 md:py-16">
        <div className="text-center mb-12">
           <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-transform hover:scale-105">
            {/* Replace with actual link to your resume PDF */}
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
          <div className="space-y-0"> {/* Adjusted space-y for timeline look */}
            {experiences.map((exp, index) => (
              <TimelineItem
                key={exp.company}
                title={exp.role}
                subtitle={exp.company}
                dateRange={exp.dateRange}
                description={exp.responsibilities}
                icon={<Briefcase size={18} />}
                isLast={index === experiences.length - 1}
              />
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section>
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-10 flex items-center">
            <GraduationCap className="mr-4 h-8 w-8 text-accent" />
            Education
          </h2>
          <div className="space-y-0"> {/* Adjusted space-y for timeline look */}
            {education.map((edu, index) => (
              <TimelineItem
                key={edu.institution}
                title={edu.degree}
                subtitle={edu.institution}
                dateRange={edu.dateRange}
                description={edu.details}
                icon={<GraduationCap size={18} />}
                isLast={index === education.length - 1}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

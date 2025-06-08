import { PageHeader } from '@/components/page-header';
import { SkillItem, type Skill } from '@/components/skill-item';
import { Code, Database, Palette, Server, Smartphone, Cloud } from 'lucide-react'; // Example icons

const skillsData: Skill[] = [
  // Frontend
  { name: 'HTML5', proficiency: 95, Icon: Code, category: 'Frontend' },
  { name: 'CSS3 &amp; SASS', proficiency: 90, Icon: Palette, category: 'Frontend' },
  { name: 'JavaScript (ES6+)', proficiency: 92, Icon: Code, category: 'Frontend' },
  { name: 'TypeScript', proficiency: 88, Icon: Code, category: 'Frontend' },
  { name: 'React &amp; Next.js', proficiency: 90, Icon: Smartphone, category: 'Frontend' },
  { name: 'Vue.js', proficiency: 80, Icon: Smartphone, category: 'Frontend' },
  { name: 'Tailwind CSS', proficiency: 95, Icon: Palette, category: 'Frontend' },
  
  // Backend
  { name: 'Node.js &amp; Express', proficiency: 85, Icon: Server, category: 'Backend' },
  { name: 'Python &amp; Django/Flask', proficiency: 75, Icon: Server, category: 'Backend' },
  { name: 'RESTful APIs', proficiency: 90, Icon: Code, category: 'Backend' },
  { name: 'GraphQL', proficiency: 70, Icon: Code, category: 'Backend' },

  // Databases
  { name: 'SQL (PostgreSQL, MySQL)', proficiency: 80, Icon: Database, category: 'Databases' },
  { name: 'NoSQL (MongoDB, Firebase)', proficiency: 78, Icon: Database, category: 'Databases' },

  // DevOps &amp; Tools
  { name: 'Git &amp; GitHub', proficiency: 95, Icon: Code, category: 'Tools' },
  { name: 'Docker', proficiency: 70, Icon: Server, category: 'Tools' },
  { name: 'CI/CD (GitHub Actions)', proficiency: 65, Icon: Cloud, category: 'Tools' },
  { name: 'Agile Methodologies', proficiency: 85, Icon: Code, category: 'Tools' },
  
  // Design
  { name: 'Figma', proficiency: 75, Icon: Palette, category: 'Design' },
  { name: 'Responsive Design', proficiency: 95, Icon: Smartphone, category: 'Design' },
  { name: 'UX/UI Principles', proficiency: 80, Icon: Palette, category: 'Design' },
];

const skillCategories = ['Frontend', 'Backend', 'Databases', 'Tools', 'Design'];

export default function SkillsPage() {
  return (
    <>
      <PageHeader
        title="Skills &amp; Expertise"
        description="A showcase of my technical skills and proficiency levels across various domains."
      />
      <div className="container py-12 md:py-16">
        {skillCategories.map(category => (
          <section key={category} className="mb-12">
            <h2 className="font-headline text-3xl font-bold text-primary mb-8 border-b-2 border-accent pb-2">
              {category}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {skillsData
                .filter(skill => skill.category === category)
                .map((skill) => (
                  <SkillItem key={skill.name} skill={skill} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}


import { PageHeader } from '@/components/page-header';
import { SkillItem, type Skill } from '@/components/skill-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Database, Palette, Server, Smartphone, Cloud, Brain, BarChartBig } from 'lucide-react'; // Added Brain and BarChartBig for potential use

const skillsData: Skill[] = [
  // Frontend
  { name: 'HTML5', proficiency: 95, Icon: Code, category: 'Frontend' },
  { name: 'CSS3 & SASS', proficiency: 90, Icon: Palette, category: 'Frontend' },
  { name: 'JavaScript (ES6+)', proficiency: 92, Icon: Code, category: 'Frontend' },
  { name: 'TypeScript', proficiency: 88, Icon: Code, category: 'Frontend' },
  { name: 'React & Next.js', proficiency: 90, Icon: Smartphone, category: 'Frontend' },
  { name: 'Vue.js', proficiency: 80, Icon: Smartphone, category: 'Frontend' },
  { name: 'Tailwind CSS', proficiency: 95, Icon: Palette, category: 'Frontend' },
  
  // Backend
  { name: 'Node.js & Express', proficiency: 85, Icon: Server, category: 'Backend' },
  { name: 'Python & Django/Flask', proficiency: 75, Icon: Server, category: 'Backend' },
  { name: 'RESTful APIs', proficiency: 90, Icon: Code, category: 'Backend' },
  { name: 'GraphQL', proficiency: 70, Icon: Code, category: 'Backend' },

  // Databases
  { name: 'SQL (PostgreSQL, MySQL)', proficiency: 80, Icon: Database, category: 'Databases' },
  { name: 'NoSQL (MongoDB, Firebase)', proficiency: 78, Icon: Database, category: 'Databases' },

  // DevOps & Tools
  { name: 'Git & GitHub', proficiency: 95, Icon: Code, category: 'Tools' },
  { name: 'Docker', proficiency: 70, Icon: Server, category: 'Tools' },
  { name: 'CI/CD (GitHub Actions)', proficiency: 65, Icon: Cloud, category: 'Tools' },
  { name: 'Agile Methodologies', proficiency: 85, Icon: Brain, category: 'Tools' }, // Using Brain icon
  
  // Design
  { name: 'Figma', proficiency: 75, Icon: Palette, category: 'Design' },
  { name: 'Responsive Design', proficiency: 95, Icon: Smartphone, category: 'Design' },
  { name: 'UX/UI Principles', proficiency: 80, Icon: Palette, category: 'Design' },
];

// Define icons for categories, ensuring they exist in lucide-react
const categoryIcons: Record<string, LucideIcon> = {
  'Frontend': Smartphone,
  'Backend': Server,
  'Databases': Database,
  'Tools': BarChartBig, // Using BarChartBig for Tools
  'Design': Palette,
};

type LucideIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;


const skillCategories = ['Frontend', 'Backend', 'Databases', 'Tools', 'Design'];

export default function SkillsPage() {
  return (
    <>
      <PageHeader
        title="Skills & Expertise"
        description="A showcase of my technical skills and proficiency levels across various domains."
      />
      <div className="container py-12 md:py-16">
        <div className="space-y-12">
          {skillCategories.map(category => {
            const CategoryIcon = categoryIcons[category] || Code; // Default to Code icon if not found
            return (
              <Card key={category} className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl md:text-3xl text-primary flex items-center">
                    <CategoryIcon className="h-7 w-7 mr-3 text-accent" />
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {skillsData
                      .filter(skill => skill.category === category)
                      .map((skill) => (
                        <SkillItem key={skill.name} skill={skill} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}

    
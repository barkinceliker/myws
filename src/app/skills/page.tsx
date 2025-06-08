
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Database, Palette, Server, Smartphone, Cloud, Brain, BarChartBig } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Skill {
  name: string;
  proficiency: number; // 0-100
  Icon?: LucideIcon;
  category: string;
}

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
  { name: 'Agile Methodologies', proficiency: 85, Icon: Brain, category: 'Tools' },
  
  // Design
  { name: 'Figma', proficiency: 75, Icon: Palette, category: 'Design' },
  { name: 'Responsive Design', proficiency: 95, Icon: Smartphone, category: 'Design' },
  { name: 'UX/UI Principles', proficiency: 80, Icon: Palette, category: 'Design' },
];

const categoryIcons: Record<string, LucideIcon> = {
  'Frontend': Smartphone,
  'Backend': Server,
  'Databases': Database,
  'Tools': BarChartBig,
  'Design': Palette,
};

const skillCategories = ['Frontend', 'Backend', 'Databases', 'Tools', 'Design'];

export default function SkillsPage() {
  return (
    <>
      <PageHeader
        title="Skills & Expertise Dashboard"
        description="A visual overview of my technical skills and proficiency levels across various domains."
      />
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {skillCategories.map(category => {
            const CategoryIcon = categoryIcons[category] || Code;
            const categorySkills = skillsData.filter(skill => skill.category === category);
            return (
              <Card key={category} className="shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl text-primary flex items-center">
                    <CategoryIcon className="h-7 w-7 mr-3 text-accent" />
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-6">
                  {categorySkills.map((skill) => {
                    const SkillIcon = skill.Icon || Code;
                    return (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <SkillIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                            <span className="font-medium text-foreground/90">{skill.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-primary">{skill.proficiency}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5 dark:bg-secondary/50">
                          <div
                            className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${skill.proficiency}%` }}
                            aria-valuenow={skill.proficiency}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            role="progressbar"
                            aria-label={`${skill.name} proficiency`}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}

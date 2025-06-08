
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Database, Palette, Server, Smartphone, Cloud, Brain, BarChartBig, Award, Briefcase } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import type { SkillExperience } from '@/types';

interface SkillDisplayItem {
  name: string;
  proficiency: number; // 0-100 (for skills) or null (for experiences)
  Icon?: LucideIcon;
  category: string;
  type: 'skill' | 'experience';
  // Experience specific
  company?: string;
  role?: string;
  dateRange?: string;
  description?: string; // Main description
  details?: string[];   // List of responsibilities/details
}

const categoryIcons: Record<string, LucideIcon> = {
  'Frontend': Smartphone,
  'Backend': Server,
  'Databases': Database,
  'DevOps & Tools': Cloud, // Merged "Tools" into this for better grouping
  'Design': Palette,
  'Programming Languages': Code,
  'Frameworks & Libraries': BarChartBig,
  'Soft Skills': Brain,
  'Professional Experience': Briefcase, // For experience items
  'Other': Award, // Default
};

async function getSkillsAndExperience(): Promise<SkillDisplayItem[]> {
  if (!app) {
    console.error("Firebase app is not initialized for Skills page.");
    return [];
  }
  const db = getFirestore(app);
  const itemsCollection = collection(db, 'skillsExperience');
  // Order by type (skills first) then by name or a potential order field
  const q = query(itemsCollection, orderBy('type'), orderBy('name')); 
  try {
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(doc => {
      const data = doc.data() as SkillExperience;
      const category = data.category || (data.type === 'experience' ? 'Professional Experience' : 'Other');
      const Icon = categoryIcons[category] || Award;
      
      return {
        name: data.name,
        proficiency: data.type === 'skill' ? (parseInt(data.level || '0', 10) || 50) : 0, // Convert level string to number if possible
        Icon: Icon,
        category: category,
        type: data.type,
        company: data.company,
        role: data.role,
        dateRange: data.dateRange,
        description: data.description,
        details: data.details,
      } as SkillDisplayItem;
    });

    // Map proficiency from named levels to numbers for skills
    return items.map(item => {
        if (item.type === 'skill' && typeof item.proficiency === 'string') { // from old level strings
            switch(item.proficiency.toLowerCase()) {
                case 'beginner': item.proficiency = 30; break;
                case 'intermediate': item.proficiency = 60; break;
                case 'advanced': item.proficiency = 85; break;
                case 'expert': item.proficiency = 100; break;
                default: item.proficiency = 50; // Default if level string is not recognized
            }
        } else if (item.type === 'skill' && typeof item.proficiency !== 'number') {
            item.proficiency = 50; // default if not a number
        }
        return item;
    });

  } catch (error) {
    console.error("Error fetching skills/experience from Firestore:", error);
    return [];
  }
}


const defaultSkills: SkillDisplayItem[] = [
  { name: 'HTML5 (Sample)', proficiency: 90, category: 'Frontend', type: 'skill' },
  { name: 'React (Sample)', proficiency: 85, category: 'Frameworks & Libraries', type: 'skill' },
];

export async function SkillsSection() {
  const items = await getSkillsAndExperience();
  const displayItems = items.length > 0 ? items : defaultSkills;

  const skills = displayItems.filter(item => item.type === 'skill');
  // const experiences = displayItems.filter(item => item.type === 'experience'); // Could be used for a separate section

  const skillCategories = Array.from(new Set(skills.map(skill => skill.category))).sort();


  return (
    <>
      <PageHeader
        title="Skills & Expertise"
        description="A visual overview of my technical skills and proficiency levels across various domains."
      />
      <div className="container py-12 md:py-16">
        {skillCategories.length === 0 && skills.length === 0 ? (
            <div className="text-center py-10">
                <p className="text-xl text-muted-foreground">No skills found. Please add some from the admin panel!</p>
            </div>
        ) : (
            skillCategories.map(category => {
            const CategoryIcon = categoryIcons[category] || Code;
            const categorySkills = skills.filter(skill => skill.category === category);
            if (categorySkills.length === 0) return null;

            return (
              <div key={category} className="mb-12">
                <h3 className="font-headline text-2xl md:text-3xl font-bold text-primary mb-8 flex items-center">
                  <CategoryIcon className="h-8 w-8 mr-3 text-accent" />
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                  {categorySkills.map((skill) => {
                    const SkillIcon = skill.Icon || categoryIcons[skill.category] || Code;
                    return (
                      <Card key={skill.name} className="shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full">
                        <CardHeader>
                          <CardTitle className="font-headline text-xl text-foreground/95 flex items-center">
                            <SkillIcon className="h-6 w-6 mr-2.5 text-muted-foreground" />
                            {skill.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-primary">{skill.proficiency}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-3 dark:bg-secondary/50">
                            <div
                              className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${skill.proficiency}%` }}
                              aria-valuenow={skill.proficiency}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              role="progressbar"
                              aria-label={`${skill.name} proficiency`}
                            ></div>
                          </div>
                          {skill.description && <p className="text-xs text-muted-foreground mt-1">{skill.description}</p>}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
        {/* Optional: Could add a section for 'experiences' here if needed */}
      </div>
    </>
  );
}

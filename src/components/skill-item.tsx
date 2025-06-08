
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';

export interface Skill {
  name: string;
  proficiency: number; // 0-100
  Icon?: LucideIcon; // Optional icon for the skill
  category: string;
}

interface SkillItemProps {
  skill: Skill;
}

export function SkillItem({ skill }: SkillItemProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium font-headline">{skill.name}</CardTitle>
        {skill.Icon && <skill.Icon className="h-6 w-6 text-accent" />}
      </CardHeader>
      <CardContent className="flex flex-col flex-grow justify-between">
        <div>
          <Progress value={skill.proficiency} aria-label={`${skill.name} proficiency: ${skill.proficiency}%`} className="h-3 mb-2" />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">Proficiency</span>
          <span className="text-sm font-semibold text-primary">{skill.proficiency}%</span>
        </div>
      </CardContent>
    </Card>
  );
}

    
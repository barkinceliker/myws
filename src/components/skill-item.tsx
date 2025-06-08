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
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium font-headline">{skill.name}</CardTitle>
        {skill.Icon && <skill.Icon className="h-6 w-6 text-accent" />}
      </CardHeader>
      <CardContent>
        <Progress value={skill.proficiency} aria-label={`${skill.name} proficiency: ${skill.proficiency}%`} className="h-3 mb-1" />
        <p className="text-xs text-muted-foreground">{skill.proficiency}% Proficient</p>
      </CardContent>
    </Card>
  );
}

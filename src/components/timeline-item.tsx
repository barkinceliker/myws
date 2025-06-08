"use client";

import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TimelineItemProps {
  title: string;
  subtitle: string;
  dateRange: string;
  description: string | string[];
  isLast?: boolean;
  icon?: React.ReactNode;
}

export function TimelineItem({ title, subtitle, dateRange, description, icon }: TimelineItemProps) {
  const descriptions = Array.isArray(description) ? description : [description];

  return (
    <div className="relative pl-10 pb-8 group">
      {/* Timeline Dot and Icon */}
      <div className="absolute left-0 top-1.5 flex items-center justify-center w-8 h-8 bg-primary rounded-full text-primary-foreground shadow-md transition-transform duration-300 group-hover:scale-110">
        {icon || <span className="text-sm font-semibold"></span>}
      </div>
      {/* Timeline Line (conditionally rendered except for the last item) */}
      <div className="absolute left-4 top-10 bottom-0 w-px bg-border group-last:hidden"></div>
      
      <Card className="ml-4 shadow-lg transition-shadow duration-300 hover:shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1">
            <CardTitle className="font-headline text-xl md:text-2xl text-primary">{title}</CardTitle>
            <span className="text-sm text-muted-foreground mt-1 sm:mt-0">{dateRange}</span>
          </div>
          <CardDescription className="text-md font-semibold text-accent">{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          {descriptions.length > 1 ? (
            <ul className="list-disc list-outside pl-5 space-y-2 text-foreground/90">
              {descriptions.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>
          ) : (
            <p className="text-foreground/90 leading-relaxed">{descriptions[0]}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

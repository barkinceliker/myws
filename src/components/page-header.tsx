import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function PageHeader({ title, description, className, titleClassName, descriptionClassName, ...props }: PageHeaderProps) {
  return (
    <div className={cn("py-12 md:py-16 text-center bg-secondary/50", className)} {...props}>
      <div className="container">
        <h1 className={cn("font-headline text-4xl md:text-5xl font-bold text-primary mb-4", titleClassName)}>
          {title}
        </h1>
        {description && (
          <p className={cn("text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto", descriptionClassName)}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

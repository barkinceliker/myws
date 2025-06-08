
"use client"; // Mark as a Client Component

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarDays } from 'lucide-react';
import type { BlogPost } from '@/types'; // Import the updated BlogPost type

interface BlogPostItemProps {
  post: BlogPost;
}

export function BlogPostItem({ post }: BlogPostItemProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <Link href={`/blog/${post.slug}`} className="group">
          <CardTitle className="font-headline text-2xl group-hover:text-accent transition-colors">{post.title}</CardTitle>
        </Link>
        <div className="flex items-center text-sm text-muted-foreground mt-2">
          <CalendarDays className="h-4 w-4 mr-2" />
          <span>{post.publicationDate}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-base leading-relaxed">{post.excerpt || 'Read more to see the content...'}</CardDescription>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="link" asChild className="text-accent hover:text-accent/80 p-0">
          <Link href={`/blog/${post.slug}`}>
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

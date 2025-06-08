import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Sample data - in a real app, this would come from a CMS or database
const blogPosts = {
  'mastering-react-hooks': {
    title: 'Mastering React Hooks: A Deep Dive',
    date: 'November 15, 2023',
    author: '[Your Name]',
    tags: ['React', 'JavaScript', 'Web Development'],
    imageUrl: 'https://placehold.co/1200x600.png',
    imageHint: 'code screen',
    content: `
      <p class="text-lg leading-relaxed mb-6">React Hooks have revolutionized how we write components, offering a more direct API to React’s features. This post will take you on a deep dive into some of the most commonly used hooks and how to leverage them effectively.</p>
      <h2 class="font-headline text-2xl font-semibold mt-8 mb-4">Understanding useState</h2>
      <p class="text-lg leading-relaxed mb-6">The <code>useState</code> hook is fundamental for adding state to functional components. It returns a stateful value and a function to update it. We'll explore common patterns and pitfalls.</p>
      <pre class="bg-muted p-4 rounded-md overflow-x-auto text-sm mb-6"><code class="font-code">
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    &lt;div&gt;
      &lt;p&gt;You clicked {count} times&lt;/p&gt;
      &lt;button onClick={() => setCount(count + 1)}&gt;
        Click me
      &lt;/button&gt;
    &lt;/div&gt;
  );
}
      </code></pre>
      <h2 class="font-headline text-2xl font-semibold mt-8 mb-4">Side Effects with useEffect</h2>
      <p class="text-lg leading-relaxed mb-6"><code>useEffect</code> lets you perform side effects in function components. This includes data fetching, subscriptions, or manually changing the DOM. We'll discuss its dependency array and cleanup functions.</p>
      <h2 class="font-headline text-2xl font-semibold mt-8 mb-4">Sharing State with useContext</h2>
      <p class="text-lg leading-relaxed mb-6"><code>useContext</code> provides a way to pass data through the component tree without having to pass props down manually at every level. It's perfect for theming or global state.</p>
      <h2 class="font-headline text-2xl font-semibold mt-8 mb-4">Building Custom Hooks</h2>
      <p class="text-lg leading-relaxed mb-6">Custom Hooks allow you to extract component logic into reusable functions. This is a powerful way to share stateful logic between components.</p>
      <p class="text-lg leading-relaxed mb-6">By mastering these hooks, you can write more efficient, readable, and maintainable React applications. Stay tuned for more advanced topics!</p>
    `,
  },
  'tailwind-css-best-practices': {
    title: 'Tailwind CSS Best Practices for Scalable Projects',
    date: 'October 28, 2023',
    author: '[Your Name]',
    tags: ['Tailwind CSS', 'CSS', 'Frontend'],
    imageUrl: 'https://placehold.co/1200x600.png',
    imageHint: 'css code',
    content: `
      <p class="text-lg leading-relaxed mb-6">Tailwind CSS is a utility-first CSS framework that has gained immense popularity. However, without proper practices, it can lead to cluttered templates. This post covers best practices for scalable projects.</p>
      <h2 class="font-headline text-2xl font-semibold mt-8 mb-4">Configuration is Key</h2>
      <p class="text-lg leading-relaxed mb-6">Leverage Tailwind's <code>tailwind.config.js</code> to customize your design system. Define your color palette, spacing scale, fonts, and breakpoints to ensure consistency.</p>
      <h2 class="font-headline text-2xl font-semibold mt-8 mb-4">Component-Based Styling with @apply</h2>
      <p class="text-lg leading-relaxed mb-6">For repeated utility combinations, use the <code>@apply</code> directive in your CSS to create component classes. This keeps your HTML clean while still benefiting from Tailwind's utilities.</p>
      <h2 class="font-headline text-2xl font-semibold mt-8 mb-4">Purging Unused Styles</h2>
      <p class="text-lg leading-relaxed mb-6">Ensure your production builds are optimized by configuring PurgeCSS (or Tailwind's built-in JIT mode) to remove unused styles, resulting in smaller file sizes.</p>
      <p class="text-lg leading-relaxed mb-6">Following these practices will help you build maintainable and scalable applications with Tailwind CSS.</p>
    `,
  },
   'introduction-to-serverless-architecture': {
    title: 'An Introduction to Serverless Architecture',
    date: 'September 05, 2023',
    author: '[Your Name]',
    tags: ['Serverless', 'Cloud Computing', 'Architecture'],
    imageUrl: 'https://placehold.co/1200x600.png',
    imageHint: 'cloud infrastructure',
    content: `
      <p class="text-lg leading-relaxed mb-6">Serverless architecture allows developers to build and run applications without managing servers. This post introduces the core concepts.</p>
      <h2 class="font-headline text-2xl font-semibold mt-8 mb-4">What is Serverless?</h2>
      <p class="text-lg leading-relaxed mb-6">Despite the name, servers are still involved. However, the cloud provider manages the server infrastructure, and developers only focus on writing code for functions that respond to events.</p>
      <h2 class="font-headline text-2xl font-semibold mt-8 mb-4">Benefits of Serverless</h2>
      <p class="text-lg leading-relaxed mb-6">Key benefits include cost-effectiveness (pay-per-use), scalability, and reduced operational overhead.</p>
      <h2 class="font-headline text-2xl font-semibold mt-8 mb-4">Use Cases</h2>
      <p class="text-lg leading-relaxed mb-6">Serverless is great for APIs, data processing, IoT backends, and more. Popular platforms include AWS Lambda, Google Cloud Functions, and Azure Functions.</p>
      <p class="text-lg leading-relaxed mb-6">Serverless is transforming how applications are built and deployed in the cloud.</p>
    `,
  },
  'the-art-of-api-design': {
    title: 'The Art of API Design: Principles and Patterns',
    date: 'August 20, 2023',
    author: '[Your Name]',
    tags: ['API Design', 'Backend', 'Software Engineering'],
    imageUrl: 'https://placehold.co/1200x600.png',
    imageHint: 'api data',
    content: `
      <p class="text-lg leading-relaxed mb-6">Designing a good API is crucial for the success of any software product. This post explores key principles and patterns.</p>
      <h2 class="font-headline text-2xl font-semibold mt-8 mb-4">Simplicity and Intuitiveness</h2>
      <p class="text-lg leading-relaxed mb-6">APIs should be easy to understand and use. Follow consistent naming conventions and provide clear documentation.</p>
      <h2 class="font-headline text-2xl font-semibold mt-8 mb-4">RESTful Conventions</h2>
      <p class="text-lg leading-relaxed mb-6">For web APIs, adhering to REST principles (using HTTP methods correctly, proper status codes) is standard practice.</p>
      <h2 class="font-headline text-2xl font-semibold mt-8 mb-4">Versioning and Error Handling</h2>
      <p class="text-lg leading-relaxed mb-6">Plan for API evolution with a clear versioning strategy. Implement comprehensive error handling with informative messages.</p>
      <p class="text-lg leading-relaxed mb-6">Good API design is an art that balances functionality with usability.</p>
    `,
  }
};

type PostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }));
}

export default function BlogPostPage({ params }: PostPageProps) {
  const { slug } = params;
  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="container py-12 text-center">
        <h1 className="font-headline text-4xl text-destructive">Post not found</h1>
        <p className="mt-4 text-lg">The blog post you are looking for does not exist.</p>
        <Button asChild variant="link" className="mt-6">
            <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader title={post.title} />
      <div className="container py-12 md:py-16 max-w-4xl mx-auto">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <div className="mb-8">
            <div className="flex items-center text-muted-foreground mb-4">
              <CalendarDays className="h-5 w-5 mr-2" />
              <span>Published on {post.date} by {post.author}</span>
            </div>
            {post.tags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
            {post.imageUrl && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg mb-8">
                    <Image src={post.imageUrl} alt={post.title} fill className="object-cover" data-ai-hint={post.imageHint || "blog header"}/>
                </div>
            )}
          </div>
          
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
        <div className="mt-12 text-center">
            <Button asChild variant="outline" className="transition-colors hover:bg-accent hover:text-accent-foreground">
                <Link href="/blog">Back to Blog Overview</Link>
            </Button>
        </div>
      </div>
    </>
  );
}

import { PageHeader } from '@/components/page-header';
import { BlogPostItem, type BlogPost } from '@/components/blog-post-item';

const blogPostsData: BlogPost[] = [
  {
    id: '1',
    slug: 'mastering-react-hooks',
    title: 'Mastering React Hooks: A Deep Dive',
    excerpt: 'Explore the power of React Hooks and learn how to write cleaner, more reusable component logic. This post covers useState, useEffect, useContext, and custom hooks.',
    publicationDate: 'November 15, 2023',
    tags: ['React', 'JavaScript', 'Web Development'],
  },
  {
    id: '2',
    slug: 'tailwind-css-best-practices',
    title: 'Tailwind CSS Best Practices for Scalable Projects',
    excerpt: 'Discover tips and tricks for effectively using Tailwind CSS in large applications, including configuration, component-based styling, and maintainability.',
    publicationDate: 'October 28, 2023',
    tags: ['Tailwind CSS', 'CSS', 'Frontend'],
  },
  {
    id: '3',
    slug: 'introduction-to-serverless-architecture',
    title: 'An Introduction to Serverless Architecture',
    excerpt: 'Learn the fundamentals of serverless computing, its benefits, use cases, and how to get started with popular platforms like AWS Lambda or Google Cloud Functions.',
    publicationDate: 'September 05, 2023',
    tags: ['Serverless', 'Cloud Computing', 'Architecture'],
  },
   {
    id: '4',
    slug: 'the-art-of-api-design',
    title: 'The Art of API Design: Principles and Patterns',
    excerpt: 'Delve into the key principles of designing robust, intuitive, and maintainable APIs. We cover RESTful conventions, versioning, and error handling.',
    publicationDate: 'August 20, 2023',
    tags: ['API Design', 'Backend', 'Software Engineering'],
  },
];

export function BlogSection() {
  return (
    <>
      <PageHeader
        title="My Blog"
        description="Insights, tutorials, and reflections on technology, design, and development."
      />
      <div className="container py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPostsData.map((post) => (
            <BlogPostItem key={post.id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}


import { PageHeader } from '@/components/page-header';
import { BlogPostItem } from '@/components/blog-post-item';
import type { BlogPost } from '@/types';
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { format } from 'date-fns';

async function getBlogPosts(): Promise<BlogPost[]> {
  if (!app) {
    console.warn("Firebase app is not initialized for Blog page. Returning empty array.");
    return [];
  }
  const db = getFirestore(app);
  const postsCollection = collection(db, 'blogPosts');
  const q = query(postsCollection, orderBy('createdAt', 'desc'));
  try {
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => {
      const data = doc.data() as {
        slug?: string;
        title?: string;
        excerpt?: string;
        content?: string;
        publicationDate?: string | Timestamp;
        author?: string;
        tags?: string[];
        imageUrl?: string;
        imageHint?: string;
        createdAt?: Timestamp;
        updatedAt?: Timestamp;
      };
      
      let formattedPublicationDate = 'Date not set';
      if (data.publicationDate) {
        if (typeof data.publicationDate === 'string') {
          try {
            formattedPublicationDate = format(new Date(data.publicationDate), 'MMMM dd, yyyy');
          } catch (e) {
             console.warn(`Invalid date string for post ${doc.id}: ${data.publicationDate}. Error: ${e}`);
             formattedPublicationDate = data.publicationDate; 
          }
        } else if (data.publicationDate instanceof Timestamp) {
          formattedPublicationDate = format(data.publicationDate.toDate(), 'MMMM dd, yyyy');
        }
      } else if (data.createdAt) {
         formattedPublicationDate = format(data.createdAt.toDate(), 'MMMM dd, yyyy');
      }

      const excerpt = data.excerpt || (data.content ? data.content.substring(0, 150) + (data.content.length > 150 ? '...' : '') : 'No excerpt available.');

      return {
        id: doc.id,
        slug: data.slug || doc.id,
        title: data.title || 'Untitled Post',
        excerpt: excerpt,
        content: data.content || '',
        publicationDate: formattedPublicationDate,
        author: data.author || 'Unknown Author',
        tags: Array.isArray(data.tags) ? data.tags : [],
        imageUrl: data.imageUrl || 'https://placehold.co/1200x600.png',
        imageHint: data.imageHint || 'blog header',
        createdAt: data.createdAt?.toDate().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString(),
      };
    });
    return posts;
  } catch (error) {
    console.error("Error fetching blog posts from Firestore:", error);
    return [];
  }
}

const defaultBlogPosts: BlogPost[] = [
  {
    id: 'fallback-1',
    slug: 'fallback-post',
    title: 'Sample Blog Post (Fallback)',
    excerpt: 'Failed to load blog posts from the database. This is a sample post.',
    publicationDate: 'January 01, 2024',
    tags: ['Sample'],
    author: 'Default Author',
    content: 'This is the default content for the fallback blog post.',
    imageUrl: 'https://placehold.co/1200x600.png',
    // createdAt and updatedAt are optional strings, can be omitted
  },
];


export async function BlogSection() {
  const blogPostsData = await getBlogPosts();
  const displayPosts = blogPostsData.length > 0 ? blogPostsData : defaultBlogPosts;

  return (
    <>
      <PageHeader
        title="My Blog"
        description="Insights, tutorials, and reflections on technology, design, and development."
      />
      <div className="container py-12 md:py-16">
         {displayPosts.length === 0 && !blogPostsData.length ? (
             <div className="text-center py-10">
                <p className="text-xl text-muted-foreground">No blog posts found yet. Stay tuned or add some from the admin panel!</p>
            </div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPosts.map((post) => (
                <BlogPostItem key={post.id} post={post} />
            ))}
            </div>
        )}
      </div>
    </>
  );
}
// Exporting default for the page route
export default BlogSection;

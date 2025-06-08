
import { PageHeader } from '@/components/page-header';
import { BlogPostItem } from '@/components/blog-post-item';
import type { BlogPost } from '@/types'; // Ensure BlogPost type includes id and slug
import { getFirestore, collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import { format } from 'date-fns'; // For formatting dates

async function getBlogPosts(): Promise<BlogPost[]> {
  if (!app) {
    console.error("Firebase app is not initialized for Blog page.");
    return [];
  }
  const db = getFirestore(app);
  const postsCollection = collection(db, 'blogPosts');
  const q = query(postsCollection, orderBy('createdAt', 'desc')); // Order by creation date
  try {
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map(doc => {
      const data = doc.data() as Omit<BlogPost, 'id' | 'publicationDate'> & { createdAt?: Timestamp, publicationDate?: string | Timestamp };
      let formattedPublicationDate = 'Date not set';
      if (data.publicationDate) {
        if (typeof data.publicationDate === 'string') {
           // Assuming it's 'yyyy-MM-dd' from form
          try {
            formattedPublicationDate = format(new Date(data.publicationDate), 'MMMM dd, yyyy');
          } catch (e) {
             console.warn(`Invalid date string for post ${doc.id}: ${data.publicationDate}`);
             formattedPublicationDate = data.publicationDate; // show as is if invalid
          }
        } else if (data.publicationDate instanceof Timestamp) {
          formattedPublicationDate = format(data.publicationDate.toDate(), 'MMMM dd, yyyy');
        }
      } else if (data.createdAt) {
         formattedPublicationDate = format(data.createdAt.toDate(), 'MMMM dd, yyyy');
      }

      return {
        id: doc.id,
        ...data,
        slug: data.slug || doc.id, // Fallback slug if not present
        publicationDate: formattedPublicationDate,
        tags: Array.isArray(data.tags) ? data.tags : [],
      } as BlogPost;
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

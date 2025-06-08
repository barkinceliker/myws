
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getFirestore, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import type { BlogPost } from '@/types';
import { format } from 'date-fns';

type PostPageProps = {
  params: {
    slug: string;
  };
};

async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!app) {
    console.error("Firebase app is not initialized for individual blog post page.");
    return null;
  }
  const db = getFirestore(app);
  const postsCollection = collection(db, 'blogPosts');
  const q = query(postsCollection, where('slug', '==', slug));
  
  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log(`No blog post found with slug: ${slug}`);
      return null;
    }
    const doc = querySnapshot.docs[0];
    const data = doc.data() as Omit<BlogPost, 'id' | 'publicationDate'> & { createdAt?: Timestamp, publicationDate?: string | Timestamp };
    
    let formattedPublicationDate = 'Date not set';
    if (data.publicationDate) {
      if (typeof data.publicationDate === 'string') {
        try {
          formattedPublicationDate = format(new Date(data.publicationDate), 'MMMM dd, yyyy');
        } catch(e) {
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
      publicationDate: formattedPublicationDate,
      tags: Array.isArray(data.tags) ? data.tags : [],
    } as BlogPost;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}

// export async function generateStaticParams() {
//   if (!app) return [];
//   const db = getFirestore(app);
//   const postsCollection = collection(db, 'blogPosts');
//   const snapshot = await getDocs(postsCollection);
//   return snapshot.docs.map(doc => ({
//     slug: doc.data().slug || doc.id,
//   }));
// }
// Disabling generateStaticParams for now to simplify and ensure dynamic fetching works first.
// Re-enable with proper slug handling if static generation is a priority.


export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <>
        <PageHeader title="Post Not Found" />
        <div className="container py-12 text-center">
          <p className="mt-4 text-lg text-muted-foreground">The blog post you are looking for (slug: {slug}) does not exist or could not be loaded.</p>
          <Button asChild variant="outline" className="mt-8">
            <Link href="/blog"> <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog Overview</Link>
          </Button>
        </div>
      </>
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
              <span>
                Published on {post.publicationDate}
                {post.author && ` by ${post.author}`}
              </span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="shadow-sm">{tag}</Badge>
                ))}
              </div>
            )}
            {post.imageUrl && (
                <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-lg mb-8">
                    <Image 
                        src={post.imageUrl} 
                        alt={post.title} 
                        fill 
                        className="object-cover" 
                        data-ai-hint={post.imageHint || "blog header"}
                        priority
                    />
                </div>
            )}
          </div>
          
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
        <div className="mt-12 text-center">
            <Button asChild variant="outline" className="transition-colors hover:bg-accent hover:text-accent-foreground shadow-md">
                <Link href="/blog"> <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog Overview</Link>
            </Button>
        </div>
      </div>
    </>
  );
}

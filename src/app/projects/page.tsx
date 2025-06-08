
import { PageHeader } from '@/components/page-header';
import { ProjectCard } from '@/components/project-card';
import type { Project } from '@/types'; // Ensure Project type includes id
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { app } from '@/lib/firebase';

async function getProjects(): Promise<Project[]> {
  if (!app) {
    console.error("Firebase app is not initialized for Projects page.");
    return [];
  }
  const db = getFirestore(app);
  const projectsCollection = collection(db, 'projects');
  // Order by 'createdAt' in descending order to show newest projects first
  // Make sure you have an index for 'createdAt' in Firestore if you get an error.
  const q = query(projectsCollection, orderBy('createdAt', 'desc'));
  try {
    const querySnapshot = await getDocs(q);
    const projects = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Project, 'id'>),
    }));
    return projects;
  } catch (error) {
    console.error("Error fetching projects from Firestore:", error);
    return []; // Return empty array on error
  }
}

const defaultProjects: Project[] = [
   {
    id: 'fallback-1',
    title: 'E-commerce Platform (Sample)',
    description: 'A full-featured e-commerce platform. (Data from Firestore failed to load)',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'online store',
    tags: ['Next.js', 'React'],
  },
];

export async function ProjectsSection() {
  const projectsData = await getProjects();
  const displayProjects = projectsData.length > 0 ? projectsData : defaultProjects;


  return (
    <>
      <PageHeader
        title="My Projects"
        description="A collection of projects I've worked on, showcasing my skills and passion for development."
      />
      <div className="container py-12 md:py-16">
        {displayProjects.length === 0 && !projectsData.length ? ( // Only show if default is also empty (which it isn't now)
             <div className="text-center py-10">
                <p className="text-xl text-muted-foreground">No projects found. Add some from the admin panel!</p>
            </div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
            </div>
        )}
      </div>
    </>
  );
}

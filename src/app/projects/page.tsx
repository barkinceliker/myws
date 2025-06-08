import { PageHeader } from '@/components/page-header';
import { ProjectCard, type Project } from '@/components/project-card';

const projectsData: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform built with Next.js, Stripe, and a modern backend. Includes product listings, cart functionality, and user authentication.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'online store',
    tags: ['Next.js', 'React', 'TypeScript', 'Stripe', 'Tailwind CSS'],
    liveDemoUrl: '#',
    repoUrl: '#',
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'A collaborative task management application designed for teams. Features include drag-and-drop boards, real-time updates, and notification systems.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'productivity app',
    tags: ['React', 'Firebase', 'Node.js', 'Material UI'],
    liveDemoUrl: '#',
  },
  {
    id: '3',
    title: 'Personal Portfolio Website',
    description: 'This very portfolio! Built to showcase my skills and projects using Next.js and ShadCN UI components for a sleek, professional look.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'portfolio website',
    tags: ['Next.js', 'ShadCN UI', 'Tailwind CSS', 'TypeScript'],
    repoUrl: '#',
  },
  {
    id: '4',
    title: 'Weather Dashboard',
    description: 'A responsive weather dashboard that provides real-time weather information for any city using a third-party API. Features dynamic charts and intuitive UI.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'weather forecast',
    tags: ['Vue.js', 'OpenWeatherMap API', 'Chart.js', 'Bootstrap'],
    liveDemoUrl: '#',
    repoUrl: '#',
  },
];

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="My Projects"
        description="A collection of projects I've worked on, showcasing my skills and passion for development."
      />
      <div className="container py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </>
  );
}

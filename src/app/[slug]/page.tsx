import { notFound } from 'next/navigation';
import Link from 'next/link';
import FigmaEmbed from '@/components/FigmaEmbed';
import { prisma } from '@/lib/db';

type Project = {
  id: string;
  name: string;
  slug: string;
  figmaUrl: string;
  clientLabel: string;
  createdAt: Date;
  deletedAt: Date | null;
};

async function getProject(slug: string): Promise<Project | null> {
  try {
    const project = await prisma.project.findUnique({
      where: { 
        slug: slug,
        deletedAt: null
      }
    });
    
    return project;
  } catch (error) {
    console.error('Error reading project:', error);
    return null;
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  
  if (!project) {
    notFound();
  }

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      {/* Navigation button */}
      <div className="absolute top-4 left-4 z-20">
        <Link
          href="/projects"
          className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 rounded-md text-sm hover:bg-white transition-colors shadow-sm border"
        >
          ← All Projects
        </Link>
      </div>
      
      {/* Full-screen Figma embed */}
      <FigmaEmbed 
        url={project.figmaUrl}
        title={project.name}
      />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.name} | actualsize.digital`,
    description: `Interactive prototype for ${project.name}`,
  };
}
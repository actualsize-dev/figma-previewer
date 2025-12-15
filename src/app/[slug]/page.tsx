import { notFound } from 'next/navigation';
import Link from 'next/link';
import FigmaEmbed from '@/components/FigmaEmbed';
import ViewTracker from '@/components/ViewTracker';
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

export default async function ProjectPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ share?: string; from?: string }>;
}) {
  const { slug } = await params;
  const { share, from } = await searchParams;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  // Determine if we should show back button and where it should go
  // - If has ?share=token: show back button to client share view
  // - If has ?from=projects: show back button to projects (authenticated view)
  // - Otherwise (direct link): no back button (external client view)
  const showBackButton = !!(share || from);
  const backLink = share ? `/share/${share}` : '/projects';
  const backText = share ? '← Back to Projects' : '← All Projects';

  return (
    <div className="w-screen h-screen overflow-hidden relative">
      {/* Track view */}
      <ViewTracker projectId={project.id} projectSlug={project.slug} />

      {/* Navigation button - only show for authenticated or share link views */}
      {showBackButton && (
        <div className="absolute top-4 left-4 z-20">
          <Link
            href={backLink}
            className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 rounded-md text-sm hover:bg-white transition-colors shadow-sm border"
          >
            {backText}
          </Link>
        </div>
      )}

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
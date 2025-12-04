import Link from 'next/link';
import ProjectsWithGrouping from '@/components/ProjectsWithGrouping';
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

async function getProjects(): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return projects;
  } catch (error) {
    console.error('Error reading projects:', error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Projects
          </h1>
          <p className="text-gray-600">
            Browse all created prototype pages
          </p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            + Create New Project
          </Link>
          
          <Link
            href="/projects/deleted"
            className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
          >
            View Deleted Projects →
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first prototype page to get started
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create First Project
            </Link>
          </div>
        ) : (
          <ProjectsWithGrouping projects={projects.map(project => ({
            ...project,
            createdAt: project.createdAt.toISOString()
          }))} />
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'All Projects | actualsize.digital',
  description: 'Browse all created prototype pages',
};

export const dynamic = 'force-dynamic';
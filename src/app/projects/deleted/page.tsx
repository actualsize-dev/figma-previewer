import Link from 'next/link';
import DeletedProjectList from '@/components/DeletedProjectList';
import { prisma } from '@/lib/db';

type DeletedProject = {
  id: string;
  name: string;
  slug: string;
  figmaUrl: string;
  clientLabel: string;
  createdAt: Date;
  deletedAt: Date | null;
};

async function getDeletedProjects(): Promise<DeletedProject[]> {
  try {
    const deletedProjects = await prisma.project.findMany({
      where: {
        deletedAt: { not: null }
      },
      orderBy: {
        deletedAt: 'desc'
      }
    });
    
    return deletedProjects;
  } catch (error) {
    console.error('Error reading deleted projects:', error);
    return [];
  }
}

export default async function DeletedProjectsPage() {
  const deletedProjects = await getDeletedProjects();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Deleted Projects
          </h1>
          <p className="text-gray-600">
            Restore projects that have been deleted
          </p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/projects"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            ← Back to Projects
          </Link>
          
          {deletedProjects.length > 0 && (
            <p className="text-sm text-gray-500">
              {deletedProjects.length} deleted project{deletedProjects.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {deletedProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🗑️</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No deleted projects
            </h3>
            <p className="text-gray-600 mb-6">
              Projects you delete will appear here for restoration
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Projects
            </Link>
          </div>
        ) : (
          <DeletedProjectList initialDeletedProjects={deletedProjects.map(project => ({
            ...project,
            createdAt: project.createdAt.toISOString(),
            deletedAt: project.deletedAt?.toISOString() || ''
          }))} />
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Deleted Projects | actualsize.digital',
  description: 'Restore deleted prototype projects',
};

export const dynamic = 'force-dynamic';
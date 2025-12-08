import Link from 'next/link';
import DeletedProjectList from '@/components/DeletedProjectList';
import BrandingFooter from '@/components/BrandingFooter';
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Vercel-style header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop layout */}
          <div className="hidden sm:flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-semibold text-foreground hover:text-muted-foreground transition-colors">
                Figma Concierge
              </Link>
              <nav className="flex items-center space-x-2">
                <Link
                  href="/projects"
                  className="text-sm text-muted-foreground nav-link"
                >
                  Projects
                </Link>
                <Link
                  href="/clients"
                  className="text-sm text-muted-foreground nav-link"
                >
                  Clients
                </Link>
                <span className="text-sm font-medium text-foreground relative px-3 py-1.5">
                  Deleted
                  <div className="absolute bottom-[-16px] left-0 right-0 h-0.5 bg-foreground"></div>
                </span>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="btn btn-primary text-sm"
              >
                New Project
              </Link>
            </div>
          </div>

          {/* Mobile layout */}
          <div className="sm:hidden">
            {/* Top line: Figma Concierge + New Project button */}
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-xl font-semibold text-foreground hover:text-muted-foreground transition-colors">
                Figma Concierge
              </Link>
              <Link
                href="/"
                className="btn btn-primary text-sm"
              >
                New Project
              </Link>
            </div>
            {/* Bottom line: Navigation */}
            <div className="pb-4">
              <nav className="flex items-center space-x-2">
                <Link
                  href="/projects"
                  className="text-sm text-muted-foreground nav-link"
                >
                  Projects
                </Link>
                <Link
                  href="/clients"
                  className="text-sm text-muted-foreground nav-link"
                >
                  Clients
                </Link>
                <span className="text-sm font-medium text-foreground relative px-3 py-1.5">
                  Deleted
                  <div className="absolute bottom-[-20px] left-0 right-0 h-0.5 bg-foreground"></div>
                </span>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {deletedProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No deleted projects
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Projects you delete will appear here for restoration. You can always restore them later or permanently delete them.
              </p>
              <Link
                href="/projects"
                className="btn btn-subtle"
              >
                Back to Projects
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">Deleted Projects</h1>
                  <p className="text-muted-foreground mt-1">
                    Restore or permanently delete projects
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {deletedProjects.length} deleted project{deletedProjects.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <DeletedProjectList initialDeletedProjects={deletedProjects.map(project => ({
                ...project,
                createdAt: project.createdAt.toISOString(),
                deletedAt: project.deletedAt?.toISOString() || ''
              }))} />
            </div>
          )}
        </div>
      </main>

      <BrandingFooter />
    </div>
  );
}

export const metadata = {
  title: 'Deleted Projects | actualsize.digital',
  description: 'Restore deleted prototype projects',
};

export const dynamic = 'force-dynamic';
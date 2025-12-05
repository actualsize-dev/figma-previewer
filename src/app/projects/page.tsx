import Link from 'next/link';
import ProjectsWithGrouping from '@/components/ProjectsWithGrouping';
import BrandingFooter from '@/components/BrandingFooter';
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
              <nav className="flex items-center space-x-6">
                <span className="text-sm font-medium text-foreground relative">
                  Projects
                  <div className="absolute bottom-[-16px] left-0 right-0 h-0.5 bg-foreground"></div>
                </span>
                <Link
                  href="/projects/deleted"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Deleted
                </Link>
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
              <nav className="flex items-center space-x-6">
                <span className="text-sm font-medium text-foreground relative">
                  Projects
                  <div className="absolute bottom-[-20px] left-0 right-0 h-0.5 bg-foreground"></div>
                </span>
                <Link
                  href="/projects/deleted"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Deleted
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No projects yet
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Create your first Figma prototype page to get started. Transform your designs into shareable, professional presentations.
              </p>
              <Link
                href="/"
                className="btn btn-primary"
              >
                Create Your First Project
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">Projects</h1>
                  <p className="text-muted-foreground mt-1">
                    Manage your Figma prototype pages
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {projects.length} project{projects.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <ProjectsWithGrouping projects={projects.map(project => ({
                ...project,
                createdAt: project.createdAt.toISOString()
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
  title: 'All Projects | actualsize.digital',
  description: 'Browse all created prototype pages',
};

export const dynamic = 'force-dynamic';
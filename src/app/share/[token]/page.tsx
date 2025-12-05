import { notFound } from 'next/navigation';
import BrandingFooter from '@/components/BrandingFooter';
import ShareProjectCard from '@/components/ShareProjectCard';
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

type ShareLink = {
  id: string;
  token: string;
  clientLabel: string;
  expiresAt: Date | null;
  createdBy: string | null;
  createdAt: Date;
};

async function getShareLink(token: string): Promise<ShareLink | null> {
  try {
    const shareLink = await prisma.shareLink.findUnique({
      where: { token },
    });

    return shareLink;
  } catch (error) {
    console.error('Error reading share link:', error);
    return null;
  }
}

async function getProjectsByClient(clientLabel: string): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({
      where: {
        clientLabel,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return projects;
  } catch (error) {
    console.error('Error reading projects:', error);
    return [];
  }
}

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const shareLink = await getShareLink(token);

  if (!shareLink) {
    notFound();
  }

  // Check if the link has expired
  if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Link Expired
          </h1>
          <p className="text-muted-foreground">
            This share link has expired and is no longer accessible.
          </p>
        </div>
      </div>
    );
  }

  const projects = await getProjectsByClient(shareLink.clientLabel);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Simple header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-foreground">
                {shareLink.clientLabel}
              </h1>
              <span className="text-sm text-muted-foreground">
                {projects.length} project{projects.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Shared View
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
              <p className="text-muted-foreground">
                No projects are currently available for {shareLink.clientLabel}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ShareProjectCard
                  key={project.id}
                  project={{
                    ...project,
                    createdAt: project.createdAt.toISOString(),
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <BrandingFooter />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const shareLink = await getShareLink(token);

  if (!shareLink) {
    return {
      title: 'Share Link Not Found',
    };
  }

  return {
    title: `${shareLink.clientLabel} Projects | actualsize.digital`,
    description: `View Figma prototypes for ${shareLink.clientLabel}`,
  };
}

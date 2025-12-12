'use client';

import Link from 'next/link';
import FigmaThumbnail from './FigmaThumbnail';
import FigmaIcon from './FigmaIcon';

type Project = {
  id: string;
  name: string;
  slug: string;
  figmaUrl: string;
  clientLabel: string;
  createdAt: string;
};

interface ShareProjectCardProps {
  project: Project;
  shareToken?: string;
}

export default function ShareProjectCard({ project, shareToken }: ShareProjectCardProps) {
  const href = shareToken ? `/${project.slug}?share=${shareToken}` : `/${project.slug}`;

  return (
    <Link
      href={href}
      className="group block bg-card border border-border rounded-lg overflow-hidden hover:border-foreground/20 transition-all hover:shadow-md"
    >
      {/* Thumbnail */}
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <FigmaThumbnail
          figmaUrl={project.figmaUrl}
          alt={`${project.name} preview`}
          className="w-full h-full"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-foreground/80 transition-colors flex-1">
            {project.name}
          </h3>
          <FigmaIcon className="w-5 h-5 flex-shrink-0 ml-2 opacity-60" />
        </div>
        <p className="text-sm text-muted-foreground">
          {new Date(project.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <div className="mt-4 flex items-center text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors">
          View Project
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

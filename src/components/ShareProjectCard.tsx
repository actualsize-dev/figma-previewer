'use client';

import Link from 'next/link';
import FigmaThumbnail from './FigmaThumbnail';

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
}

export default function ShareProjectCard({ project }: ShareProjectCardProps) {
  return (
    <Link
      href={`/${project.slug}`}
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
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-foreground/80 transition-colors">
          {project.name}
        </h3>
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

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import ProjectsWithGrouping from './ProjectsWithGrouping';

type Project = {
  id: string;
  name: string;
  slug: string;
  figmaUrl: string;
  clientLabel?: string;
  createdAt: string;
};

interface ProjectsPageClientProps {
  projects: Project[];
}

export default function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  const searchParams = useSearchParams();
  const clientFilter = searchParams.get('client');

  return <ProjectsWithGrouping projects={projects} initialSelectedClient={clientFilter || undefined} />;
}

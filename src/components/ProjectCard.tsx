'use client';

import { useState } from 'react';
import Link from 'next/link';
import CopyLinkButton from './CopyLinkButton';
import DeleteProjectButton from './DeleteProjectButton';
import EditableClientLabel from './EditableClientLabel';

type Project = {
  id: string;
  name: string;
  slug: string;
  figmaUrl: string;
  clientLabel?: string;
  createdAt: string;
};

interface ProjectCardProps {
  project: Project;
  onProjectDeleted: (id: string) => void;
}

export default function ProjectCard({ project, onProjectDeleted }: ProjectCardProps) {
  const [currentProject, setCurrentProject] = useState(project);

  const handleLabelUpdate = (newLabel: string) => {
    setCurrentProject(prev => ({ ...prev, clientLabel: newLabel }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {currentProject.name}
          </h3>
          <EditableClientLabel
            projectId={currentProject.id}
            currentLabel={currentProject.clientLabel || 'Uncategorized'}
            onLabelUpdate={handleLabelUpdate}
          />
        </div>
        <p className="text-sm text-gray-500 mb-2">
          Created {new Date(currentProject.createdAt).toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-400 mb-4 font-mono">
          actualsize.digital/{currentProject.slug}
        </p>
        
        <div className="space-y-2">
          <Link
            href={`/${currentProject.slug}`}
            className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            View Prototype
          </Link>
          <CopyLinkButton slug={currentProject.slug} />
          <a
            href={currentProject.figmaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
          >
            Open in Figma
          </a>
          <DeleteProjectButton 
            projectId={currentProject.id}
            projectName={currentProject.name}
            onDelete={onProjectDeleted}
          />
        </div>
      </div>
    </div>
  );
}
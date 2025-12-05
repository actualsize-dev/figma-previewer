'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

type DeletedProject = {
  id: string;
  name: string;
  slug: string;
  figmaUrl: string;
  createdAt: string;
  deletedAt: string;
};

interface DeletedProjectListProps {
  initialDeletedProjects: DeletedProject[];
}

export default function DeletedProjectList({ initialDeletedProjects }: DeletedProjectListProps) {
  const [deletedProjects, setDeletedProjects] = useState(initialDeletedProjects);

  const handleProjectRemoved = (removedId: string) => {
    setDeletedProjects(prevProjects => 
      prevProjects.filter(project => project.id !== removedId)
    );
  };

  const handleRestore = async (projectId: string, projectName: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/restore`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to restore project');
      }

      const result = await response.json();
      handleProjectRemoved(projectId);
      
      // Show success message with link to restored project
      alert(`"${projectName}" has been restored! You can find it in your projects list.`);
    } catch (error) {
      console.error('Error restoring project:', error);
      alert('Failed to restore project. Please try again.');
    }
  };

  const handlePermanentDelete = async (projectId: string, projectName: string) => {
    const confirmMessage = `Are you sure you want to permanently delete "${projectName}"? This action cannot be undone and will free up the project name and URL for future use.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/permanent-delete`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to permanently delete project');
      }

      const result = await response.json();
      handleProjectRemoved(projectId);
      
      alert(`"${projectName}" has been permanently deleted. The project name and URL are now available for new projects.`);
    } catch (error) {
      console.error('Error permanently deleting project:', error);
      alert('Failed to permanently delete project. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {deletedProjects.map((project) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ 
              duration: 0.3,
              layout: { duration: 0.4 }
            }}
            className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/20 transition-all hover:shadow-sm"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground mb-3">
                    {project.name}
                  </h3>
                  <div className="space-y-1 text-sm text-muted-foreground mb-4">
                    <p>Created {new Date(project.createdAt).toLocaleDateString()}</p>
                    <p>Deleted {new Date(project.deletedAt).toLocaleDateString()}</p>
                    <p className="font-mono text-xs bg-muted px-2 py-1 rounded inline-block">
                      actualsize.digital/{project.slug}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <div className="flex space-x-2">
                    <a
                      href={project.figmaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline text-sm"
                    >
                      View in Figma
                    </a>
                    <button
                      onClick={() => handleRestore(project.id, project.name)}
                      className="btn btn-primary text-sm"
                    >
                      Restore Project
                    </button>
                  </div>
                  <button
                    onClick={() => handlePermanentDelete(project.id, project.name)}
                    className="btn btn-subtle text-sm"
                  >
                    Permanently Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {deletedProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-muted-foreground mb-4">All deleted projects have been restored!</p>
          <Link
            href="/projects"
            className="btn btn-subtle"
          >
            Back to Projects
          </Link>
        </motion.div>
      )}
    </div>
  );
}
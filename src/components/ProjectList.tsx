'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

type Project = {
  id: string;
  name: string;
  slug: string;
  figmaUrl: string;
  clientLabel?: string;
  createdAt: string;
};

interface ProjectListProps {
  initialProjects: Project[];
  viewMode?: 'grid' | 'list';
}

export default function ProjectList({ initialProjects, viewMode = 'grid' }: ProjectListProps) {
  const [projects, setProjects] = useState(initialProjects);

  // Update projects when initialProjects changes
  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const handleProjectDeleted = (deletedId: string) => {
    setProjects(prevProjects => 
      prevProjects.filter(project => project.id !== deletedId)
    );
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  return (
    <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
      <AnimatePresence mode="popLayout">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.3,
              layout: { duration: 0.4 }
            }}
          >
            <ProjectCard
              project={project}
              onProjectDeleted={handleProjectDeleted}
              onProjectUpdated={handleProjectUpdated}
              compact={viewMode === 'list'}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
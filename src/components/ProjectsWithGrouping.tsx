'use client';

import { useState, useMemo } from 'react';
import ProjectList from './ProjectList';

type Project = {
  id: string;
  name: string;
  slug: string;
  figmaUrl: string;
  clientLabel?: string;
  createdAt: string;
};

interface ProjectsWithGroupingProps {
  projects: Project[];
}

export default function ProjectsWithGrouping({ projects }: ProjectsWithGroupingProps) {
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'client'>('date');

  // Group projects by client
  const projectsByClient = useMemo(() => {
    const groups: { [key: string]: Project[] } = {};
    
    projects.forEach(project => {
      const client = project.clientLabel || 'Uncategorized';
      if (!groups[client]) {
        groups[client] = [];
      }
      groups[client].push(project);
    });

    // Sort projects within each group by date
    Object.keys(groups).forEach(client => {
      groups[client].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });

    return groups;
  }, [projects]);

  const clientLabels = Object.keys(projectsByClient).sort();

  // Filter and sort projects
  const displayedProjects = useMemo(() => {
    let filtered = projects;

    if (selectedClient !== 'all') {
      filtered = projects.filter(p => (p.clientLabel || 'Uncategorized') === selectedClient);
    }

    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      filtered.sort((a, b) => {
        const clientA = a.clientLabel || 'Uncategorized';
        const clientB = b.clientLabel || 'Uncategorized';
        if (clientA === clientB) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return clientA.localeCompare(clientB);
      });
    }

    return filtered;
  }, [projects, selectedClient, sortBy]);

  const groupedView = sortBy === 'client' && selectedClient === 'all';

  if (groupedView) {
    return (
      <div className="space-y-8">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Clients</option>
              {clientLabels.map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Group by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'client')}
              className="text-sm border border-gray-300 rounded px-3 py-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date</option>
              <option value="client">Client</option>
            </select>
          </div>
        </div>

        {clientLabels.map(client => (
          <div key={client} className="space-y-4">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-gray-900">{client}</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {projectsByClient[client].length} project{projectsByClient[client].length !== 1 ? 's' : ''}
              </span>
            </div>
            <ProjectList initialProjects={projectsByClient[client]} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="text-sm border border-gray-300 rounded px-3 py-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Clients</option>
            {clientLabels.map(client => (
              <option key={client} value={client}>{client}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'client')}
            className="text-sm border border-gray-300 rounded px-3 py-1 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Date</option>
            <option value="client">Client</option>
          </select>
        </div>
      </div>

      <ProjectList initialProjects={displayedProjects} />
    </div>
  );
}
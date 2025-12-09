'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Grid3x3, List, Folder } from 'lucide-react';
import { getCategoryColor } from '@/utils/categoryColors';
import SelectiveRestoreModal from './SelectiveRestoreModal';

type DeletedClient = {
  label: string;
  projectCount: number;
  deletedAt: string;
};

interface DeletedClientListProps {
  initialDeletedClients: DeletedClient[];
}

export default function DeletedClientList({ initialDeletedClients }: DeletedClientListProps) {
  const [deletedClients, setDeletedClients] = useState(initialDeletedClients);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectiveRestoreClient, setSelectiveRestoreClient] = useState<string | null>(null);

  const filteredClients = deletedClients.filter(client =>
    !searchTerm.trim() ||
    client.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClientRemoved = (removedLabel: string) => {
    setDeletedClients(prevClients =>
      prevClients.filter(client => client.label !== removedLabel)
    );
  };

  const handleRestoreAll = async (clientLabel: string) => {
    try {
      const response = await fetch(`/api/clients/${encodeURIComponent(clientLabel)}/restore-all`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to restore client');
      }

      handleClientRemoved(clientLabel);
      alert(`All projects for "${clientLabel}" have been restored!`);
    } catch (error) {
      console.error('Error restoring client:', error);
      alert('Failed to restore client. Please try again.');
    }
  };

  const handlePermanentDelete = async (clientLabel: string, projectCount: number) => {
    const confirmMessage = `Are you sure you want to permanently delete "${clientLabel}" and all ${projectCount} project${projectCount !== 1 ? 's' : ''}? This action cannot be undone and will free up the project names and URLs for future use.`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(`/api/clients/${encodeURIComponent(clientLabel)}/permanent-delete`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to permanently delete client');
      }

      handleClientRemoved(clientLabel);
      alert(`"${clientLabel}" and all its projects have been permanently deleted. The project names and URLs are now available for new projects.`);
    } catch (error) {
      console.error('Error permanently deleting client:', error);
      alert('Failed to permanently delete client. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-2 justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search deleted clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm bg-background border border-border rounded px-3 py-2 pr-8 w-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
            title="Grid view"
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Client Grid/List */}
      <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
        <AnimatePresence mode="popLayout">
          {filteredClients.map((client) => {
            const colors = getCategoryColor(client.label);

            return (
              <motion.div
                key={client.label}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.3,
                  layout: { duration: 0.4 }
                }}
              >
                {viewMode === 'list' ? (
                  // Compact list view
                  <div className="bg-card border border-border rounded-lg px-4 py-3 transition-all hover:shadow-sm hover:border-foreground/20 overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3 className="text-sm font-semibold text-foreground truncate">{client.label}</h3>
                          <span
                            className="text-xs px-2 py-1 rounded whitespace-nowrap"
                            style={{
                              backgroundColor: colors.bg,
                              color: colors.text,
                            }}
                          >
                            {client.projectCount} {client.projectCount === 1 ? 'project' : 'projects'}
                          </span>
                          <div className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded whitespace-nowrap">
                            Deleted
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                          <span className="whitespace-nowrap">Deleted {new Date(client.deletedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex sm:items-center gap-2 sm:flex-shrink-0 w-full sm:w-auto min-w-0">
                        <button
                          onClick={() => handleRestoreAll(client.label)}
                          className="btn btn-primary text-xs px-2 sm:px-3 py-1 whitespace-nowrap flex-1 sm:flex-none text-center min-w-0"
                        >
                          Restore All
                        </button>
                        <button
                          onClick={() => setSelectiveRestoreClient(client.label)}
                          className="btn btn-outline text-xs px-2 sm:px-3 py-1 whitespace-nowrap flex-1 sm:flex-none text-center min-w-0"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(client.label, client.projectCount)}
                          className="btn btn-destructive text-xs px-2 sm:px-3 py-1 whitespace-nowrap flex-1 sm:flex-none text-center min-w-0"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Grid view
                  <div className="bg-card border border-border rounded-lg overflow-hidden transition-all hover:shadow-sm">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 mr-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
                              <Folder className="w-5 h-5" style={{ color: colors.text }} />
                            </div>
                            <h3 className="text-base font-semibold text-foreground">
                              {client.label}
                            </h3>
                          </div>
                        </div>
                        <div className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                          Deleted
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mb-4">
                        <p className="text-sm text-muted-foreground">
                          Deleted {new Date(client.deletedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center justify-between py-3 px-4 bg-muted rounded-lg">
                          <span className="text-sm text-muted-foreground">Projects</span>
                          <span className="text-sm font-medium text-foreground">{client.projectCount}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => handleRestoreAll(client.label)}
                          className="btn btn-primary w-full text-sm"
                        >
                          Restore All
                        </button>
                        <button
                          onClick={() => setSelectiveRestoreClient(client.label)}
                          className="btn btn-outline w-full text-sm"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(client.label, client.projectCount)}
                          className="btn btn-destructive w-full text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredClients.length === 0 && deletedClients.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No deleted clients match your search.</p>
          <button
            onClick={() => setSearchTerm('')}
            className="btn btn-primary"
          >
            Clear Search
          </button>
        </div>
      )}

      {selectiveRestoreClient && (
        <SelectiveRestoreModal
          clientLabel={selectiveRestoreClient}
          onClose={() => setSelectiveRestoreClient(null)}
          onRestoreComplete={() => {
            // Check if all projects were restored, if so remove the client from the list
            setSelectiveRestoreClient(null);
            // Refresh the page to update the list
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Share2, Copy, Check, Trash2, ExternalLink } from 'lucide-react';

type ShareLink = {
  id: string;
  token: string;
  clientLabel: string;
  expiresAt: string | null;
  createdAt: string;
  url: string;
};

interface ShareLinksManagerProps {
  clientLabel: string;
}

export default function ShareLinksManager({ clientLabel }: ShareLinksManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateShareLink = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/share/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientLabel,
          expiresInDays: null, // No expiration by default
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create share link');
      }

      setShareLink(data.shareLink);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create share link');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteShareLink = async (token: string) => {
    if (!confirm('Are you sure you want to revoke this share link? It will no longer be accessible.')) {
      return;
    }

    try {
      const response = await fetch(`/api/share/${token}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to revoke share link');
      }

      setShareLink(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke share link');
    }
  };

  const copyToClipboard = async (text: string, token: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        title="Generate share link"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Share Link Manager</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Generate a secure link for <span className="font-medium">{clientLabel}</span>
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          {!shareLink ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Active Share Link
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Generate a secure share link to give clients access to all projects under {clientLabel}.
              </p>
              <button
                onClick={generateShareLink}
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading ? 'Generating...' : 'Generate Share Link'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Success message */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-500 mb-1">
                      Share link created successfully
                    </p>
                    <p className="text-sm text-green-500/80">
                      Anyone with this link can view all {clientLabel} projects.
                    </p>
                  </div>
                </div>
              </div>

              {/* Share link display */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Share URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareLink.url}
                    className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(shareLink.url, shareLink.token)}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 border border-border rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    {copiedToken === shareLink.token ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Link details */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Created</p>
                  <p className="text-sm text-foreground">
                    {new Date(shareLink.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Expires</p>
                  <p className="text-sm text-foreground">
                    {shareLink.expiresAt
                      ? new Date(shareLink.expiresAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Never'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-border">
                <a
                  href={shareLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn btn-secondary flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Preview Link
                </a>
                <button
                  onClick={() => deleteShareLink(shareLink.token)}
                  className="flex-1 btn btn-secondary text-red-500 hover:text-red-600 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Revoke Link
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';

export function ApiKeyEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Key className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No API Keys</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        You haven't created any API keys yet. API keys allow you to access your
        data programmatically.
      </p>
      <Button
        onClick={() =>
          document
            .querySelector<HTMLButtonElement>('[aria-haspopup="dialog"]')
            ?.click()
        }
      >
        Create Your First API Key
      </Button>
    </div>
  );
}

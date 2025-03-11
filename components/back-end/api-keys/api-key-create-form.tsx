'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@mosespace/toast';
import { Copy, Key, Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
}

export function ApiKeyCreateForm({ apiKey }: { apiKey: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log('Running ✅:');

    if (!name.trim()) {
      toast.error('Error', 'Please enter a name for your API key');
      return;
    }

    try {
      setLoading(true);

      console.log('Base Url ✅:', baseUrl);

      const response = await fetch(`${baseUrl}/api/api-keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          'x-api-key': apiKey,
        },
        credentials: 'include',
        body: JSON.stringify({ name }),
      });

      const data = await response.json();
      if (data) {
        toast.success('Success', `${data.message}`);
        setNewKey(data?.data.key);
        router.refresh();
      } else {
        toast.error('Error', `${data.message}`);
      }
    } catch (error) {
      toast.error('Error', 'Failed to create API key');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);

    toast.success('Copied!', 'API key copied to clipboard');
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
    setNewKey(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {newKey ? 'API Key Created' : 'Create API Key'}
          </DialogTitle>
          <DialogDescription>
            {newKey
              ? "Your new API key has been created. Please copy it now as you won't be able to see it again."
              : 'Create a new API key to access your data programmatically.'}
          </DialogDescription>
        </DialogHeader>

        {newKey ? (
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Your API Key:</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(newKey)}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-background border rounded-md p-3 font-mono text-sm break-all">
                {newKey}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md text-sm">
              <strong>Important:</strong> This key will only be shown once. Make
              sure to copy it now.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">API Key Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Chrome Extension"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
                <p className="text-sm text-muted-foreground">
                  Give your API key a descriptive name to remember where it's
                  being used.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Create Key
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}

        {newKey && (
          <DialogFooter>
            <Button onClick={handleClose}>Done</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

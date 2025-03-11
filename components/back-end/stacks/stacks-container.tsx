'use client';

import { CreateStackDialog } from '@/components/stacks/forms/create-stack-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@mosespace/toast';
import { Grid, List, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { StackGrid } from './stack-grid';
import { StackList } from './stack-list';
import { deleteStack } from '@/actions/stacks';

interface Stack {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  _count: {
    productCards: number;
  };
}

interface StacksContainerProps {
  initialStacks: Stack[];
  user: any;
}

export function StacksContainer({ initialStacks, user }: StacksContainerProps) {
  const [stacks, setStacks] = useState<Stack[]>(initialStacks);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const filteredStacks = stacks.filter(
    (stack) =>
      stack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stack.description &&
        stack.description.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleUpdateStack = async (updatedStack: Stack) => {
    setStacks(
      stacks.map((stack) =>
        stack.id === updatedStack.id ? updatedStack : stack,
      ),
    );

    toast.success(
      'Stack updated',
      `${updatedStack.name} has been updated successfully.`,
    );
  };

  const handleDeleteStack = async (stackId: string) => {
    try {
      const apiKey = user?.apiKeys[0].key;
      const response = await deleteStack(apiKey, stackId);

      if (response.status === 201) {
        setStacks(stacks.filter((stack) => stack.id !== stackId));
        toast.success(
          'Stack deleted',
          'The stack has been deleted successfully.',
        );
      }
    } catch (error) {
      toast.error('Error', 'Failed to delete stack. Please try again.');
    }
  };

  const handleTogglePublic = async (stackId: string, isPublic: boolean) => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/stacks/${stackId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublic }),
      });

      if (!response.ok) {
        throw new Error('Failed to update stack');
      }

      const updatedStack = await response.json();

      setStacks(
        stacks.map((stack) => (stack.id === stackId ? updatedStack : stack)),
      );

      toast.success(
        isPublic ? 'Stack made public' : 'Stack made private',
        isPublic
          ? 'Anyone with the link can now view this stack.'
          : 'This stack is now private.',
      );
    } catch (error) {
      toast.error('Error', 'Failed to update stack. Please try again.');
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Stacks</h1>
          <p className="text-muted-foreground mt-1">
            Organize and compare your card collections
          </p>
        </div>

        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Stack
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stacks..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs
          value={viewMode}
          onValueChange={(value) => setViewMode(value as 'grid' | 'list')}
        >
          <TabsList className="grid w-[120px] grid-cols-2">
            <TabsTrigger value="grid">
              <Grid className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredStacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          {searchQuery ? (
            <>
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                We couldn't find any stacks matching "{searchQuery}". Try a
                different search term.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear search
              </Button>
            </>
          ) : (
            <>
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M21 7 12 2 3 7v10l9 5 9-5Z" />
                  <path d="m3 7 9 5 9-5" />
                  <path d="M12 12v10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No stacks yet</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Create your first stack to start organizing and comparing cards.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Stack
              </Button>
            </>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <StackGrid
          stacks={filteredStacks}
          user={user}
          onDelete={handleDeleteStack}
          onTogglePublic={handleTogglePublic}
        />
      ) : (
        <StackList
          stacks={filteredStacks}
          user={user}
          onDelete={handleDeleteStack}
          onTogglePublic={handleTogglePublic}
        />
      )}

      <CreateStackDialog
        user={user}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
}

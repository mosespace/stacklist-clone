'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

import { CardCreatorDialog } from '@/components/stacks/card-creator';
import { CardGrid } from '@/components/stacks/card-grid';
import { CreateStackDialog } from '@/components/stacks/forms/create-stack-dialog';
import { toast } from '@mosespace/toast';
import {
  ArrowLeft,
  Edit,
  Eye,
  EyeOff,
  Globe,
  Lock,
  LucideLink,
  Plus,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DeleteStackDialog } from './delete-stack-dialog';

interface Stack {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  productCards: any[];
  _count: {
    productCards: number;
  };
}

interface StackDetailProps {
  stack: Stack;
  user: any;
}

export function StackDetail({ stack, user }: StackDetailProps) {
  const [currentStack, setCurrentStack] = useState<Stack>(stack);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const router = useRouter();

  const handleUpdateStack = async (updatedStack: Stack) => {
    setCurrentStack({
      ...currentStack,
      ...updatedStack,
    });

    toast.success(
      'Stack updated',
      `${updatedStack.name} has been updated successfully.`,
    );
  };

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleDeleteStack = async (stackId: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/stacks/${stackId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete stack');
      }

      toast.success(
        'Stack deleted',
        'The stack has been deleted successfully.',
      );

      router.push('/stacks');
    } catch (error) {
      toast.error('Error', 'Failed to delete stack. Please try again.');
    }
  };

  const handleTogglePublic = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/v1/stacks/${currentStack.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isPublic: !currentStack.isPublic }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to update stack');
      }

      const updatedStack = await response.json();

      setCurrentStack({
        ...currentStack,
        isPublic: updatedStack.isPublic,
      });

      toast.success(
        updatedStack.isPublic ? 'Stack made public' : 'Stack made private',
        updatedStack.isPublic
          ? 'Anyone with the link can now view this stack.'
          : 'This stack is now private.',
      );
    } catch (error) {
      toast.error('Error', 'Failed to update stack. Please try again.');
    }
  };

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/s/${currentStack.slug}`;
    navigator.clipboard.writeText(shareUrl);

    toast.success('Link copied', 'Share link copied to clipboard.');
  };

  const handleSaveCard = async (cardData: any) => {
    try {
      const response = await fetch('${baseUrl}/api/v1/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...cardData,
          stackId: currentStack.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create card');
      }

      // Refresh the page to show the new card
      router.refresh();

      return Promise.resolve();
    } catch (error) {
      toast.error('Error', 'Failed to save card');
      return Promise.reject(error);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link href="/stacks">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Stacks
              </Link>
            </Button>

            <Badge
              variant={currentStack.isPublic ? 'default' : 'outline'}
              className="rounded-sm"
            >
              {currentStack.isPublic ? (
                <>
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </>
              )}
            </Badge>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {currentStack.name}
              </h1>
              {currentStack.description && (
                <p className="text-muted-foreground mt-1">
                  {currentStack.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {currentStack.isPublic && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyShareLink}
                >
                  <LucideLink className="h-4 w-4 mr-1" />
                  Copy Share Link
                </Button>
              )}

              <Button variant="outline" size="sm" onClick={handleTogglePublic}>
                {currentStack.isPublic ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Make Private
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Make Public
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Products ({currentStack._count.productCards})
          </h2>

          <Button onClick={() => setCardDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {currentStack.productCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
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
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No cards yet</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Add your first product to this stack to start comparing.
            </p>
            <Button onClick={() => setCardDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Product
            </Button>
          </div>
        ) : (
          <CardGrid stackId={currentStack.id} />
        )}
      </div>

      <CreateStackDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={user}
        stack={stack}
      />

      <DeleteStackDialog
        stack={currentStack}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onStackDeleted={handleDeleteStack}
      />

      <CardCreatorDialog
        open={cardDialogOpen}
        onOpenChange={setCardDialogOpen}
        stackId={currentStack.id}
      />
    </>
  );
}

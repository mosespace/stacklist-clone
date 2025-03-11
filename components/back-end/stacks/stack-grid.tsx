'use client';

import { CreateStackDialog } from '@/components/stacks/forms/create-stack-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Calendar,
  Clock,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Lock,
  MoreHorizontal,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
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
  _count: {
    productCards: number;
  };
}

interface StackGridProps {
  stacks: Stack[];
  user: any;
  onDelete: (stackId: string) => Promise<void>;
  onTogglePublic: (stackId: string, isPublic: boolean) => Promise<void>;
}

export function StackGrid({
  stacks,
  user,
  onDelete,
  onTogglePublic,
}: StackGridProps) {
  const [editingStack, setEditingStack] = useState<Stack | null>(null);
  const [deletingStack, setDeletingStack] = useState<Stack | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return `${interval} year${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return `${interval} month${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return `${interval} day${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    }

    return `${Math.floor(seconds)} second${Math.floor(seconds) === 1 ? '' : 's'} ago`;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stacks.map((stack) => (
          <Card
            key={stack.id}
            className="group overflow-hidden transition-all hover:shadow-md"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {stack.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {stack.description || 'No description'}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingStack(stack)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onTogglePublic(stack.id, !stack.isPublic)}
                    >
                      {stack.isPublic ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Make Private
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Make Public
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeletingStack(stack)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Badge
                  variant={stack.isPublic ? 'default' : 'outline'}
                  className="rounded-sm"
                >
                  {stack.isPublic ? (
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
                <Badge variant="outline" className="rounded-sm">
                  <ShoppingBag className="h-3 w-3 mr-1" />
                  {stack._count.productCards}{' '}
                  {stack._count.productCards === 1 ? 'product' : 'products'}
                </Badge>
              </div>

              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-2" />
                  <span>Created {formatDate(stack.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-2" />
                  <span>Updated {getTimeAgo(stack.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/stacks/${stack.slug}`}>View Stack</Link>
              </Button>
              {stack.isPublic && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/s/${stack.slug}`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Share
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {editingStack && (
        <CreateStackDialog
          user={user}
          open={!!editingStack}
          onOpenChange={(open) => !open && setEditingStack(null)}
        />
      )}

      {deletingStack && (
        <DeleteStackDialog
          stack={deletingStack}
          open={!!deletingStack}
          onOpenChange={(open) => !open && setDeletingStack(null)}
          onStackDeleted={onDelete}
        />
      )}
    </>
  );
}

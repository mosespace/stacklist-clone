'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
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
import { DeleteStackDialog } from './delete-stack-dialog';
import { CreateStackDialog } from '@/components/stacks/forms/create-stack-dialog';

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

interface StackListProps {
  stacks: Stack[];
  user: any;
  onDelete: (stackId: string) => Promise<void>;
  onTogglePublic: (stackId: string, isPublic: boolean) => Promise<void>;
}

export function StackList({
  stacks,
  user,
  onDelete,
  onTogglePublic,
}: StackListProps) {
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

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stacks.map((stack) => (
              <TableRow key={stack.id}>
                <TableCell>
                  <div className="font-medium">{stack.name}</div>
                  {stack.description && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {stack.description}
                    </div>
                  )}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{stack._count.productCards}</span>
                  </div>
                </TableCell>
                <TableCell>{formatDate(stack.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/stacks/${stack.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {stack.isPublic && (
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/s/${stack.slug}`} target="_blank">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingStack(stack)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            onTogglePublic(stack.id, !stack.isPublic)
                          }
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

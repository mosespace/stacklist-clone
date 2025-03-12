'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  ExternalLink,
  Plus,
  Share2,
  ShoppingCart,
  Key,
  Settings,
  FileText,
  ClipboardSignature,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateStackDialog } from './forms/create-stack-dialog';

interface OverviewStats {
  totalStacks: number;
  totalProducts: number;
  sharedStacks: number;
  recentViews: number;
}

export function StacksOverview({ user, stacks }: { user: any; stacks: any }) {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateStackOpen, setIsCreateStackOpen] = useState(false);
  // console.log('Stacks: ✅', stacks);

  useEffect(() => {
    // Simulate API call to fetch dashboard stats
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // await fetch('/api/overview/stats')

        // Simulating API response
        setTimeout(() => {
          setStats({
            totalStacks: stacks?.length,
            totalProducts: 23,
            sharedStacks: 2,
            recentViews: 47,
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stacks</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[60px]" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalStacks}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[60px]" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalProducts}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shared Stacks</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[60px]" />
            ) : (
              <div className="text-2xl font-bold">{stats?.sharedStacks}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Views</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[60px]" />
            ) : (
              <div className="text-2xl font-bold">{stats?.recentViews}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Stacks</CardTitle>
            <CardDescription>
              Your recently created or updated product stacks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : stats?.totalStacks === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No stacks created
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You haven&apos;t created any product stacks yet. Start
                    comparing products by creating your first stack.
                  </p>
                  <Button
                    onClick={() => setIsCreateStackOpen(true)}
                    className="mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create Stack
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium leading-none">
                          Gaming Laptops
                        </p>
                        <p className="text-sm text-muted-foreground">
                          4 products
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/overview/stacks/1">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-md border">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium leading-none">
                          Wireless Earbuds
                        </p>
                        <p className="text-sm text-muted-foreground">
                          3 products
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/overview/stacks/2">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-md border">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium leading-none">
                          Smart Home Devices
                        </p>
                        <p className="text-sm text-muted-foreground">
                          5 products
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/overview/stacks/3">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/overview/stacks">View All Stacks</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full justify-start"
              onClick={() => setIsCreateStackOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Create New Stack
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/overview/cards">
                <ClipboardSignature className="mr-2 h-4 w-4" /> Create Card
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/overview/api-keys">
                <Key className="mr-2 h-4 w-4" /> Manage API Keys
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/overview/settings">
                <Settings className="mr-2 h-4 w-4" /> Account Settings
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/docs">
                <FileText className="mr-2 h-4 w-4" /> API Documentation
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <CreateStackDialog
        user={user}
        open={isCreateStackOpen}
        onOpenChange={setIsCreateStackOpen}
      />
    </>
  );
}

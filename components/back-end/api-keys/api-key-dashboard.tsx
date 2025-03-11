'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ApiKeyCreateForm } from './api-key-create-form';
import { ApiKeyEmptyState } from './api-key-empty-state';
import { ApiKeyList } from './api-key-list';
import { ApiKeyUsage } from './api-key-usage';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  updatedAt: string;
}

export function ApiKeyDashboard({ apiKey }: { apiKey: string }) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('keys');
  const { toast } = useToast();

  useEffect(() => {
    fetchApiKeys();
  }, []);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/v1/api-keys`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch API keys');
      }

      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load API keys',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/api-keys/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete API key');
      }

      setApiKeys(apiKeys.filter((key) => key.id !== id));

      toast({
        title: 'Success',
        description: 'API key deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete API key',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex mx-auto max-w-full justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage API keys for programmatic access to your data
          </p>
        </div>

        <ApiKeyCreateForm apiKey={apiKey as string} />
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b px-4">
            <TabsList className="h-14 bg-transparent">
              <TabsTrigger
                value="keys"
                className="data-[state=active]:bg-background rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Your API Keys
              </TabsTrigger>
              <TabsTrigger
                value="usage"
                className="data-[state=active]:bg-background rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Usage & Examples
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="keys" className="p-0 m-0">
            {apiKeys.length === 0 ? (
              <ApiKeyEmptyState />
            ) : (
              <ApiKeyList apiKeys={apiKeys} onDelete={handleDeleteKey} />
            )}
          </TabsContent>

          <TabsContent value="usage" className="p-0 m-0">
            <ApiKeyUsage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

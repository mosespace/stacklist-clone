import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ApiKeyDashboard } from '@/components/back-end/api-keys/api-key-dashboard';
import { getCurrentUser } from '@/lib/session';

export const metadata: Metadata = {
  title: 'API Keys | StackList Clone',
  description:
    'Create and manage API keys for programmatic access to your data',
};

export default async function ApiKeysPage() {
  const session = await getServerSession(authOptions);
  const user = await getCurrentUser();

  if (!session) {
    redirect('/login?callbackUrl=/overview/api-keys');
  }

  return <ApiKeyDashboard apiKey={user?.apiKeys?.[0].key as string} />;
}

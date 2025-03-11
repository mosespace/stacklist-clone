import { getUserStacks } from '@/actions/stacks';
import { StacksContainer } from '@/components/back-end/stacks/stacks-container';
import { authOptions } from '@/lib/auth';
import { getCurrentUser } from '@/lib/session';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Your Stacks | StackList Clone',
  description: 'Organize and compare your product collections',
};

export default async function StacksPage() {
  const session = await getServerSession(authOptions);
  const user = await getCurrentUser();

  if (!session) {
    redirect('/login?callbackUrl=/stacks');
  }

  // Get user's stacks
  const stacks = await getUserStacks();

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <StacksContainer user={user} initialStacks={stacks as any} />
    </div>
  );
}

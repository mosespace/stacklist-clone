import { getStacks } from '@/actions/stacks';
import { StacksOverview } from '@/components/stacks/stacks-overview';
import { getCurrentUser } from '@/lib/session';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const apiKey = user?.apiKeys[0].key;
  const stacksData = await getStacks(apiKey as string);

  // console.log('User:', user);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="space-y-4">
        <StacksOverview stacks={stacksData?.data} user={user} />
      </div>
    </div>
  );
}

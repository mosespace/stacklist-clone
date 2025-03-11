import { getUserStackBySlug } from '@/actions/stacks';
import { StackDetail } from '@/components/back-end/stacks/stack-detail';
import { authOptions } from '@/lib/auth';
import { getCurrentUser } from '@/lib/session';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;

  const prisma = new PrismaClient();
  const stack = await prisma.stack.findUnique({
    where: { slug: slug },
  });

  if (!stack) {
    return {
      title: 'Stack Not Found',
    };
  }

  return {
    title: `${stack.name} | E-commerce Comparison`,
    description: stack.description || `Compare products in ${stack.name}`,
  };
}

export default async function StackPage({ params }: { params: Params }) {
  const { slug } = await params;

  const session = await getServerSession(authOptions);
  const user = await getCurrentUser();
  if (!session) {
    redirect('/login?callbackUrl=/stacks/' + slug);
  }

  // Get stack
  const stack = await getUserStackBySlug(slug);

  if (!stack) {
    notFound();
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <StackDetail user={user as any} stack={stack as any} />
    </div>
  );
}

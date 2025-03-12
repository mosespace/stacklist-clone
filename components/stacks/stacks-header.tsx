import { User } from '@prisma/client';
import { Package2 } from 'lucide-react';
import Link from 'next/link';

interface DashboardHeaderProps {
  user: Pick<User, 'name' | 'image' | 'email' | 'role'>;
}

export function StacksHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          {/* <MobileNav /> */}
          <Link href="/" className="flex items-center space-x-2">
            <Package2 className="h-6 w-6" />
            <span className="font-bold inline-block">ProductStack</span>
          </Link>
        </div>
        {/* <UserAccountNav user={user} /> */}
      </div>
    </header>
  );
}

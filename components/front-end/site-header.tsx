import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/session';
import { MainNav } from '../layout/main-nav';
import { UserNav } from '../layout/user-nav';

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl w-full flex h-14 max-w-screen-2xls items-center">
        {/* Logo container */}
        <div className="flex items-center">
          <img src="/logo.svg" className="w-8 h-8" alt="" />
          <h2 className="font-bold text-2xl mr-8">StackList</h2>
        </div>
        {user ? (
          <>
            <MainNav />
            <div className="ml-auto flex items-center space-x-4">
              {/* <ModeToggle /> */}
              <UserNav user={user} />
            </div>
          </>
        ) : (
          <div className="ml-auto flex items-center space-x-4">
            {/* <ModeToggle /> */}
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

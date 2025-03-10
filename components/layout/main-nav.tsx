'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { MobileNav } from './mobile-nav';

export function MainNav() {
  const pathname = usePathname();

  const routes = [
    {
      href: '/',
      label: 'Home',
      active: pathname === '/',
    },
    {
      href: '/stacks',
      label: 'Stacks',
      active: pathname === '/stacks' || pathname.startsWith('/stacks/'),
    },
    {
      href: '/discover',
      label: 'Discover',
      active: pathname === '/discover',
    },
    {
      href: '/settings',
      label: 'Settings',
      active: pathname === '/settings',
    },
  ];

  return (
    <div className="mr-4 hidden md:flex">
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'transition-colors hover:text-foreground/80',
              route.active ? 'text-foreground' : 'text-foreground/60',
            )}
          >
            <div className="flex items-center gap-x-2">{route.label}</div>
          </Link>
        ))}
      </nav>
      <MobileNav routes={routes} />
    </div>
  );
}

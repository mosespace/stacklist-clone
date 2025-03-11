'use client';

import {
  AlignVerticalJustifyEnd,
  ArrowLeftRight,
  BadgeEuro,
  DollarSign,
  LayoutGrid,
  Logs,
  Projector,
  Settings,
  Users,
} from 'lucide-react';
import * as React from 'react';

import { SidebarOptInForm } from '@/components/sidebar-opt-in-form';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { siteConfig } from '@/constants/site';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '../ui/button';
import { Separator } from '../ui/separator';
import { NavUser } from './nav-user';

export const data = [
  {
    title: 'Overview',
    href: '/overview',
    icon: LayoutGrid,
    roles: ['ADMIN', 'USER'],
  },
  {
    title: 'Cards',
    href: '/cards',
    icon: BadgeEuro,
    roles: ['USER'],
  },
  {
    title: 'Stacks',
    href: '/stacks',
    icon: AlignVerticalJustifyEnd,
    roles: ['ADMIN', 'USER'],
  },
  {
    title: 'API_Keys',
    href: '/overview/api-keys',
    icon: ArrowLeftRight,
    roles: ['ADMIN', , 'USER'],
  },
  {
    title: 'Analytics',
    href: '/overview/analytics',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    title: 'Billings',
    href: '/overview/billings',
    icon: DollarSign,
    roles: ['USER'],
  },
  {
    title: 'Settings',
    href: '/overview/settings',
    icon: Settings,
    roles: ['ADMIN', , 'USER'],
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: any;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex flex-col w-full">
                <a href="#" className="flex w-full gap-2">
                  <img
                    className="w-8 h-8"
                    src={siteConfig.logo}
                    alt={siteConfig.description}
                  />
                  <span className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">{siteConfig.name}</span>
                    <span className="">v1.0.0</span>
                  </span>
                </a>
                <Separator />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <nav className={cn('flex space-y-1 lg:space-y-2 flex-col')} {...props}>
          {data.map((item) => {
            const segments = pathname.split('/overview').filter(Boolean);

            // Skip rendering if user's role is not in item's roles
            if (!item.roles.includes(user?.role)) {
              return null;
            }

            const isActive = (href: string) => {
              if (href === '/overview') {
                return pathname === '/overview';
              }
              if (pathname === href) return true;
              if (!segments[0]) return false;

              const hrefWithoutDashboard = href.replace('/overview', '');
              return segments[0].startsWith(hrefWithoutDashboard);
            };

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  isActive(item.href)
                    ? 'bg-muted rounded-none hover:bg-muted'
                    : 'hover:bg-transparent hover:underline',
                  'justify-start gap-2',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-1">
          <SidebarOptInForm />
        </div>
        <div className="p-1">
          <NavUser {...user} />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

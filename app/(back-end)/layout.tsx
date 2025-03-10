import { AppSidebar } from '@/components/back-end/app-sidebar';

import { SendFeedback } from '@/components/send-feedback';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { redirect } from 'next/navigation';
import React from 'react';
import Breadcrumb from '../../components/back-end/breadcrumb';
import { getCurrentUser } from '@/lib/session';

export default async function BackEndLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // console.log(`Session User:`, session);

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="sticky top-0 z-10 border-[0.5px] flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div>
            <Breadcrumb />
          </div>
        </header>
        <div className="flex max-w-5xl mx-auto w-full min-h-screen">
          {children}
        </div>
      </SidebarInset>

      <SendFeedback user={user} />
    </SidebarProvider>
  );
}

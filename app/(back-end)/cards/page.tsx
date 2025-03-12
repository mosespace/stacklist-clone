'use client';

import { CardCreatorDialog } from '@/components/stacks/card-creator';
import { CardGrid } from '@/components/stacks/card-grid';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function CardsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Cards</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Card
        </Button>
      </div>

      <CardGrid />

      <CardCreatorDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

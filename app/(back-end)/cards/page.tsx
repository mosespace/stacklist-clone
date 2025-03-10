'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CardCreatorDialog } from '@/components/stacks/card-creator';
import { CardGrid } from '@/components/stacks/card-grid';
import { toast } from '@mosespace/toast';

export default function CardsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSaveCard = async (cardData: any) => {
    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });

      if (!response.ok) {
        toast.error('Error', 'Failed to create card');
      }

      // Force refresh the card grid
      window.location.reload();

      return Promise.resolve();
    } catch (error) {
      toast.error('Error', 'Failed to save card');
      return Promise.reject(error);
    }
  };

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

      <CardCreatorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        // onSave={handleSaveCard}
      />
    </div>
  );
}

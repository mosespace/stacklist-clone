'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ExternalLink, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCard {
  id: string;
  name: string;
  price: number;
  link: string;
  description?: string | null;
  imageUrl?: string | null;
  stackId: string;
}

interface CardGridProps {
  stackId?: string;
  onEdit?: (card: ProductCard) => void;
}

export function CardGrid({ stackId, onEdit }: CardGridProps) {
  const [cards, setCards] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const url = stackId ? `/api/cards?stackId=${stackId}` : '/api/cards';

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }

        const data = await response.json();
        setCards(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load cards',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [stackId, toast]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/cards/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete card');
      }

      setCards(cards.filter((card) => card.id !== id));

      toast({
        title: 'Success',
        description: 'Card deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete card',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No cards found. Create your first card to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card key={card.id} className="overflow-hidden flex flex-col">
          {card.imageUrl && (
            <div className="relative aspect-video">
              <Image
                src={card.imageUrl || '/placeholder.svg'}
                alt={card.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <CardContent className="p-4 flex-1">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
              {card.name}
            </h3>
            {card.description && (
              <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                {card.description}
              </p>
            )}
            {card.price > 0 && (
              <p className="font-medium text-primary">
                ${card.price.toFixed(2)}
              </p>
            )}
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link href={card.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Visit
              </Link>
            </Button>
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={() => onEdit(card)}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(card.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

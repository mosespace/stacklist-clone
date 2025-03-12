'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  ExternalLink,
  Edit,
  Trash2,
  ShoppingCart,
  DollarSign,
  ImageOff,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
// import { motion } from 'framer-motion';

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
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const url = stackId
          ? `/api/v1/cards?stackId=${stackId}`
          : '/api/v1/cards';

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
      const response = await fetch(`/api/v1/cards/${id}`, {
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

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden flex flex-col">
            <div className="relative aspect-video bg-muted">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-between">
              <Skeleton className="h-9 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-3">No products found</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          Add your first product to get started with comparing and organizing
          your shopping list.
        </p>
        <Button asChild>
          <Link href="/cards/new">Add Your First Product</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div key={card.id}>
          <Card className="group overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-md border-muted/80 hover:border-primary/20">
            <div className="relative aspect-video bg-muted overflow-hidden">
              {card.imageUrl && !imageErrors[card.id] ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Image
                    src={card.imageUrl || '/placeholder.svg'}
                    alt={card.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={() => handleImageError(card.id)}
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <ImageOff className="h-10 w-10 text-muted-foreground/40" />
                </div>
              )}

              {card.price > 0 && (
                <Badge className="absolute top-3 right-3 z-20 font-medium text-sm px-2 py-1 bg-primary/90 hover:bg-primary">
                  <DollarSign className="h-3.5 w-3.5 mr-0.5" />
                  {card.price.toFixed(2)}
                </Badge>
              )}
            </div>

            <CardContent className="p-5 flex-1">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {card.name}
              </h3>
              {card.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {card.description}
                </p>
              )}
            </CardContent>

            <CardFooter className="p-5 pt-0 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full transition-all"
                asChild
              >
                <Link
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-1.5" />
                  <span>Visit Site</span>
                </Link>
              </Button>

              <div className="flex gap-1">
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onEdit(card)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(card.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
}

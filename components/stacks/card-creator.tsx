'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { toast } from '@mosespace/toast';
import {
  Bold,
  DollarSign,
  ExternalLink,
  Italic,
  List,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';

interface CardCreatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // onSave: (data: CardData) => Promise<void>;
  stackId?: string;
}

interface CardData {
  title: string;
  url: string;
  notes: string;
  imageUrl?: string;
  price?: number;
  aspectRatio: '16:9' | '4:3';
  stackId?: string;
  showImage?: boolean;
}

interface MetadataResponse {
  title: string;
  description: string;
  images: string[];
  url: string;
  price: string | null;
  siteName: string;
}

export function CardCreatorDialog({
  open,
  onOpenChange,
  // onSave,
  stackId,
}: CardCreatorDialogProps) {
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<MetadataResponse | null>(null);
  const [url, setUrl] = useState('');
  const [showImage, setShowImage] = useState(true);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [cardData, setCardData] = useState<CardData>({
    title: '',
    url: '',
    notes: '',
    aspectRatio: '16:9',
    stackId: stackId,
    showImage: showImage,
  });

  const fetchMetadata = async (url: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error('Failed to fetch metadata');

      const data: MetadataResponse = await response.json();
      setMetadata(data);

      // Extract price if available
      let price: number | undefined = undefined;
      if (data.price) {
        // Extract numeric value from price string
        const priceMatch = data.price.match(/[\d,.]+/);
        if (priceMatch) {
          const priceValue = priceMatch[0].replace(/,/g, '');
          price = Number.parseFloat(priceValue);
        }
      }

      setCardData({
        title: data.title,
        url: url,
        notes: data.description,
        imageUrl: data.images.length > 0 ? data.images[0] : undefined,
        price,
        aspectRatio: '16:9',
        stackId,
      });

      setSelectedImageIndex(0);
    } catch (error) {
      toast.error('Error', 'Failed to fetch URL metadata');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) fetchMetadata(url);
  };

  const handleSave = async () => {
    try {
      // console.log('Card Data ✅;', cardData);
      setLoading(true);
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardData),
      });

      if (!response.ok) {
        toast.error('Error', 'Failed to create card');
      } else {
        toast.success('Success', 'Card created successfully');
        onOpenChange(false);
        // Force refresh the card grid
        window.location.reload();

        return Promise.resolve();
      }
    } catch (error) {
      toast.error('Error', 'Failed to save card');
    } finally {
      setLoading(false);
    }
  };

  const selectImage = (index: number) => {
    if (metadata?.images[index]) {
      setSelectedImageIndex(index);
      setCardData((prev) => ({ ...prev, imageUrl: metadata.images[index] }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Card</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 flex-1 overflow-hidden">
          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <Input
              placeholder="Paste a URL to create a card..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Fetch'}
            </Button>
          </form>

          {loading && !metadata && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {metadata && (
            <ScrollArea className="flex-1 h-[25rem] pr-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={cardData.title}
                    onChange={(e) =>
                      setCardData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>

                {metadata.images.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center w-full justify-between">
                      <Label>Image</Label>
                      <div className="flex items-center space-x-2">
                        <label
                          htmlFor="isPublic"
                          className="text-sm font-medium leading-none"
                        >
                          Show Image
                        </label>
                        <div
                          className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                            showImage ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                          onClick={() => setShowImage(!showImage)}
                        >
                          <div
                            className={`h-5 w-5 rounded-full bg-white transform transition-transform m-0.5 ${
                              showImage ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="aspect-video relative rounded-md overflow-hidden border">
                      <Image
                        src={
                          metadata.images[selectedImageIndex] ||
                          '/placeholder.svg'
                        }
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>

                    {metadata.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto py-2">
                        {metadata.images.map((img, index) => (
                          <div
                            key={index}
                            className={`relative w-16 h-16 rounded-md overflow-hidden border cursor-pointer ${
                              selectedImageIndex === index
                                ? 'ring-2 ring-primary'
                                : ''
                            }`}
                            onClick={() => selectImage(index)}
                          >
                            <Image
                              src={img || '/placeholder.svg'}
                              alt={`Image option ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Card Format</Label>
                  <div className="flex w-full gap-2">
                    <Toggle
                      pressed={cardData.aspectRatio === '16:9'}
                      onPressedChange={() =>
                        setCardData((prev) => ({
                          ...prev,
                          aspectRatio: '16:9',
                        }))
                      }
                      className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground h-[6rem] w-full"
                    >
                      16:9
                    </Toggle>
                    <Toggle
                      pressed={cardData.aspectRatio === '4:3'}
                      onPressedChange={() =>
                        setCardData((prev) => ({ ...prev, aspectRatio: '4:3' }))
                      }
                      className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground h-[6rem] w-full"
                    >
                      4:3
                    </Toggle>
                  </div>
                </div>

                {metadata.price && (
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        value={cardData.price || ''}
                        onChange={(e) =>
                          setCardData((prev) => ({
                            ...prev,
                            price: e.target.value
                              ? Number.parseFloat(e.target.value)
                              : undefined,
                          }))
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <div className="border rounded-md p-1">
                    <div className="flex gap-1 border-b p-1">
                      <Toggle size="sm" className="data-[state=on]:bg-muted">
                        <Bold className="h-4 w-4" />
                      </Toggle>
                      <Toggle size="sm" className="data-[state=on]:bg-muted">
                        <Italic className="h-4 w-4" />
                      </Toggle>
                      <Toggle size="sm" className="data-[state=on]:bg-muted">
                        <List className="h-4 w-4" />
                      </Toggle>
                    </div>
                    <Textarea
                      value={cardData.notes}
                      onChange={(e) =>
                        setCardData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      className="border-0 focus-visible:ring-0 min-h-[150px]"
                      placeholder="Add notes..."
                    />
                  </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  <span className="truncate">{metadata.url}</span>
                </div>
              </div>
            </ScrollArea>
          )}

          {metadata && (
            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                Save
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { addFavorite } from '@/actions/favorites/add-favorite';
import { removeFavorite } from '@/actions/favorites/remove-favorite';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ContactFavoriteToggleProps {
  contactId: string;
  initialIsFavorite: boolean;
}

export function ContactFavoriteToggle({
  contactId,
  initialIsFavorite
}: ContactFavoriteToggleProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isPending, setIsPending] = useState(false);

  const handleToggleFavorite = async () => {
    setIsPending(true);
    try {
      if (isFavorite) {
        // Remove from favorites
        const result = await removeFavorite({ id: contactId });
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success('Removed from favorites');
        setIsFavorite(false);
      } else {
        // Add to favorites
        const result = await addFavorite({ id: contactId });
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success('Added to favorites');
        setIsFavorite(true);
      }
    } catch (error) {
      toast.error('Failed to update favorites');
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleFavorite}
      disabled={isPending}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      className="h-8 w-8"
    >
      <Star
        className={cn(
          'h-4 w-4',
          isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
        )}
      />
    </Button>
  );
}

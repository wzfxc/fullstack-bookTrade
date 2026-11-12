'use client';

import { ImageOff } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/cn';

interface BookCoverProps {
  photoUrl: string | null;
  title: string;
  className?: string;
}

export function BookCover({ photoUrl, title, className }: BookCoverProps) {
  const [hasLoadFailed, setHasLoadFailed] = useState(false);

  return (
    <div
      className={cn(
        'flex aspect-[3/4] w-full items-center justify-center overflow-hidden bg-gray-100 text-gray-400',
        className,
      )}
    >
      {photoUrl && !hasLoadFailed ? (
        <img
          src={photoUrl}
          alt={`Cover of ${title}`}
          loading="lazy"
          onError={() => setHasLoadFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <ImageOff className="h-8 w-8" aria-label="No cover available" />
      )}
    </div>
  );
}

import React, { useCallback, useEffect, useId, useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './button';

function ScalableImage({ src, alt, className }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'group relative block w-full max-w-full cursor-pointer overflow-hidden rounded-lg border border-border bg-muted/20 text-left transition-colors duration-200 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        aria-label={`${alt}. Click to enlarge.`}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-80 w-full object-contain sm:max-h-96"
          loading="lazy"
        />
        <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-card/90 px-2 py-1 text-xs font-medium text-foreground shadow-sm">
          <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
          Enlarge
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={close}
        >
          <div
            className="relative flex max-h-full max-w-full flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p id={titleId} className="sr-only">
              {alt}
            </p>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute -top-12 right-0 z-10 sm:-right-12 sm:top-0"
              onClick={close}
              aria-label="Close enlarged image"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Button>
            <img
              src={src}
              alt={alt}
              className="max-h-[85vh] max-w-[min(100%,1200px)] w-auto object-contain"
            />
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="mt-3 text-sm text-primary-foreground underline transition-colors duration-200 hover:text-white"
            >
              Open original in new tab
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default ScalableImage;

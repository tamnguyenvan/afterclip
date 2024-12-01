'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ImageUploadProps } from './types';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ImageUpload({
  id,
  label,
  value,
  onChange,
  className,
  children,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      onChange(url);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange('');
  };

  return (
    <div 
      className={cn("relative w-full h-full", className)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            onChange(url);
          }
        }}
        className="hidden"
        id={id}
      />
      <label
        htmlFor={id}
        className="block w-full h-full cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={cn(
          "relative w-full h-full rounded-lg transition-all duration-200",
          isDragging && "ring-2 ring-primary ring-offset-2 bg-primary/5",
          !value && "hover:bg-primary/5"
        )}>
          {value ? (
            <div className="relative w-full h-full">
              <img
                src={value}
                alt={`${label || 'Image'} preview`}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className={cn(
                "absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 transition-opacity duration-200 flex items-center justify-center gap-2",
                (isHovered || isDragging) && "opacity-100"
              )}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleRemove}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove image</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Upload new image</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {children || (
                <div className={cn(
                  "text-center space-y-4 transition-transform duration-200",
                  isDragging && "scale-105"
                )}>
                  <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mx-auto">
                    <ImageIcon className="w-10 h-10 text-primary/40" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {isDragging ? 'Drop image here' : 'Drop image here, or click to browse'}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      Supports: JPG, PNG, GIF
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </label>
      {isDragging && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-4 border-2 border-primary border-dashed rounded-lg" />
        </div>
      )}
    </div>
  );
}
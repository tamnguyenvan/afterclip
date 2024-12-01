import { useState } from 'react';

export function useImageUpload() {
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);

  const resetImages = () => {
    setBeforeImage(null);
    setAfterImage(null);
  };

  return {
    beforeImage,
    afterImage,
    setBeforeImage,
    setAfterImage,
    resetImages,
  };
}
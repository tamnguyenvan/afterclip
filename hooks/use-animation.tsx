import { useState } from 'react';
import { animationService } from '@/services/animation';

type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'easeInBack' | 'easeOutBack';

export function useAnimation() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const generate = async (
    beforeImage: string, 
    afterImage: string, 
    scanLineColor: string = '#ffffff',
    easing: EasingType = 'linear'
  ) => {
    console.log('🎬 Starting animation generation process...', {
      beforeImage,
      afterImage,
      scanLineColor,
      easing
    });

    if (!beforeImage || !afterImage) {
      console.error('❌ Missing required images');
      throw new Error('Both images are required');
    }

    setIsLoading(true);
    setProgress(0);
    setResultVideo(null);
    setDownloadUrl(null);
    console.time('totalGenerationTime');

    try {
      console.log('⏳ Generating animation...');
      const result = await animationService.generateAnimation(
        beforeImage, 
        afterImage, 
        scanLineColor, 
        easing,
        (progress) => {
          setProgress(Math.round(progress * 100));
        }
      );
      console.log('✅ Animation generated successfully');
      
      setResultVideo(result);
      setDownloadUrl(result);
      console.log('🎥 Video URL set:', result);
    } catch (error) {
      console.error('❌ Error in animation generation:', error);
      throw error;
    } finally {
      setIsLoading(false);
      setProgress(0);
      console.timeEnd('totalGenerationTime');
    }
  };

  const downloadVideo = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'animation.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return {
    isLoading,
    progress,
    resultVideo,
    downloadUrl,
    generate,
    downloadVideo,
  };
}
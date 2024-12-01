import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

class AnimationService {
  private ffmpeg: FFmpeg | null = null;

  async init() {
    console.log('🚀 Initializing FFmpeg...');
    if (this.ffmpeg) {
      console.log('✅ FFmpeg already initialized');
      return;
    }

    try {
      this.ffmpeg = new FFmpeg();
      
      // Load FFmpeg
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';
      console.log('📦 Loading FFmpeg core files from:', baseURL);
      
      await this.ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      console.log('✅ FFmpeg loaded successfully');
    } catch (error) {
      console.error('❌ Failed to initialize FFmpeg:', error);
      throw error;
    }
  }

  // Easing functions
  private easingFunctions = {
    linear: (x: number) => x,
    easeIn: (x: number) => x * x,
    easeOut: (x: number) => 1 - (1 - x) * (1 - x),
    easeInOut: (x: number) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
    easeInBack: (x: number) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return c3 * x * x * x - c1 * x * x;
    },
    easeOutBack: (x: number) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }
  };

  private applyEasing(progress: number, easing: keyof typeof this.easingFunctions = 'linear'): number {
    return this.easingFunctions[easing](progress);
  }

  private async createFrames(
    beforeImage: string,
    afterImage: string,
    scanLineColor: string = '#ffffff',
    easing: keyof typeof this.easingFunctions = 'linear',
    totalFrames: number = 105,
    onProgress?: (frameIndex: number, totalFrames: number) => void
  ): Promise<Blob[]> {
    console.log('🎬 Starting frame generation...', { totalFrames });
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const frames: Blob[] = [];

    try {
      console.log('🖼️ Loading images...');
      // Load images
      const [imgBefore, imgAfter] = await Promise.all([
        createImageBitmap(await (await fetch(beforeImage)).blob()),
        createImageBitmap(await (await fetch(afterImage)).blob())
      ]);
      console.log('✅ Images loaded successfully', {
        beforeSize: `${imgBefore.width}x${imgBefore.height}`,
        afterSize: `${imgAfter.width}x${imgAfter.height}`
      });

      // Set canvas size
      canvas.width = imgBefore.width;
      canvas.height = imgBefore.height;
      console.log('🎨 Canvas size set to:', `${canvas.width}x${canvas.height}`);

      // Create frames
      for (let i = 0; i < totalFrames; i++) {
        console.log(`📸 Generating frame ${i + 1}/${totalFrames}`);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // First part: Show before image (0-15 frames)
        if (i < 15) {
          console.log('Phase 1: Showing before image');
          ctx.drawImage(imgBefore, 0, 0);
        }
        // Second part: Scanning effect (15-45 frames)
        else if (i < 45) {
          console.log('Phase 2: Scanning effect');
          const progress = (i - 15) / 30;
          const easedProgress = this.applyEasing(progress, easing);
          
          // Draw before image
          ctx.drawImage(imgBefore, 0, 0);
          
          // Draw scanning line effect
          const scanLineWidth = 10; // Fixed width for solid line
          const x = (canvas.width + 0.2 * canvas.width) * easedProgress - 0.2 * canvas.width;
          
          // Draw glowing scan line
          ctx.save();
          // Outer glow
          ctx.shadowColor = scanLineColor;
          ctx.shadowBlur = 30;
          ctx.fillStyle = scanLineColor;
          ctx.fillRect(x + 0.2 * canvas.width - scanLineWidth, 0, scanLineWidth, canvas.height);
          
          // Inner glow (double layer for stronger effect)
          ctx.shadowBlur = 15;
          ctx.fillRect(x + 0.2 * canvas.width - scanLineWidth, 0, scanLineWidth, canvas.height);
          ctx.restore();
        }
        // Third part: Reveal after image (45-75 frames)
        else if (i < 75) {
          console.log('Phase 3: Revealing after image');
          const progress = (i - 45) / 30;
          const easedProgress = this.applyEasing(progress, easing);
          const splitPosition = canvas.width * easedProgress;
          
          // Draw before image on the left side
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, canvas.width - splitPosition, canvas.height);
          ctx.clip();
          ctx.drawImage(imgBefore, 0, 0);
          ctx.restore();
          
          // Draw after image on the right side
          ctx.save();
          ctx.beginPath();
          ctx.rect(canvas.width - splitPosition, 0, splitPosition, canvas.height);
          ctx.clip();
          ctx.drawImage(imgAfter, 0, 0);
          ctx.restore();
          
          // Draw scanning line at the expanding edge
          const scanLineWidth = 10; // Fixed width for solid line
          const x = canvas.width - splitPosition - scanLineWidth; // Position at the expanding edge
          
          // Draw glowing scan line
          ctx.save();
          // Outer glow
          ctx.shadowColor = scanLineColor;
          ctx.shadowBlur = 30;
          ctx.fillStyle = scanLineColor;
          ctx.fillRect(x, 0, scanLineWidth, canvas.height);
          
          // Inner glow (double layer for stronger effect)
          ctx.shadowBlur = 15;
          ctx.fillRect(x, 0, scanLineWidth, canvas.height);
          ctx.restore();
        }
        // Fourth part: Reveal before image from left to right (75-105 frames)
        else {
          console.log('Phase 4: Revealing before image');
          const progress = (i - 75) / 30;
          const easedProgress = this.applyEasing(progress, easing);
          const splitPosition = canvas.width * easedProgress;
          
          // Draw after image as base
          ctx.drawImage(imgAfter, 0, 0);
          
          // Draw before image on the left side, expanding right
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, splitPosition, canvas.height);
          ctx.clip();
          ctx.drawImage(imgBefore, 0, 0);
          ctx.restore();
          
          // Draw scanning line effect
          const scanLineWidth = 10; // Fixed width for solid line
          const x = splitPosition - scanLineWidth; // Position at the expanding edge
          
          // Draw glowing scan line
          ctx.save();
          // Outer glow
          ctx.shadowColor = scanLineColor;
          ctx.shadowBlur = 30;
          ctx.fillStyle = scanLineColor;
          ctx.fillRect(x, 0, scanLineWidth, canvas.height);
          
          // Inner glow (double layer for stronger effect)
          ctx.shadowBlur = 15;
          ctx.fillRect(x, 0, scanLineWidth, canvas.height);
          ctx.restore();
        }

        // Convert frame to blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/png');
        });
        frames.push(blob);
        console.log(`✅ Frame ${i + 1} generated, size: ${(blob.size / 1024).toFixed(1)}KB`);
        
        // Update progress after each frame
        if (onProgress) {
          onProgress(i, totalFrames);
        }
      }

      console.log('🎉 All frames generated successfully!', {
        totalFrames: frames.length,
        totalSize: `${(frames.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(1)}MB`
      });
      return frames;

    } catch (error) {
      console.error('❌ Error generating frames:', error);
      throw error;
    }
  }

  // Helper function to convert hex color to RGB
  private hexToRgb(hex: string): string {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  }

  async generateAnimation(
    beforeImage: string,
    afterImage: string,
    scanLineColor: string = '#ffffff',
    easing: keyof typeof this.easingFunctions = 'linear',
    onProgress?: (progress: number) => void
  ): Promise<string> {
    console.log('� Starting animation generation...', { scanLineColor, easing });
    
    try {
      await this.init();
      
      // Create frames with progress updates
      const frames = await this.createFrames(beforeImage, afterImage, scanLineColor, easing, 105, (frameIndex, totalFrames) => {
        if (onProgress) {
          // First 80% is frame generation
          onProgress(frameIndex / totalFrames * 0.8);
        }
      });
      
      if (!this.ffmpeg) throw new Error('FFmpeg not initialized');
      
      // Write frames to FFmpeg
      console.log('📝 Writing frames to FFmpeg...');
      for (let i = 0; i < frames.length; i++) {
        await this.ffmpeg.writeFile(`frame${i.toString().padStart(4, '0')}.png`, await fetchFile(frames[i]));
        if (onProgress) {
          // Last 20% is video encoding
          onProgress(0.8 + (i / frames.length * 0.2));
        }
      }

      // Generate video from frames
      console.log('3️⃣ Generating video from frames...');
      const ffmpegCommand = [
        '-framerate', '30',
        '-i', 'frame%04d.png',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-y',
        'output.mp4'
      ];
      console.log('FFmpeg command:', ffmpegCommand.join(' '));
      
      await this.ffmpeg.exec(ffmpegCommand);
      console.log('✅ Video generated successfully');

      // Read the output file
      console.log('4️⃣ Reading output video...');
      const data = await this.ffmpeg.readFile('output.mp4');
      const blob = new Blob([data], { type: 'video/mp4' });
      console.log('📊 Output video size:', `${(blob.size / (1024 * 1024)).toFixed(1)}MB`);
      
      // Cleanup
      console.log('🧹 Cleaning up temporary files...');
      for (let i = 0; i < frames.length; i++) {
        await this.ffmpeg.deleteFile(`frame${i.toString().padStart(4, '0')}.png`);
      }
      await this.ffmpeg.deleteFile('output.mp4');
      console.log('✅ Cleanup complete');

      const url = URL.createObjectURL(blob);
      console.log('🎉 Animation generated successfully!');
      return url;

    } catch (error) {
      console.error('❌ Error in animation generation:', error);
      throw error;
    }
  }
}

export const animationService = new AnimationService();
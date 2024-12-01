import { ImageUpload } from '@/components/features/image-upload/image-upload';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useAnimation } from '@/hooks/use-animation';
import { Loader2, Wand2, Download, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function MainTool() {
  const { 
    beforeImage, 
    afterImage, 
    setBeforeImage, 
    setAfterImage 
  } = useImageUpload();
  
  const { 
    isLoading, 
    progress,
    resultVideo,
    downloadUrl,
    generate,
    downloadVideo
  } = useAnimation();

  const [scanLineColor, setScanLineColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [easing, setEasing] = useState<'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'easeInBack' | 'easeOutBack'>('easeInOut');
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const colorButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current && 
        !colorPickerRef.current.contains(event.target as Node) &&
        !colorButtonRef.current?.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const predefinedColors = ['#ffffff', '#3b82f6', '#ef4444', '#22c55e', '#f59e0b'];

  const handleGenerate = async () => {
    if (!beforeImage || !afterImage) {
      alert('Please upload both images first');
      return;
    }
    
    try {
      await generate(beforeImage, afterImage, scanLineColor, easing);
    } catch (error) {
      alert('Failed to generate animation');
    }
  };

  const AnimationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Scan Line Color</Label>
        <div className="flex items-center gap-3">
          {predefinedColors.map((color) => (
            <button
              key={color}
              onClick={() => {
                setScanLineColor(color);
                setShowColorPicker(false);
              }}
              className={cn(
                "w-8 h-8 rounded-full transition-all",
                "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2",
                "ring-1 ring-gray-300",
                scanLineColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
              )}
              style={{ backgroundColor: color }}
            />
          ))}
          <button
            ref={colorButtonRef}
            onClick={() => setShowColorPicker(!showColorPicker)}
            className={cn(
              "w-8 h-8 rounded-full transition-all",
              "bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500",
              "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2",
              "ring-1 ring-gray-300",
              showColorPicker ? "ring-2 ring-offset-2 ring-primary" : ""
            )}
          />
          {showColorPicker && (
            <div ref={colorPickerRef} className="absolute mt-2 z-50">
              <Card>
                <CardContent className="p-3">
                  <HexColorPicker color={scanLineColor} onChange={setScanLineColor} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Animation Style</Label>
        <Select 
          value={easing} 
          onValueChange={(value: typeof easing) => setEasing(value)}
          defaultValue="easeInOut"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select animation style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linear">Linear</SelectItem>
            <SelectItem value="easeIn">Ease In</SelectItem>
            <SelectItem value="easeOut">Ease Out</SelectItem>
            <SelectItem value="easeInOut">Ease In Out</SelectItem>
            <SelectItem value="easeInBack">Ease In Back</SelectItem>
            <SelectItem value="easeOutBack">Ease Out Back</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 space-y-12 min-h-screen">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">AfterClip Studio</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create stunning before-after video transitions. Upload your before and after images, customize the animation, and download your video.
        </p>
        <p className="text-sm text-muted-foreground">
          Note: For best performance, please use images with resolution under 2K (2048x2048 pixels).
        </p>
      </div>

      {/* Workspace */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8 bg-card p-6 rounded-xl border shadow-sm">
          {/* Upload Areas */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-2 border-dashed">
              <ImageUpload
                id="before-image"
                value={beforeImage}
                onChange={setBeforeImage}
                className="w-full h-[300px]"
                label="Before Image"
              />
            </Card>
            <Card className="border-2 border-dashed">
              <ImageUpload
                id="after-image"
                value={afterImage}
                onChange={setAfterImage}
                className="w-full h-[300px]"
                label="After Image"
              />
            </Card>
          </div>

          {/* Animation Settings */}
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm mb-2">Scan Line Color</Label>
                <div className="flex items-center gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setScanLineColor(color);
                        setShowColorPicker(false);
                      }}
                      className={cn(
                        "w-6 h-6 rounded-full transition-all",
                        "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1",
                        "ring-1 ring-gray-300",
                        scanLineColor === color ? "ring-2 ring-offset-1 ring-primary" : ""
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <button
                    ref={colorButtonRef}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className={cn(
                      "w-6 h-6 rounded-full transition-all",
                      "bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500",
                      "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1",
                      "ring-1 ring-gray-300",
                      showColorPicker ? "ring-2 ring-offset-1 ring-primary" : ""
                    )}
                  />
                  {showColorPicker && (
                    <div ref={colorPickerRef} className="absolute mt-2 z-50">
                      <Card>
                        <CardContent className="p-3">
                          <HexColorPicker color={scanLineColor} onChange={setScanLineColor} />
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm mb-2">Animation Style</Label>
                <Select 
                  value={easing} 
                  onValueChange={(value: typeof easing) => setEasing(value)}
                  defaultValue="easeInOut"
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select animation style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="easeIn">Ease In</SelectItem>
                    <SelectItem value="easeOut">Ease Out</SelectItem>
                    <SelectItem value="easeInOut">Ease In Out</SelectItem>
                    <SelectItem value="easeInBack">Ease In Back</SelectItem>
                    <SelectItem value="easeOutBack">Ease Out Back</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Generate Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleGenerate}
              disabled={isLoading || !beforeImage || !afterImage}
              className="w-full h-16 text-lg bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating... {progress}%
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              {resultVideo ? (
                <>
                  <video
                    src={resultVideo}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full aspect-video bg-muted rounded-lg"
                  />
                  <div className="flex justify-center">
                    <Button
                      className="h-12 bg-blue-600 hover:bg-blue-700 px-8" 
                      size="default"
                      onClick={downloadVideo}
                      disabled={!downloadUrl}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
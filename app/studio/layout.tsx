import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AfterClip Studio - Create Smooth Image Transitions",
    description: "Transform your images into beautiful animations with AfterClip's AI-powered studio. Upload two images and generate professional transitions instantly.",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      {children}
    </div>
  );
}
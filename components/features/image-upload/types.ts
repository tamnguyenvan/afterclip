export interface ImageUploadProps {
  id: string;
  label?: string;
  value: string | null;
  onChange: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}
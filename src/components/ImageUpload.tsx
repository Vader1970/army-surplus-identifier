import React, { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList) => {
      const remainingSlots = maxImages - images.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      filesToProcess.forEach((file) => {
        if (!file.type.startsWith("image/")) {
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          onImagesChange([...images, base64]);
        };
        reader.readAsDataURL(file);
      });
    },
    [images, onImagesChange, maxImages]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-3">
      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative group aspect-square">
              <div className="w-full h-full rounded-lg overflow-hidden border border-border bg-muted">
                <img
                  src={image}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-background/90 rounded-md border border-border hover:bg-destructive hover:text-destructive-foreground transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-primary/90 rounded text-[10px] font-mono text-primary-foreground">
                  Main
                </div>
              )}
            </div>
          ))}

          {/* Add More Button */}
          {canAddMore && (
            <label
              className={cn(
                "aspect-square rounded-lg border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors",
                isDragging && "border-primary bg-primary/10"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleInputChange}
                className="sr-only"
              />
              <Plus className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground mt-1">Add</span>
            </label>
          )}
        </div>
      )}

      {/* Empty State / Drop Zone */}
      {images.length === 0 && (
        <label
          className={cn(
            "drop-zone flex flex-col items-center justify-center p-8 aspect-video cursor-pointer",
            isDragging && "active"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleInputChange}
            className="sr-only"
          />
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Drop images here</p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse (up to {maxImages} images)
              </p>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              JPG, PNG, WEBP • Include tags, labels & different angles
            </p>
          </div>
        </label>
      )}

      {/* Image Count */}
      {images.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <ImageIcon className="w-3 h-3" />
          <span>
            {images.length} of {maxImages} images
          </span>
        </div>
      )}
    </div>
  );
};

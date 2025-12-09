import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { Button } from "@/components/ui/button";
import { CATEGORIES, ProductFormData } from "@/types/product";
import { Loader2, Sparkles } from "lucide-react";

interface ProductFormProps {
  formData: ProductFormData;
  onFormChange: (data: Partial<ProductFormData>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  formData,
  onFormChange,
  onSubmit,
  isLoading,
}) => {
  const isValid = formData.title.trim() && formData.images.length > 0;

  return (
    <div className="space-y-6">
      {/* Title Input */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-mono uppercase tracking-wide text-muted-foreground">
          Item Title *
        </Label>
        <Input
          id="title"
          placeholder="e.g. British DPM combat shirt, Swiss M70 parka"
          value={formData.title}
          onChange={(e) => onFormChange({ title: e.target.value })}
          className="input-tactical h-11"
        />
        <p className="text-xs text-muted-foreground">
          Not sure what it is? Type "UNKNOWN"
        </p>
      </div>

      {/* Category Select */}
      <div className="space-y-2">
        <Label className="text-sm font-mono uppercase tracking-wide text-muted-foreground">
          Category
        </Label>
        <Select
          value={formData.category}
          onValueChange={(value) => onFormChange({ category: value })}
        >
          <SelectTrigger className="input-tactical h-11">
            <SelectValue placeholder="Select category..." />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Collectable Checkbox */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border">
        <Checkbox
          id="collectable"
          checked={formData.isCollectable}
          onCheckedChange={(checked) =>
            onFormChange({ isCollectable: checked as boolean })
          }
          className="border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent"
        />
        <div className="flex-1">
          <Label
            htmlFor="collectable"
            className="text-sm font-medium cursor-pointer"
          >
            Collectable / Display Piece Only
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Generates historical, detailed description style
          </p>
        </div>
      </div>

      {/* Staff Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-mono uppercase tracking-wide text-muted-foreground">
          Staff Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          placeholder="Condition notes, size labels, era, markings, brand info..."
          value={formData.staffNotes}
          onChange={(e) => onFormChange({ staffNotes: e.target.value })}
          className="input-tactical min-h-[100px] resize-none"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-mono uppercase tracking-wide text-muted-foreground">
          Product Images *
        </Label>
        <ImageUpload
          images={formData.images}
          onImagesChange={(images) => onFormChange({ images })}
          maxImages={5}
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={onSubmit}
        disabled={!isValid || isLoading}
        variant="tactical"
        size="lg"
        className="w-full h-12"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analysing & Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Product Copy
          </>
        )}
      </Button>
    </div>
  );
};

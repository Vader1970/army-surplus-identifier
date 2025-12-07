import React, { useState } from "react";
import { ProductForm } from "@/components/ProductForm";
import { OutputPanel } from "@/components/OutputPanel";
import { ProductFormData, GeneratedContent, VisionAnalysis } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    category: "",
    isCollectable: false,
    staffNotes: "",
    images: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [visionAnalysis, setVisionAnalysis] = useState<VisionAnalysis | null>(null);

  const handleFormChange = (data: Partial<ProductFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNewProduct = () => {
    setFormData({
      title: "",
      category: "",
      isCollectable: false,
      staffNotes: "",
      images: [],
    });
    setGeneratedContent(null);
    setVisionAnalysis(null);
  };

  const handleGenerate = async () => {
    if (!formData.title.trim() || formData.images.length === 0) {
      toast.error("Please provide a title and upload at least one image");
      return;
    }

    setIsLoading(true);
    setGeneratedContent(null);
    setVisionAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-product-copy", {
        body: {
          title: formData.title,
          category: formData.category,
          isCollectable: formData.isCollectable,
          staffNotes: formData.staffNotes,
          images: formData.images,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to generate content");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setVisionAnalysis(data.visionAnalysis);
      setGeneratedContent(data.generatedContent);
      toast.success("Product copy generated successfully!");
    } catch (err) {
      console.error("Generation error:", err);
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background military-grid">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-mono text-lg font-semibold tracking-wide uppercase">
                Surplus Identifier
              </h1>
              <p className="text-xs text-muted-foreground">
                AI Product Copy Generator
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="tactical" size="sm" onClick={handleNewProduct}>
              <Plus className="w-4 h-4" />
              New Product
            </Button>
            {/* <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <Package className="w-4 h-4" />
              <span>Internal Tool</span>
            </div> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            <div className="tactical-panel rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-primary status-dot" />
                <h2 className="font-mono text-sm uppercase tracking-wide text-muted-foreground">
                  Product Details
                </h2>
              </div>
              <ProductForm
                formData={formData}
                onFormChange={handleFormChange}
                onSubmit={handleGenerate}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="space-y-6">
            <div className="tactical-panel rounded-lg p-6 min-h-[600px]">
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-2 h-2 rounded-full ${generatedContent ? 'bg-green-500' : 'bg-muted-foreground'} status-dot`} />
                <h2 className="font-mono text-sm uppercase tracking-wide text-muted-foreground">
                  Generated Output
                </h2>
              </div>
              <OutputPanel
                content={generatedContent}
                visionAnalysis={visionAnalysis}
                isLoading={isLoading}
                onRegenerate={handleGenerate}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-8">
        <div className="container max-w-7xl mx-auto px-4 text-center text-xs text-muted-foreground font-mono">
          Army Surplus Identifier • Powered by AI Vision & Language Models
        </div>
      </footer>
    </div>
  );
};

export default Index;

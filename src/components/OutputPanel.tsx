import React from "react";
import { GeneratedContent, VisionAnalysis } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  RefreshCw,
  FileText,
  List,
  Tag,
  AlertCircle,
  Sparkles,
  FolderTree,
  Search,
} from "lucide-react";
import { toast } from "sonner";

interface OutputPanelProps {
  content: GeneratedContent | null;
  visionAnalysis: VisionAnalysis | null;
  isLoading: boolean;
  onRegenerate: () => void;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  content,
  visionAnalysis,
  isLoading,
  onRegenerate,
}) => {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-accent status-dot" />
          <span className="font-mono text-sm text-muted-foreground uppercase tracking-wide">
            Processing...
          </span>
        </div>

        {/* Skeleton loaders */}
        <div className="space-y-3">
          <div className="skeleton-tactical h-4 w-24" />
          <div className="skeleton-tactical h-10 w-full" />
        </div>
        <div className="space-y-3">
          <div className="skeleton-tactical h-4 w-28" />
          <div className="skeleton-tactical h-32 w-full" />
        </div>
        <div className="space-y-3">
          <div className="skeleton-tactical h-4 w-20" />
          <div className="skeleton-tactical h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 text-center">
        <div className="w-16 h-16 rounded-xl bg-muted/50 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          Ready to Generate
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Fill in the product details and upload an image to generate
          professional copy for your Shopify listing.
        </p>
      </div>
    );
  }

  const featuresText = content.features.join("\n");

  return (
    <div className="space-y-6 animate-slide-in-right">
      {/* Vision Analysis Summary */}
      {visionAnalysis && (
        <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-wide text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              AI Analysis
            </div>
            <div className="flex items-center gap-2">
              {visionAnalysis.isLikelyReplica && (
                <Badge variant="outline" className="text-xs font-mono bg-amber-500/10 text-amber-600 border-amber-500/30">
                  Likely Replica
                </Badge>
              )}
              <Badge 
                variant="outline" 
                className={`text-xs font-mono ${
                  visionAnalysis.confidence >= 0.8 
                    ? 'bg-green-500/10 text-green-600 border-green-500/30' 
                    : visionAnalysis.confidence >= 0.5 
                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                    : 'bg-red-500/10 text-red-600 border-red-500/30'
                }`}
              >
                {Math.round(visionAnalysis.confidence * 100)}% confident
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Identified as:</span>
              <p className="font-medium">{visionAnalysis.guessedName || 'UNKNOWN'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Origin:</span>
              <p className="font-medium">{visionAnalysis.branchOrNation || 'UNKNOWN'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Era:</span>
              <p className="font-medium">{visionAnalysis.eraOrDecade || 'UNKNOWN'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Condition:</span>
              <p className="font-medium">{visionAnalysis.conditionGuess || 'UNKNOWN'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Title */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Suggested Title
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(content.suggestedTitle, "Title")}
            className="h-8 px-2"
          >
            {copiedField === "Title" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="p-3 rounded-md bg-muted/50 border border-border font-medium">
          {content.suggestedTitle}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Description
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(content.description, "Description")}
            className="h-8 px-2"
          >
            {copiedField === "Description" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
        <Textarea
          readOnly
          value={content.description}
          className="input-tactical min-h-[200px] resize-none text-sm leading-relaxed"
        />
      </div>

      {/* Features */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <List className="w-4 h-4" />
            Features
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(featuresText, "Features")}
            className="h-8 px-2"
          >
            {copiedField === "Features" ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="p-4 rounded-md bg-muted/30 border border-border">
          <ul className="space-y-2">
            {content.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm"
              >
                <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Suggested Tags
        </Label>
        <div className="flex flex-wrap gap-2">
          {content.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="font-mono text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Navigation Placement */}
      {content.navPath && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <FolderTree className="w-4 h-4" />
              Navigation Placement
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(content.navPath, "Navigation")}
              className="h-8 px-2"
            >
              {copiedField === "Navigation" ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="p-3 rounded-md bg-muted/50 border border-border font-medium text-sm">
            {content.navPath}
          </div>
        </div>
      )}

      {/* SEO Metadata */}
      {content.seo && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <Search className="w-4 h-4" />
              SEO Metadata
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const seoBlock = `Meta Title: ${content.seo.metaTitle}\n\nMeta Description: ${content.seo.metaDescription}\n\nMeta Keywords: ${content.seo.metaKeywords?.join(", ") || ""}`;
                copyToClipboard(seoBlock, "All SEO");
              }}
              className="h-7 px-2 text-xs"
            >
              {copiedField === "All SEO" ? (
                <Check className="w-3 h-3 mr-1 text-green-500" />
              ) : (
                <Copy className="w-3 h-3 mr-1" />
              )}
              Copy All SEO
            </Button>
          </div>
          
          {/* Meta Title */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${
                (content.seo.metaTitle?.length || 0) >= 55 && (content.seo.metaTitle?.length || 0) <= 65
                  ? 'text-green-600'
                  : (content.seo.metaTitle?.length || 0) >= 45 && (content.seo.metaTitle?.length || 0) <= 70
                  ? 'text-amber-600'
                  : 'text-red-600'
              }`}>
                Meta Title ({content.seo.metaTitle?.length || 0}/55-65 chars)
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(content.seo.metaTitle, "Meta Title")}
                className="h-6 px-2"
              >
                {copiedField === "Meta Title" ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>
            <div className="p-2 rounded-md bg-muted/30 border border-border text-sm">
              {content.seo.metaTitle}
            </div>
          </div>

          {/* Meta Description */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${
                (content.seo.metaDescription?.length || 0) >= 140 && (content.seo.metaDescription?.length || 0) <= 160
                  ? 'text-green-600'
                  : (content.seo.metaDescription?.length || 0) >= 120 && (content.seo.metaDescription?.length || 0) <= 170
                  ? 'text-amber-600'
                  : 'text-red-600'
              }`}>
                Meta Description ({content.seo.metaDescription?.length || 0}/140-160 chars)
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(content.seo.metaDescription, "Meta Description")}
                className="h-6 px-2"
              >
                {copiedField === "Meta Description" ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>
            <div className="p-2 rounded-md bg-muted/30 border border-border text-sm">
              {content.seo.metaDescription}
            </div>
          </div>

          {/* Meta Keywords */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Meta Keywords</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(content.seo.metaKeywords?.join(", ") || "", "Meta Keywords")}
                className="h-6 px-2"
              >
                {copiedField === "Meta Keywords" ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {content.seo.metaKeywords?.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="font-mono text-xs"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notes for Lister */}
      {content.notesForLister && (
        <div className="space-y-2">
          <Label className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Internal Notes
          </Label>
          <div className="p-3 rounded-md bg-accent/10 border border-accent/30 text-sm text-muted-foreground">
            {content.notesForLister}
          </div>
        </div>
      )}

      {/* Regenerate Button */}
      <Button
        variant="outline"
        onClick={onRegenerate}
        className="w-full"
      >
        <RefreshCw className="w-4 h-4" />
        Regenerate with Same Inputs
      </Button>
    </div>
  );
};

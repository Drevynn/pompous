import { useState } from "react";
import { BrandBible, LogoIdea, SecondaryMark } from "../types";
import { Image, Sparkles, Download, RefreshCw, Layers, Check, AlertCircle } from "lucide-react";

interface LogoStudioProps {
  brandBible: BrandBible;
}

export default function LogoStudio({ brandBible }: LogoStudioProps) {
  const [selectedAsset, setSelectedAsset] = useState<{
    id: string;
    name: string;
    prompt: string;
    type: "primary" | "secondary";
  }>({
    id: "primary",
    name: "Primary Logo",
    prompt: brandBible.primaryLogoIdea.detailedPrompt,
    type: "primary"
  });

  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // List of all selectable visual marks
  const assets = [
    {
      id: "primary",
      name: "Primary Logo Mark",
      prompt: brandBible.primaryLogoIdea.detailedPrompt,
      concept: brandBible.primaryLogoIdea.concept,
      elements: brandBible.primaryLogoIdea.visualElements,
      type: "primary" as const
    },
    ...brandBible.secondaryMarks.map((mark, index) => ({
      id: `secondary-${index}`,
      name: mark.name,
      prompt: mark.detailedPrompt,
      concept: mark.description,
      elements: [],
      type: "secondary" as const
    }))
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: selectedAsset.prompt,
          size: imageSize
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate image.");
      }

      setGeneratedImages(prev => ({
        ...prev,
        [selectedAsset.id]: data.imageUrl
      }));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during image generation.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (base64Url: string, name: string) => {
    const link = document.createElement("a");
    link.href = base64Url;
    link.download = `${brandBible.bandName.toLowerCase().replace(/\s+/g, "_")}_${name.toLowerCase().replace(/\s+/g, "_")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentAssetDetails = assets.find(a => a.id === selectedAsset.id);
  const currentGeneratedImage = generatedImages[selectedAsset.id];

  return (
    <div id="logo-studio-card" className="bento-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#262626]">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">01 // Primary Identity Studio</span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Image className="w-5 h-5 text-[#00F5D4]" />
            Logo & Visual Marks
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Generate high-resolution branding assets with Gemini 3 Pro Image Preview.
          </p>
        </div>

        {/* Image Size Selection */}
        <div className="flex items-center gap-2 bg-[#050505] p-1 rounded-xl border border-[#262626]">
          <span className="text-[10px] text-zinc-500 px-2 font-mono">SIZE:</span>
          {(["1K", "2K", "4K"] as const).map(size => (
            <button
              key={size}
              id={`size-btn-${size}`}
              onClick={() => setImageSize(size)}
              className={`px-3 py-1 rounded-lg text-[10px] font-mono font-medium transition-all ${
                imageSize === size
                  ? "bg-white text-black font-bold shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Asset Selection & Details */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Select Mark to Design</label>
            <div className="flex flex-col gap-2 bg-[#050505] p-2 rounded-2xl border border-[#262626]">
              {assets.map(asset => {
                const isSelected = selectedAsset.id === asset.id;
                const isGenerated = !!generatedImages[asset.id];
                return (
                  <button
                    key={asset.id}
                    id={`asset-select-${asset.id}`}
                    onClick={() => setSelectedAsset({
                      id: asset.id,
                      name: asset.name,
                      prompt: asset.prompt,
                      type: asset.type
                    })}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                      isSelected
                        ? "bg-[#0F0F0F] border border-[#00F5D4]/50 text-white"
                        : "border border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${isSelected ? "bg-[#00F5D4]/10 text-[#00F5D4]" : "bg-zinc-900 text-zinc-500"}`}>
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold">{asset.name}</div>
                        <div className="text-[10px] text-zinc-500 truncate max-w-[180px]">{asset.concept}</div>
                      </div>
                    </div>
                    {isGenerated && (
                      <span className="bg-emerald-500/10 text-emerald-400 p-1 rounded-full text-[10px]">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {currentAssetDetails && (
            <div className="bg-[#050505]/60 p-4 rounded-2xl border border-[#262626] flex-grow">
              <h3 className="text-[10px] font-bold text-[#00F5D4] font-mono tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                DESIGN CONCEPT
              </h3>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                {currentAssetDetails.concept}
              </p>

              {currentAssetDetails.elements.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Visual Elements</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {currentAssetDetails.elements.map((el, i) => (
                      <span key={i} className="text-[10px] bg-zinc-900 border border-[#262626] text-zinc-400 px-2 py-0.5 rounded-lg font-mono">
                        {el}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-[#262626]">
                <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Synthesizer Prompt</label>
                <div className="text-[10px] font-mono bg-[#050505] p-2.5 rounded-lg border border-[#262626] text-zinc-400 max-h-24 overflow-y-auto leading-relaxed">
                  {selectedAsset.prompt}
                </div>
              </div>
            </div>
          )}

          <button
            id="generate-asset-btn"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-zinc-800" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#00F5D4]" />
                Generate {selectedAsset.name}
              </>
            )}
          </button>
        </div>

        {/* Right Column: Visual Canvas / Output */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[350px] bg-[#050505] border border-[#262626] rounded-2xl relative p-6 overflow-hidden">
          {error && (
            <div className="absolute top-4 left-4 right-4 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-rose-400 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Generation Failed: </span>
                {error}
              </div>
            </div>
          )}

          {currentGeneratedImage ? (
            <div className="group relative w-full h-full max-w-[320px] aspect-square bg-black rounded-xl border border-[#262626] overflow-hidden shadow-2xl flex items-center justify-center">
              <img
                src={currentGeneratedImage}
                alt={selectedAsset.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3">
                <span className="text-xs font-mono text-zinc-300 font-medium">{selectedAsset.name} ({imageSize})</span>
                <button
                  id={`download-${selectedAsset.id}`}
                  onClick={() => handleDownload(currentGeneratedImage, selectedAsset.name)}
                  className="bg-white hover:bg-zinc-200 text-black text-xs font-bold py-2 px-4 rounded-full flex items-center gap-2 shadow transition-all transform hover:scale-105"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PNG
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center max-w-[280px]">
              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-zinc-800 border-t-[#00F5D4] animate-spin"></div>
                    <Sparkles className="w-6 h-6 text-[#00F5D4] absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-300 font-mono uppercase tracking-widest animate-pulse">Designing Asset</h4>
                    <p className="text-[10px] text-zinc-500 mt-1 font-mono leading-relaxed">
                      Calling Gemini 3 Pro. Compiling visual structures...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-[#0F0F0F] border border-[#262626] flex items-center justify-center text-zinc-600 mb-4 shadow-inner">
                    <Image className="w-6 h-6 text-[#00F5D4]" />
                  </div>
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">No Image Synthesized Yet</h4>
                  <p className="text-[11px] text-zinc-500 mt-2 font-mono leading-relaxed">
                    Click the generate action button below to invoke Swedish designer Sven's image vision.
                  </p>
                </>
              )}
            </div>
          )}

          {/* Prompt info helper if an image is loaded */}
          {currentGeneratedImage && !loading && (
            <div className="mt-4 text-[10px] font-mono text-zinc-500 text-center">
              Successfully rendered as <span className="text-[#00F5D4]">{imageSize}</span> PNG layout.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

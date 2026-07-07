import { useState } from "react";
import { BrandBible, MarketingAsset } from "../types";
import { Sparkles, Download, RefreshCw, Disc, Compass, Award, AlertCircle, Eye } from "lucide-react";

interface MerchMockupsProps {
  brandBible: BrandBible;
}

export default function MerchMockups({ brandBible }: MerchMockupsProps) {
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});
  const [errorMap, setErrorMap] = useState<Record<number, string | null>>({});
  const [mockupImages, setMockupImages] = useState<Record<number, string>>({});

  const handleGenerateMockup = async (asset: MarketingAsset, index: number) => {
    setLoadingMap(prev => ({ ...prev, [index]: true }));
    setErrorMap(prev => ({ ...prev, [index]: null }));

    try {
      const response = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${asset.prompt}, using color scheme ${brandBible.colors.map(c => c.hex).join(", ")}, modern high-quality graphic asset mockup`,
          size: "1K" // Standard size for merch mockups is perfect
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate mockup image.");
      }

      setMockupImages(prev => ({ ...prev, [index]: data.imageUrl }));
    } catch (error: any) {
      console.error(error);
      setErrorMap(prev => ({ ...prev, [index]: error.message || "Mockup render failed." }));
    } finally {
      setLoadingMap(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleDownload = (base64Url: string, type: string) => {
    const link = document.createElement("a");
    link.href = base64Url;
    link.download = `${brandBible.bandName.toLowerCase().replace(/\s+/g, "_")}_${type.toLowerCase().replace(/\s+/g, "_")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Icon switcher helper
  const getAssetIcon = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes("cover") || lower.includes("album") || lower.includes("vinyl") || lower.includes("cd")) {
      return <Disc className="w-5 h-5 text-purple-400" />;
    }
    if (lower.includes("poster") || lower.includes("flyer")) {
      return <Compass className="w-5 h-5 text-amber-400" />;
    }
    return <Award className="w-5 h-5 text-cyan-400" />;
  };

  return (
    <div id="merch-mockups-card" className="bento-card">
      <div className="mb-6 pb-6 border-b border-[#262626]">
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">04 // Graphic Collateral</span>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Disc className="w-5 h-5 text-[#00F5D4]" />
          Brand Application & Merch Mockups
        </h2>
        <p className="text-zinc-400 text-xs mt-1">
          Apply your new visual language across standard release and merchandising channels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {brandBible.marketingAssets.map((asset, index) => {
          const isGenerating = !!loadingMap[index];
          const hasError = errorMap[index];
          const mockImage = mockupImages[index];

          return (
            <div
              key={index}
              className="bg-[#050505] rounded-2xl border border-[#262626] overflow-hidden flex flex-col justify-between"
            >
              {/* Visual Display Screen */}
              <div className="w-full aspect-[4/3] bg-black border-b border-[#262626] relative flex items-center justify-center overflow-hidden group">
                {mockImage ? (
                  <>
                    <img
                      src={mockImage}
                      alt={asset.type}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        id={`download-merch-btn-${index}`}
                        onClick={() => handleDownload(mockImage, asset.type)}
                        className="bg-white hover:bg-zinc-200 text-black font-bold py-1.5 px-3 rounded-full text-xs flex items-center gap-1.5 shadow transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Artwork
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center max-w-[200px] flex flex-col items-center">
                    {isGenerating ? (
                      <div className="flex flex-col items-center gap-3">
                        <RefreshCw className="w-8 h-8 text-[#00F5D4] animate-spin" />
                        <span className="text-[10px] font-mono text-zinc-400">Rendering...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-[#0F0F0F] flex items-center justify-center text-zinc-500 border border-[#262626] mb-3 shadow">
                          {getAssetIcon(asset.type)}
                        </div>
                        <h5 className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider mb-1">{asset.type}</h5>
                        <p className="text-[10px] text-zinc-500 leading-normal">
                          Click below to compile SVGs and textures with Gemini.
                        </p>
                      </>
                    )}
                  </div>
                )}

                {hasError && (
                  <div className="absolute inset-x-2 top-2 bg-rose-500/10 border border-rose-500/20 rounded p-2 text-[10px] text-rose-400 flex items-start gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span className="truncate">{hasError}</span>
                  </div>
                )}
              </div>

              {/* Asset Copy Content */}
              <div className="p-4 flex-grow flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-[#0F0F0F] border border-[#262626] text-[#00F5D4]">
                      {getAssetIcon(asset.type)}
                    </span>
                    <h4 className="text-xs font-bold text-white">{asset.type}</h4>
                  </div>
                  <p className="text-zinc-400 text-xs mt-2.5 leading-relaxed">
                    {asset.layoutDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#262626] flex flex-col gap-2">
                  <div className="text-[9px] font-mono text-zinc-500 line-clamp-1">
                    <span className="text-zinc-650 font-bold">PROMPT: </span>
                    {asset.prompt}
                  </div>
                  <button
                    id={`generate-merch-btn-${index}`}
                    onClick={() => handleGenerateMockup(asset, index)}
                    disabled={isGenerating}
                    className="w-full bg-[#0F0F0F] hover:bg-zinc-900 text-white hover:text-white border border-[#262626] hover:border-zinc-500 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 uppercase tracking-wider"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin text-zinc-400" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-[#00F5D4]" />
                        Render Mockup
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

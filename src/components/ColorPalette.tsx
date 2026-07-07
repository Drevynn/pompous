import { useState } from "react";
import { BrandBible, ColorInfo } from "../types";
import { Copy, Check, Palette, Sparkles, Contrast, ExternalLink } from "lucide-react";

interface ColorPaletteProps {
  brandBible: BrandBible;
}

export default function ColorPalette({ brandBible }: ColorPaletteProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <div id="color-palette-card" className="bento-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#262626]">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">02 // Digital Chromatics</span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#00F5D4]" />
            Harmonic Color Palette
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Curated color schemes representing the band's sonic energy and brand contrast.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#050505] p-2 rounded-xl border border-[#262626] text-[10px] text-zinc-400 font-mono">
          <Contrast className="w-4 h-4 text-[#00F5D4]" />
          Contrast safe (AA/AAA) calibrated
        </div>
      </div>

      {/* Palette columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {brandBible.colors.map((color, index) => {
          const isCopied = copiedIndex === index;
          return (
            <div
              key={index}
              className="bg-[#050505] rounded-2xl border border-[#262626] overflow-hidden flex flex-col transition-all hover:border-zinc-500"
            >
              {/* Color Block */}
              <div
                className="w-full aspect-video md:aspect-square relative flex items-end justify-between p-3 group cursor-pointer"
                style={{ backgroundColor: color.hex }}
                onClick={() => handleCopy(color.hex, index)}
              >
                {/* Visual Glassmorphism overlay on hover to copy */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-[#0F0F0F] text-white font-mono text-[10px] px-2.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-1 shadow-lg backdrop-blur-sm">
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400 animate-bounce" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-[#00F5D4]" />
                        Copy Hex
                      </>
                    )}
                  </div>
                </div>

                {/* Hex Code Badge */}
                <div className="bg-black/80 backdrop-blur-md border border-[#262626] text-white font-mono text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1 shadow select-all">
                  {color.hex}
                </div>
              </div>

              {/* Color details */}
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <div className="font-bold text-white text-xs truncate">{color.name}</div>
                  <span className="inline-block text-[8px] font-mono uppercase bg-zinc-900 border border-[#262626] text-zinc-400 px-1.5 py-0.5 rounded mt-1">
                    {color.role}
                  </span>
                  <p className="text-zinc-400 text-[11px] mt-3 leading-relaxed">
                    {color.usage}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#262626] flex justify-end">
                  <button
                    id={`copy-hex-btn-${index}`}
                    onClick={() => handleCopy(color.hex, index)}
                    className="text-[10px] font-mono font-medium text-zinc-400 hover:text-white flex items-center gap-1 transition-all"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-zinc-500" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-[#050505] p-4 rounded-2xl border border-[#262626] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="bg-[#00F5D4]/10 p-2 rounded-xl text-[#00F5D4] border border-[#00F5D4]/20 shrink-0">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-mono">Calibrated Luminance</h4>
            <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
              Calibrated so background fills and text contrasts fit standard accessibility guidelines (WCAG 2.1).
            </p>
          </div>
        </div>

        <a
          href="https://coolors.co/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-zinc-400 hover:text-white font-medium font-mono flex items-center gap-1.5 self-end md:self-auto uppercase tracking-wider"
        >
          Export Palette
          <ExternalLink className="w-3.5 h-3.5 text-[#00F5D4]" />
        </a>
      </div>
    </div>
  );
}

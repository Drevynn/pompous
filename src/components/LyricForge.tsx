import { useState } from "react";
import { BrandBible } from "../types";
import { Music, MessageSquare, Copy, Check, Hash, Sparkles } from "lucide-react";

interface LyricForgeProps {
  brandBible: BrandBible;
}

export default function LyricForge({ brandBible }: LyricForgeProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const lyricIdeas = brandBible.lyricConcepts?.lyricIdeas || [];
  const thematicConcepts = brandBible.lyricConcepts?.thematicConcepts || [];

  const handleCopyLyric = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div id="lyric-forge-card" className="bento-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#262626]">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">06 // Lyric Forge & Narratives</span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-[#00F5D4]" />
            Lyric Forge & Thematic Concepts
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Poetic lyric sparks and overarching themes calibrated to the band's aesthetic and core sound.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#050505] p-2 rounded-xl border border-[#262626] text-[10px] text-zinc-400 font-mono">
          <Sparkles className="w-4 h-4 text-[#00F5D4]" />
          Songwriting Lab Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lyric Ideas Left Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#00F5D4]" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              10 Creative Lyric Starters
            </h3>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
            {lyricIdeas.length > 0 ? (
              lyricIdeas.map((lyric, idx) => {
                const isCopied = copiedIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-[#050505] border border-[#262626] rounded-xl p-3.5 flex items-start justify-between gap-4 group hover:border-[#00F5D4]/40 transition-all"
                  >
                    <div className="flex gap-2.5">
                      <span className="text-[9px] font-mono text-zinc-650 mt-1">
                        {(idx + 1).toString().padStart(2, "0")}
                      </span>
                      <p 
                        className="text-xs text-zinc-200 italic leading-relaxed"
                        style={{ fontFamily: `'${brandBible.typography.bodyFont}', sans-serif` }}
                      >
                        "{lyric}"
                      </p>
                    </div>
                    <button
                      id={`copy-lyric-btn-${idx}`}
                      onClick={() => handleCopyLyric(lyric, idx)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-white transition-opacity shrink-0"
                      title="Copy lyric"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-zinc-500 italic">No lyric suggestions generated yet.</p>
            )}
          </div>
        </div>

        {/* Thematic Concepts Right Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-[#00F5D4]" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              3 Album / Single Thematic Frameworks
            </h3>
          </div>

          <div className="space-y-4">
            {thematicConcepts.length > 0 ? (
              thematicConcepts.map((theme, idx) => (
                <div
                  key={idx}
                  className="bg-[#050505] border border-[#262626] rounded-2xl p-5 relative overflow-hidden group hover:border-zinc-500 transition-all flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#00F5D4]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#00F5D4]/10 transition-colors"></div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] font-mono font-bold text-[#00F5D4] bg-[#00F5D4]/10 px-2 py-0.5 rounded-lg border border-[#00F5D4]/20">
                        CONCEPT {idx + 1}
                      </span>
                    </div>
                    <h4 
                      className="text-sm font-bold text-white tracking-tight"
                      style={{ fontFamily: `'${brandBible.typography.headerFont}', sans-serif` }}
                    >
                      {theme.title}
                    </h4>
                    <p className="text-zinc-400 text-[11px] mt-2.5 leading-relaxed">
                      {theme.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 italic">No thematic concepts generated yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { BrandBible } from "../types";
import { Share2, Copy, Check, Sparkles, AlertCircle, Calendar } from "lucide-react";

interface SocialMediaKitProps {
  brandBible: BrandBible;
}

export default function SocialMediaKit({ brandBible }: SocialMediaKitProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const posts = brandBible.socialMediaTemplates || [];

  const handleCopyCaption = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div id="social-media-kit-card" className="bento-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#262626]">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">07 // Social Media Content Kit</span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#00F5D4]" />
            Social Media Post Templates
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Ready-to-use post blueprints designed to maintain consistent messaging and visual coherence.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#050505] p-2 rounded-xl border border-[#262626] text-[10px] text-zinc-400 font-mono">
          <Calendar className="w-4 h-4 text-[#00F5D4]" />
          5 Active Blueprints
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {posts.length > 0 ? (
          posts.map((post, idx) => {
            const isCopied = copiedIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#050505] rounded-2xl border border-[#262626] hover:border-zinc-500 transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Channel Header */}
                <div className="p-4 border-b border-[#262626] bg-[#0A0A0A] flex justify-between items-center">
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono uppercase text-[#00F5D4] font-bold tracking-wider block">
                      {post.platform}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-semibold truncate block mt-0.5">
                      {post.purpose}
                    </span>
                  </div>
                  <button
                    id={`copy-caption-btn-${idx}`}
                    onClick={() => handleCopyCaption(post.caption, idx)}
                    className="p-1.5 rounded-lg bg-[#0F0F0F] hover:bg-zinc-900 border border-[#262626] text-zinc-500 hover:text-white transition-all shrink-0"
                    title="Copy Caption Text"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Caption Block */}
                <div className="p-4 flex-grow flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-[8px] font-mono text-zinc-650 uppercase tracking-widest block mb-1.5">Caption Body</span>
                    <div className="bg-[#0F0F0F] rounded-xl p-3 border border-[#262626] max-h-[140px] overflow-y-auto scrollbar-none">
                      <p className="text-zinc-300 text-[11px] leading-relaxed whitespace-pre-wrap select-all font-sans">
                        {post.caption}
                      </p>
                    </div>
                  </div>

                  {/* Suggestion block */}
                  <div className="pt-3 border-t border-[#262626]">
                    <span className="text-[8px] font-mono text-zinc-650 uppercase tracking-widest block mb-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-[#00F5D4]" />
                      Visual Directive
                    </span>
                    <p className="text-zinc-400 text-[10px] leading-relaxed italic">
                      {post.imageSuggestion}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-5 py-8 text-center text-xs text-zinc-500 italic">
            No social media templates generated yet.
          </div>
        )}
      </div>
    </div>
  );
}

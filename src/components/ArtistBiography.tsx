import { useState } from "react";
import { BrandBible } from "../types";
import { FileText, Copy, Check, Sparkles } from "lucide-react";

interface ArtistBiographyProps {
  brandBible: BrandBible;
}

export default function ArtistBiography({ brandBible }: ArtistBiographyProps) {
  const [copiedBio, setCopiedBio] = useState(false);
  const [copiedBlurb, setCopiedBlurb] = useState(false);

  const bio = brandBible.artistBio?.biography || "No biography generated yet.";
  const blurb = brandBible.artistBio?.pressKitBlurb || "No press kit blurb generated yet.";

  const handleCopyBio = () => {
    navigator.clipboard.writeText(bio);
    setCopiedBio(true);
    setTimeout(() => setCopiedBio(false), 2000);
  };

  const handleCopyBlurb = () => {
    navigator.clipboard.writeText(blurb);
    setCopiedBlurb(true);
    setTimeout(() => setCopiedBlurb(false), 2000);
  };

  return (
    <div id="artist-biography-card" className="bento-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#262626]">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">05 // Identity Copy & Press Kit</span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#00F5D4]" />
            Artist Biography & EPK
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Professional biography and headlines curated to capture your unique sound and brand aesthetic.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#050505] p-2 rounded-xl border border-[#262626] text-[10px] text-zinc-400 font-mono">
          <Sparkles className="w-4 h-4 text-[#00F5D4]" />
          Press Ready
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Press Kit blurb & Quick stats */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-[#050505] p-5 rounded-2xl border border-[#262626] flex flex-col justify-between h-full hover:border-zinc-500 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-mono uppercase text-[#00F5D4] font-bold tracking-widest">High Impact Hook</span>
                <button
                  id="copy-blurb-btn"
                  onClick={handleCopyBlurb}
                  className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all"
                  title="Copy press kit blurb"
                >
                  {copiedBlurb ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed italic" style={{ fontFamily: `'${brandBible.typography.headerFont}', sans-serif` }}>
                "{blurb}"
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#262626]">
              <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 font-bold">Recommended Uses</div>
              <ul className="text-[10px] text-zinc-400 space-y-1.5 list-disc pl-3">
                <li>Festival line-up cards</li>
                <li>Spotify artist header</li>
                <li>Instagram bio intro</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right column - Full detailed biography */}
        <div className="lg:col-span-2">
          <div className="bg-[#050505] p-6 rounded-2xl border border-[#262626] hover:border-zinc-500 transition-all relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-mono uppercase text-[#00F5D4] font-bold tracking-widest">Official Press Biography</span>
              <button
                id="copy-bio-btn"
                onClick={handleCopyBio}
                className="text-[10px] font-mono font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 bg-[#0F0F0F] px-2.5 py-1.5 rounded-xl border border-[#262626] transition-all"
              >
                {copiedBio ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-500" />
                    Copy Bio
                  </>
                )}
              </button>
            </div>
            
            <p 
              className="text-zinc-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap select-text font-light"
              style={{ fontFamily: `'${brandBible.typography.bodyFont}', sans-serif` }}
            >
              {bio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

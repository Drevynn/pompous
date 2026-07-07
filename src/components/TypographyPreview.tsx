import { useEffect, useState } from "react";
import { BrandBible } from "../types";
import { Type as TypeIcon, Sparkles, Sliders, Heading1, CaseSensitive } from "lucide-react";

interface TypographyPreviewProps {
  brandBible: BrandBible;
}

export default function TypographyPreview({ brandBible }: TypographyPreviewProps) {
  const { headerFont, headerFontWeight, bodyFont, bodyFontWeight, pairingExplanation } = brandBible.typography;

  const [headerSize, setHeaderSize] = useState<number>(44);
  const [headerTracking, setHeaderTracking] = useState<string>("tracking-normal");
  const [textCase, setTextCase] = useState<"uppercase" | "normal-case" | "lowercase">("uppercase");
  const [sampleText, setSampleText] = useState<string>(
    "We write anthems for the quiet revolution, building monuments out of sound and electric air."
  );

  // Dynamically load Google Fonts when the suggestion changes
  useEffect(() => {
    if (!headerFont || !bodyFont) return;

    const linkId = "google-fonts-link";
    let linkElement = document.getElementById(linkId) as HTMLLinkElement | null;

    if (!linkElement) {
      linkElement = document.createElement("link");
      linkElement.id = linkId;
      linkElement.rel = "stylesheet";
      document.head.appendChild(linkElement);
    }

    // Clean up font names for URL (spaces replaced by '+')
    const formattedHeader = headerFont.trim().replace(/\s+/g, "+");
    const formattedBody = bodyFont.trim().replace(/\s+/g, "+");

    linkElement.href = `https://fonts.googleapis.com/css2?family=${formattedHeader}:wght@400;700;800;900&family=${formattedBody}:wght@300;400;600;700&display=swap`;
  }, [headerFont, bodyFont]);

  // Class mapping for tracking
  const trackingClasses = {
    "tracking-tighter": "tracking-tighter",
    "tracking-tight": "tracking-tight",
    "tracking-normal": "tracking-normal",
    "tracking-wide": "tracking-wide",
    "tracking-widest": "tracking-widest",
  };

  return (
    <div id="typography-preview-card" className="bento-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#262626]">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold block mb-1">03 // Typography Pairing</span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TypeIcon className="w-5 h-5 text-[#00F5D4]" />
            Dynamic Typography Pairing
          </h2>
          <p className="text-zinc-400 text-xs mt-1">
            Universally available Google Fonts pairing tailored for your genre's layout.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#050505] p-1.5 rounded-xl border border-[#262626] text-[10px] font-mono">
          <span className="text-zinc-500">HEADS:</span>
          <span className="text-[#00F5D4] font-bold">{headerFont}</span>
          <span className="text-zinc-700">|</span>
          <span className="text-zinc-500">BODY:</span>
          <span className="text-[#00F5D4] font-bold">{bodyFont}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: live preview stage */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[#050505] border border-[#262626] p-6 rounded-2xl flex-grow flex flex-col justify-center min-h-[250px] relative overflow-hidden">
            <span className="absolute top-3 right-4 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
              Live CSS Sandbox
            </span>

            {/* Header font rendering */}
            <h3
              id="live-header-preview"
              style={{ fontFamily: `'${headerFont}', sans-serif`, fontSize: `${headerSize}px` }}
              className={`text-white font-bold border-b border-[#262626] pb-4 mb-4 leading-tight transition-all duration-300 ${textCase} ${headerTracking}`}
            >
              {brandBible.bandName}
            </h3>

            {/* Body font rendering */}
            <div>
              <p className="text-[10px] font-mono text-[#00F5D4] uppercase tracking-widest mb-1.5">
                Band Manifesto
              </p>
              <p
                id="live-body-preview"
                style={{ fontFamily: `'${bodyFont}', sans-serif` }}
                className="text-zinc-300 text-sm md:text-base leading-relaxed"
              >
                {sampleText}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              id="sample-text-input"
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              placeholder="Edit the manifesto sample text..."
              className="w-full bg-[#050505] text-zinc-300 border border-[#262626] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#00F5D4] placeholder-zinc-700 font-mono"
            />
          </div>
        </div>

        {/* Right Column: Customization Controls */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#050505]/40 border border-[#262626] rounded-2xl p-4 flex flex-col gap-4">
            <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 pb-2.5 border-b border-[#262626]">
              <Sliders className="w-3.5 h-3.5 text-[#00F5D4]" />
              Adjust Typographic Casing
            </h4>

            {/* Size Slider */}
            <div>
              <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono mb-1.5">
                <span>HEADER SIZE</span>
                <span className="text-[#00F5D4] font-bold">{headerSize}px</span>
              </div>
              <input
                type="range"
                id="header-size-slider"
                min="24"
                max="64"
                value={headerSize}
                onChange={(e) => setHeaderSize(Number(e.target.value))}
                className="w-full accent-[#00F5D4] cursor-pointer"
              />
            </div>

            {/* Tracking / Letter Spacing */}
            <div>
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">
                Letter Spacing
              </label>
              <div className="grid grid-cols-5 gap-1">
                {(["tracking-tighter", "tracking-tight", "tracking-normal", "tracking-wide", "tracking-widest"] as const).map(
                  (track) => {
                    const label = track.replace("tracking-", "");
                    return (
                      <button
                        key={track}
                        id={`track-btn-${track}`}
                        onClick={() => setHeaderTracking(track)}
                        className={`py-1 text-[9px] font-mono rounded-lg border transition-all ${
                          headerTracking === track
                            ? "bg-[#00F5D4]/10 border-[#00F5D4] text-[#00F5D4] font-bold"
                            : "bg-[#050505] border-[#262626] text-zinc-500 hover:border-zinc-750 hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Casing */}
            <div>
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">
                Text Transformation
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(["uppercase", "normal-case", "lowercase"] as const).map((c) => {
                  const label = c.replace("-case", "");
                  return (
                    <button
                      key={c}
                      id={`casing-btn-${c}`}
                      onClick={() => setTextCase(c)}
                      className={`py-1 text-[9px] font-mono rounded-lg border transition-all uppercase ${
                        textCase === c
                          ? "bg-[#00F5D4]/10 border-[#00F5D4] text-[#00F5D4] font-bold"
                          : "bg-[#050505] border-[#262626] text-zinc-500 hover:border-zinc-750 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-[#00F5D4]/5 border border-[#00F5D4]/10 rounded-2xl p-4">
            <h4 className="text-[10px] font-bold text-white font-mono tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00F5D4]" />
              FONT RATIONALE
            </h4>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              {pairingExplanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { BrandBible } from "./types";
import { motion } from "motion/react";
import LogoStudio from "./components/LogoStudio";
import ColorPalette from "./components/ColorPalette";
import TypographyPreview from "./components/TypographyPreview";
import MerchMockups from "./components/MerchMockups";
import ConsultantChat from "./components/ConsultantChat";
import ArtistBiography from "./components/ArtistBiography";
import LyricForge from "./components/LyricForge";
import SocialMediaKit from "./components/SocialMediaKit";
import { Sparkles, Library, Layers, ChevronRight, Compass, HelpCircle, RefreshCw, AlertCircle, Play } from "lucide-react";

// Framer motion variants for staggered bento grid elements
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 15,
    },
  },
};

// Pre-baked gorgeous brand bible for default load state
const DEFAULT_BRAND_BIBLE: BrandBible = {
  bandName: "Midnight Tracer",
  slogan: "Casting shadow codes through high-voltage neon.",
  aestheticSummary: "A futuristic Cyberpunk Synthwave aesthetic. Driven by laser crimsons, toxic neon greens, and dark stage void shadows, it captures the high-adrenaline essence of 80s arcade cabinets and cybernetic street racing.",
  colors: [
    {
      hex: "#090A0F",
      name: "Stage Void Black",
      role: "Primary Background",
      usage: "Use for primary canvas fills to establish a deep midnight backdrop and ensure high contrast for laser neon headers."
    },
    {
      hex: "#FF0055",
      name: "Laser Crimson",
      role: "Primary Brand Accent",
      usage: "Apply to display typography, logo emblems, and active hover borders to project energetic neon highlight lines."
    },
    {
      hex: "#39FF14",
      name: "Toxic Matrix Green",
      role: "Secondary Accent",
      usage: "Use for special status highlights, grid lines, and secondary visual tags to represent digital corruption."
    },
    {
      hex: "#1A1D2B",
      name: "Cyber slate",
      role: "Container Fill",
      usage: "Use for modular card backgrounds, border lines, and layout sections to provide clear container grouping."
    },
    {
      hex: "#E2E8F0",
      name: "Volt White",
      role: "Main Typography Reading",
      usage: "Use for body paragraphs and long text to secure maximum legibility (AA contrast ratio) against deep slate backgrounds."
    }
  ],
  typography: {
    headerFont: "Space Grotesk",
    headerFontWeight: "Black 900",
    bodyFont: "JetBrains Mono",
    bodyFontWeight: "Regular 400",
    pairingExplanation: "Space Grotesk's geometric angles convey high-tech precision suitable for massive display headlines, while JetBrains Mono injects a technical, digital terminal energy that perfects the synth-coder vibe."
  },
  primaryLogoIdea: {
    concept: "An isolated cybernetic crescent hawk fused with sound wave frequencies, glowing with intense neon backlights.",
    detailedPrompt: "A high-quality minimalist vector band logo of a cybernetic crescent hawk fused with sound waves, glowing neon red and green, centered on a solid flat black background, master graphic design, 8k",
    visualElements: ["Geometric Crescent", "Laser sound waves", "Vector hawk symbol"]
  },
  secondaryMarks: [
    {
      name: "Sub-Mark: Grid Emblem",
      description: "An alternative circular badge for record centers and vinyl spine engravings.",
      detailedPrompt: "A minimalist circular band sub-mark with a cybernetic grid pattern, vector art, glowing neon crimson lines, centered on a plain black background, 8k"
    },
    {
      name: "Typography Monogram",
      description: "A compact 'MT' monogram stylized with custom horizontal neon speed cuts.",
      detailedPrompt: "A futuristic 'MT' lettering monogram band logo, customized speed lines cut, sleek typographic vector mark, neon green, flat solid black background, 8k"
    }
  ],
  marketingAssets: [
    {
      type: "Vinyl Album Cover Mockup",
      layoutDescription: "A retro-futuristic vinyl sleeve showcasing the glowing crescent hawk emblem centered in an infinite grid street tunnel.",
      prompt: "A beautiful cinematic retro-futuristic vinyl record cover mockup featuring a glowing cybernetic crescent hawk icon in a neon grid tunnel, retro 8s synthwave photography, album art, 8k"
    },
    {
      type: "World Tour Poster",
      layoutDescription: "An vertical poster framed with grid borders, Stage Void background, bold typography, and cyberpunk skyline illustration.",
      prompt: "A high-end vertical concert tour poster, cyberpunk neon city skyline, bold display text, vector concert poster, high contrast illustration, 8k"
    },
    {
      type: "Heavyweight Merch Tee",
      layoutDescription: "A street fashion heavy t-shirt layout centering the speed-cut 'MT' monogram in neon laser crimson on the chest.",
      prompt: "A premium black streetwear t-shirt with a glowing neon red MT speed-cut monogram logo graphic printed on the chest, realistic clothing flat lay mockup, 8k"
    }
  ],
  artistBio: {
    biography: "Midnight Tracer is an electronic music unit hailing from the neon-drenched depths of Tokyo and Los Angeles. Blending aggressive 80s outrun analog synthesizers with cinematic cyberpunk production, they create a retro-futuristic soundscape. Their sound is forged by laser-fast arpeggiated basslines, dramatic synth leads, and heavy industrial acoustic-electronic drum machines. Inspired by high-adrenaline arcade cabinets, virtual reality aesthetics, and midnight cyber-racing, Midnight Tracer crafts an immersive identity that exists entirely at the intersection of human flesh and neon circuitry.",
    pressKitBlurb: "Slicing through retro-futurism with high-voltage neon arpeggios, Midnight Tracer is the sound of cybernetic street racing."
  },
  lyricConcepts: {
    lyricIdeas: [
      "We trace the speed of static in the wires.",
      "Red laser headlights cutting through the heavy rain.",
      "Flesh and chrome colliding at the speed of sound.",
      "A digital heart beating inside the copper cage.",
      "Behind the HUD, a silhouette of neon dust.",
      "Just follow the grid lines into the infinite night.",
      "We're running on lithium dreams and midnight fuel.",
      "An arcade monument to our forgotten names.",
      "Re-write the code before the sunrise fades.",
      "Ghost arpeggios echoing in the empty streets."
    ],
    thematicConcepts: [
      {
        title: "Neon Rain & Lithium Dreams",
        description: "A narrative charting a high-speed nocturnal drive through a dystopian metropolis where memories can be purchased, and the rain never stops."
      },
      {
        title: "Arcade Ghosts",
        description: "A retro-themed concepts exploring the nostalgic, haunting frequency of abandoned 1980s game cabinets, glowing with lost codes."
      },
      {
        title: "Copper Pulse & Silicon Flesh",
        description: "A deep dive into cybernetics, exploring the boundary between organic human feelings and automated machine processing in a digital grid."
      }
    ]
  },
  socialMediaTemplates: [
    {
      platform: "Instagram",
      purpose: "Single Release Teaser",
      caption: "🚨 TRANSMISSION INCOMING 🚨\n\nOur latest neon-fused cyber journey is preparing to sync. Track down the frequency of 'LITHIUM SPEEDWAYS' on [Release Date]. Pre-save via the link in our bio. ⚡️🚥\n\n#MidnightTracer #Synthwave #CyberpunkArt #NewMusic",
      imageSuggestion: "A dark cyberpunk vinyl mockup centered in an infinite grid tunnel, back-lit with glowing red and toxic green lasers."
    },
    {
      platform: "Twitter",
      purpose: "Tour Announcement",
      caption: "GRID LOCK 2026. Midnight Tracer is taking the high-voltage live cockpit on the road. Code-breaking sessions start this Fall.\n\n🎟️ Tickets online Friday 10 AM.\n[Link]\n\n#GridLock2026 #Cyberpunk #LiveMusic",
      imageSuggestion: "A sharp vertical concert tour poster displaying a towering neon skyline, runic grids, and a bold Space Grotesk header."
    },
    {
      platform: "Facebook",
      purpose: "Merchandise Drop",
      caption: "Wear the digital code. 💾\n\nThe official Heavyweight 'MT' Monogram Tee is now available. Screenprinted in premium laser crimson on ultra-thick stage void black. Strictly limited. \n\nGet yours now: [Store Link]\n\n#SynthwaveMerch #Streetwear #MidnightTracer",
      imageSuggestion: "A street fashion flat-lay image of a black t-shirt printed with a glowing neon red MT monogram on the chest."
    },
    {
      platform: "Instagram",
      purpose: "Behind The Studio",
      caption: "Tuning the analog arpeggiators inside the tracer lab today. How dense do you want the bass on this record? Let us know in the comments. 🎛️📟\n\n#AnalogSynth #BehindTheScenes #TracerLab #Vaporwave",
      imageSuggestion: "A cinematic, low-light shot of retro synthesizer knobs and dials, glowing with faint laser pink and toxic matrix green LEDs."
    },
    {
      platform: "Twitter",
      purpose: "Fan Celebration",
      caption: "1,000,000 streams on LITHIUM SPEEDWAYS. To every racer in the grid: thank you for tracing the signal with us. 🏎️💨👾\n\n#Milestone #TracerRacers #IndieElectronic",
      imageSuggestion: "A high-contrast graphic card highlighting the primary crescent hawk logo, displaying a massive '1,000,000 STREAMS' in Volt White typography."
    }
  ]
};

// Preset musical templates to make exploration simple and exciting
const STYLE_PRESETS = [
  {
    name: "Cyberpunk Synthwave",
    style: "80s outrun, heavy arpeggios, analog bass, vintage drum machines, retro racing",
    aesthetic: "Retro Synthwave (neon, 80s grid, laser crimson, high voltage contrast)",
    ideas: "A cybernetic crescent hawk or speeding vector vehicle badge"
  },
  {
    name: "Brutalist Metal",
    style: "Downtuned riffs, complex polyrhythms, technical blast beats, industrial distortion",
    aesthetic: "Heavy Metal Brutalist (distorted concrete, runic black/silver, high contrast raw textures)",
    ideas: "A rugged concrete monolithic shield or symmetrical geometric runes"
  },
  {
    name: "Warm Indie Folk",
    style: "Acoustic fingerpicking, warm brass horns, organic strings, storytelling lyrics",
    aesthetic: "Indie Folk Cozy (warm clay oranges, forest greens, rustic wood textures, hand-drawn shapes)",
    ideas: "A hand-sketched mountain pine tree, circular sun rays, or cozy cottage line art"
  },
  {
    name: "Ambient Dream Pop",
    style: "Shimmering delay pedals, ethereal tape loops, warm analog synthesizers, washed reverb",
    aesthetic: "Ethereal Dreamscape (pastel clouds, iridescent lavender, deep stellar navy background)",
    ideas: "A misty holographic orb or cosmic spiral cloud illustration"
  }
];

export default function App() {
  const [bandName, setBandName] = useState("Midnight Tracer");
  const [musicStyle, setMusicStyle] = useState("80s outrun, heavy arpeggios, analog bass, vintage drum machines, retro racing");
  const [aesthetic, setAesthetic] = useState("Retro Synthwave (neon, 80s grid, laser crimson, high voltage contrast)");
  const [ideas, setIdeas] = useState("A cybernetic crescent hawk or speeding vector vehicle badge");

  const [brandBible, setBrandBible] = useState<BrandBible | null>(DEFAULT_BRAND_BIBLE);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyPreset = (preset: typeof STYLE_PRESETS[0]) => {
    setBandName(bandName === "Midnight Tracer" ? "Viper Squad" : bandName);
    setMusicStyle(preset.style);
    setAesthetic(preset.aesthetic);
    setIdeas(preset.ideas);
  };

  const handleGenerateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bandName.trim() || !musicStyle.trim()) {
      setError("Please supply a Band Name and describe your Music Style first.");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bandName,
          musicStyle,
          aesthetic,
          ideas
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate brand identity.");
      }

      setBrandBible(data.brandBible);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during Brand Bible synthesis.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div id="brand-app-root" className="min-h-screen bg-[#050505] text-[#E5E5E5] font-sans selection:bg-[#00F5D4]/20 selection:text-[#00F5D4]">
      
      {/* Upper Navigation/Header */}
      <header className="border-b border-[#262626] bg-[#0F0F0F]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00F5D4] flex items-center justify-center text-black shadow-lg font-bold font-mono tracking-tighter text-xl">
            P
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-2 font-sans uppercase">
              POMPOUS
              <span className="text-[9px] font-mono font-bold text-[#00F5D4] bg-[#00F5D4]/10 px-2 py-0.5 rounded-lg border border-[#00F5D4]/20 tracking-widest">
                IDENTITY STUDIO & CONTENT FORGE
              </span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Sleek Bento Identity Grid for Musician Branding</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-pulse"></span>
            Gemini 3.5 Core Active
          </span>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input Form & Consultant Chat (4 Grid spaces) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Form Section */}
            <div className="bento-card">
              <h2 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-4 pb-3 border-b border-[#262626]">
                <Sparkles className="w-4 h-4 text-[#00F5D4]" />
                Artist DNA Profile
              </h2>

              <form onSubmit={handleGenerateBrand} className="flex flex-col gap-4">
                {/* Band Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="band-name-input" className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                    Band / Musician Name
                  </label>
                  <input
                    type="text"
                    id="band-name-input"
                    value={bandName}
                    onChange={(e) => setBandName(e.target.value)}
                    placeholder="e.g. Neon Horizon, Sleep Token"
                    className="bg-[#050505] text-white border border-[#262626] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#00F5D4] placeholder-zinc-700 font-sans font-medium"
                    required
                  />
                </div>

                {/* Music Genre & Style */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="music-style-input" className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                    Musical Style / Core Sound
                  </label>
                  <textarea
                    id="music-style-input"
                    value={musicStyle}
                    onChange={(e) => setMusicStyle(e.target.value)}
                    placeholder="e.g., Heavy arpeggiated bass synths, dreamy slide guitars, warm organic snare..."
                    rows={2}
                    className="bg-[#050505] text-white border border-[#262626] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#00F5D4] placeholder-zinc-700 leading-relaxed resize-none font-sans"
                    required
                  />
                </div>

                {/* Desired Visual Aesthetic */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="aesthetic-input" className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                    Desired Visual Theme
                  </label>
                  <input
                    type="text"
                    id="aesthetic-input"
                    value={aesthetic}
                    onChange={(e) => setAesthetic(e.target.value)}
                    placeholder="e.g., Retro Outrun, High Contrast Gothic, Nostalgic Warm Wood"
                    className="bg-[#050505] text-white border border-[#262626] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#00F5D4] placeholder-zinc-700 font-sans"
                  />
                </div>

                {/* Directives */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="directives-input" className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                    Specific Logo Ideas or Symbols (Optional)
                  </label>
                  <textarea
                    id="directives-input"
                    value={ideas}
                    onChange={(e) => setIdeas(e.target.value)}
                    placeholder="e.g., Circular maze symbol, distorted speed lines, clean letter monogram..."
                    rows={2}
                    className="bg-[#050505] text-white border border-[#262626] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#00F5D4] placeholder-zinc-700 leading-relaxed resize-none font-sans"
                  />
                </div>

                {/* Presets Slider */}
                <div className="mt-2">
                  <span className="text-[8px] font-mono font-bold text-zinc-650 uppercase tracking-widest block mb-2">
                    Quick Sound Templates
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto">
                    {STYLE_PRESETS.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        id={`style-preset-btn-${i}`}
                        onClick={() => handleApplyPreset(preset)}
                        className="text-[10px] bg-[#050505] border border-[#262626] hover:border-zinc-500 text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg transition-all font-mono"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl p-3 text-xs flex items-start gap-2 mt-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-normal">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  id="generate-brand-btn"
                  disabled={generating}
                  className="w-full bg-white hover:bg-[#00F5D4] disabled:bg-zinc-800 hover:text-black text-black font-bold py-3 px-4 rounded-xl shadow mt-3 flex items-center justify-center gap-2.5 transition-all text-xs uppercase tracking-widest"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-zinc-800" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#00F5D4]" />
                      Synthesize Identity
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* AI Assistant Chat Panel */}
            <ConsultantChat
              bandName={bandName}
              musicStyle={musicStyle}
              aesthetic={aesthetic}
              ideas={ideas}
            />

          </div>

          {/* Right Column: Dashboard Bible Container (8 Grid spaces) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {generating ? (
              <div className="bento-card p-12 text-center min-h-[500px] flex flex-col items-center justify-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full border-4 border-zinc-800 border-t-[#00F5D4] animate-spin"></div>
                  <Sparkles className="w-8 h-8 text-[#00F5D4] absolute inset-0 m-auto animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-white font-mono uppercase tracking-widest animate-pulse">Compiling Brand Identity Bible</h3>
                <p className="text-zinc-400 text-xs max-w-[380px] mt-2 leading-relaxed">
                  Tuning harmonic 5-color matrices, matching Google Display pairing indices, and coding visual prompt vectors with Gemini 3.5...
                </p>
                <div className="mt-8 flex flex-col gap-1 items-center bg-[#050505] p-3.5 px-6 rounded-2xl border border-[#262626]">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active Phase</span>
                  <span className="text-xs font-mono text-[#00F5D4] font-bold">Generative Schema Matrix Parsing</span>
                </div>
              </div>
            ) : brandBible ? (
              <motion.div
                key={brandBible.bandName}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-8"
              >
                
                {/* Brand Overview Banner Card */}
                <motion.div variants={itemVariants}>
                  <div id="brand-overview-card" className="bento-card relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F5D4]/5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-[#00F5D4]/10 border border-[#00F5D4]/20 text-[#00F5D4] text-[9px] font-mono px-2 py-0.5 rounded-lg font-semibold uppercase tracking-wider">
                          Active Identity
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-500 text-[10px] font-mono">EST. 2026</span>
                      </div>
                      
                      {/* Render live proposed Google Font for main header as a design detail! */}
                      <h2
                        id="overview-band-title"
                        style={{ fontFamily: `'${brandBible.typography.headerFont}', sans-serif` }}
                        className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none italic"
                      >
                        {brandBible.bandName}
                      </h2>
                      
                      <p
                        id="overview-band-slogan"
                        style={{ fontFamily: `'${brandBible.typography.bodyFont}', sans-serif` }}
                        className="text-sm text-zinc-350 italic font-medium mt-3"
                      >
                        "{brandBible.slogan}"
                      </p>
                      
                      <p className="text-zinc-400 text-xs md:text-sm mt-4 leading-relaxed max-w-[550px]">
                        {brandBible.aestheticSummary}
                      </p>
                    </div>

                    <div className="shrink-0 flex flex-col gap-2 bg-[#050505] border border-[#262626] p-4 rounded-2xl min-w-[180px]">
                      <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Brand Director</div>
                      <div className="text-xs text-white font-bold font-mono">Sven's Synthesis</div>
                      <div className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
                        Calibrated colors, typographic pairings, and vector logo prompts compiled into one dashboard file.
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Primary Logo Generation Canvas (Gemini 3 Pro Image) */}
                <motion.div variants={itemVariants}>
                  <LogoStudio brandBible={brandBible} />
                </motion.div>

                {/* Color Palette Display */}
                <motion.div variants={itemVariants}>
                  <ColorPalette brandBible={brandBible} />
                </motion.div>

                {/* Typography pairing view */}
                <motion.div variants={itemVariants}>
                  <TypographyPreview brandBible={brandBible} />
                </motion.div>

                {/* Merchandise Mockups Rack */}
                <motion.div variants={itemVariants}>
                  <MerchMockups brandBible={brandBible} />
                </motion.div>

                {/* Artist Biography Component */}
                <motion.div variants={itemVariants}>
                  <ArtistBiography brandBible={brandBible} />
                </motion.div>

                {/* Lyric Forge Component */}
                <motion.div variants={itemVariants}>
                  <LyricForge brandBible={brandBible} />
                </motion.div>

                {/* Social Media Content Kit Component */}
                <motion.div variants={itemVariants}>
                  <SocialMediaKit brandBible={brandBible} />
                </motion.div>

              </motion.div>
            ) : (
              // Empty initial prompt layout
              <div className="bento-card p-12 text-center min-h-[500px] flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#050505] border border-[#262626] flex items-center justify-center text-zinc-500 mb-6 shadow-inner">
                  <Compass className="w-6 h-6 text-[#00F5D4]" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono">No Brand Synthesized</h3>
                <p className="text-zinc-500 text-xs max-w-[340px] mt-2 leading-relaxed">
                  Enter your band name and explain your sonic influences in the left panel to synthesize a full aesthetic "Brand Bible".
                </p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[480px]">
                  <button
                    id="load-demo-cyberpunk"
                    onClick={() => {
                      setBandName("Midnight Tracer");
                      setMusicStyle("80s outrun, heavy arpeggios, analog bass, vintage drum machines, retro racing");
                      setAesthetic("Retro Synthwave (neon, 80s grid, laser crimson, high voltage contrast)");
                      setIdeas("A cybernetic crescent hawk or speeding vector vehicle badge");
                      setBrandBible(DEFAULT_BRAND_BIBLE);
                    }}
                    className="flex items-center gap-2.5 bg-[#050505] hover:bg-zinc-900 text-zinc-300 border border-[#262626] hover:border-zinc-500 px-4 py-3 rounded-xl text-xs font-semibold text-left transition-all"
                  >
                    <Play className="w-3.5 h-3.5 text-[#00F5D4] shrink-0" />
                    <div>
                      <div className="text-white">Load Cyberpunk Template</div>
                      <div className="text-[10px] text-zinc-500 font-normal mt-0.5">Synthwave, grids, laser neon</div>
                    </div>
                  </button>

                  <button
                    id="load-demo-folk"
                    onClick={() => {
                      setBandName("Oak & Hearth");
                      setMusicStyle("Acoustic guitars, warm horns, stompbox, rich storytelling vocals");
                      setAesthetic("Indie Folk Cozy (warm clay oranges, forest greens, hand-drawn textures)");
                      setIdeas("A hand-sketched mountain pine tree or sunburst cabin graphic");
                      
                      // Inject a bespoke folk template to let them play instantly
                      const folkBible: BrandBible = {
                        bandName: "Oak & Hearth",
                        slogan: "Gathering warmth under pine-scented sky-dome.",
                        aestheticSummary: "An organic Warm Indie Folk identity. Framed by earth-toned clay oranges, rich forest greens, and rustic paper textures, this theme emphasizes natural community, campfire comfort, and rich hand-sketched acoustics.",
                        colors: [
                          { hex: "#2B4335", name: "Spruce Forest", role: "Primary Background", usage: "Use for main background elements to anchor the design in deep earthy pine tones." },
                          { hex: "#E88D67", name: "Campfire Clay", role: "Primary Accent", usage: "Apply to main icons, display typography, and highlight elements to invoke firelight warmth." },
                          { hex: "#F3EFE0", name: "Birch Parchment", role: "Light Contrast", usage: "Use for body text reading and container backgrounds to guarantee supreme paper-like legibility." },
                          { hex: "#1A2E22", name: "Midnight Pine", role: "Sub-Container Fill", usage: "Use for side rails and sub-boxes to retain layout groups without clashing with the primary spruce background." },
                          { hex: "#ECC158", name: "Amber Sparks", role: "Secondary Highlight", usage: "Use for button badges, active stars, and secondary line art to inject spark highlights." }
                        ],
                        typography: {
                          headerFont: "Cinzel",
                          headerFontWeight: "Bold 700",
                          bodyFont: "Lora",
                          bodyFontWeight: "Regular 400",
                          pairingExplanation: "Cinzel's classic roman serifs carry majestic, timeless storytelling weight, while Lora's elegant, readable literary curves complement lyrics and long prose comfortably."
                        },
                        primaryLogoIdea: {
                          concept: "A hand-sketched rustic pine tree inside an interlocking circular sun rays framework.",
                          detailedPrompt: "A beautiful minimalist hand-drawn vector band logo of a single pine tree with sunburst circles surrounding it, forest green and clay orange accents, isolated on plain black background, 8k",
                          visualElements: ["Hand-sketched Pine Tree", "Circular Sun rays", "Interlocking geometric wood-carved lines"]
                        },
                        secondaryMarks: [
                          {
                            name: "Sub-Mark: Pinecone Badge",
                            description: "A compact badge representing the organic, earthy pine cone.",
                            detailedPrompt: "A minimalist hand-drawn vector illustration of a pinecone badge, warm gold tones, flat black background, isolated, 8k"
                          }
                        ],
                        marketingAssets: [
                          {
                            type: "Campfire Tour Poster",
                            layoutDescription: "A vertical acoustic tour flyer showcasing a cabin in the wood under a warm starry sunset with elegant typography.",
                            prompt: "A beautiful hand-illustrated acoustic folk concert tour poster, cozy cabin in spruce woods under warm starry sunset, hand-drawn vector poster, 8k"
                          }
                        ],
                        artistBio: {
                          biography: "Oak & Hearth is a multi-instrumental folk collective gathering warmth under the majestic pine-scented sky-dome of the Pacific Northwest. Driven by organic acoustic slide guitars, warm brass horn sections, deep stompbox tempos, and lush storytelling vocal harmonies, their music feels like a campfire circle. Drawing rich inspiration from natural wilderness, historical heritage, and cozy community structures, Oak & Hearth captures the raw, elegant, hand-crafted spirit of DIY acoustics.",
                          pressKitBlurb: "Gathering cozy campfire stories into majestic acoustic harmonies, Oak & Hearth is the warm sound of the Pacific pine woods."
                        },
                        lyricConcepts: {
                          lyricIdeas: [
                            "Throw another cedar log onto the crackling flame.",
                            "The mountains know our names by heart.",
                            "A silver moon reflecting on the quiet river bend.",
                            "We carve our secrets into Birch trees and mossy stones.",
                            "Warm dust swirling in the morning cabin light.",
                            "A heavy copper kettle whistling in the cold.",
                            "Carry your burden down to the green forest floor.",
                            "These boots have paced a thousand miles of gold.",
                            "Old pine needles blanket our sleeping shadows.",
                            "Listen to the slide guitar whispering to the wind."
                          ],
                          thematicConcepts: [
                            {
                              title: "The Spruce Cabin Sessions",
                              description: "An intimate record of isolated songs written inside a wood-shingled cabin, exploring loneliness, rustic peace, and wood smoke."
                            },
                            {
                              title: "Roots Deep & River Wide",
                              description: "A series of acoustic ballads highlighting generational roots, heritage trees, and flowing rivers that define small-town histories."
                            },
                            {
                              title: "Campfire Embers",
                              description: "Cozy campfire melodies capturing the transition from sunset to midnight under a dome of bright summer stars."
                            }
                          ]
                        },
                        socialMediaTemplates: [
                          {
                            platform: "Instagram",
                            purpose: "Song Release Announcement",
                            caption: "Grab a cup of warm tea and sit by the fire. ☕️🌲 Our new single 'Spruce Cabin' is now out in the world. Tap the link in our bio to gather with us on Spotify and Bandcamp.\n\n#OakAndHearth #AcousticFolk #CampfireVibes #NewSingle",
                            imageSuggestion: "A cozy rustic parchment background featuring the hand-drawn Pine Tree logo surrounded by detailed botanical pine needles."
                          },
                          {
                            platform: "Twitter",
                            purpose: "Tour Ticket Alert",
                            caption: "Gather round! The Pine & Hearth tour begins this September. Early-bird ticket sales start tomorrow morning. Come share some music and warmth under the stars with us. 🏕️🪵\n\n[Link]\n\n#PineAndHearthTour #LiveFolk",
                            imageSuggestion: "A warm, sepia-toned tour flyer showing a hand-illustrated wood cabin under an amber-sky sunset."
                          },
                          {
                            platform: "Facebook",
                            purpose: "Behind The Craft",
                            caption: "Hand-carving acoustic guitars is just like writing songs—it takes time, grain, and a little fire. Here is a quick look behind our custom parlor guitar building sessions this week. 🪵🎻\n\n#LuthierArt #AcousticGuitar #Craftsmanship",
                            imageSuggestion: "A low-angle close-up of shaved wood curls on a workbench with a soft warm focus on a half-carved wooden guitar body."
                          },
                          {
                            platform: "Instagram",
                            purpose: "Community Spotlight",
                            caption: "A massive thank you to everyone who packed the Seattle woodshed last night. Singing in unison with the rain on the tin roof was magic we won't soon forget. See you in Portland tonight! 🕯️🍂\n\n#LiveFolk #SeattleMusic #OakAndHearth",
                            imageSuggestion: "A warm, high-contrast black-and-white photo of a small acoustic crowd gathered closely in a candle-lit timber warehouse."
                          },
                          {
                            platform: "Twitter",
                            purpose: "Vinyl Pre-Order",
                            caption: "The Birch Parchment Edition is real. 12 tracks pressed onto gorgeous 180g forest-green vinyl. Packed in a recycled tactile sleeve with hand-drawn lyric prints. 🏔️💿\n\nReserve your copy:\n[Store Link]\n\n#VinylRecord #CollectorEdition #FolkCommunity",
                            imageSuggestion: "A high-end product layout mockup displaying a forest-green vinyl spinning next to a raw wood-shingled sleeve jacket."
                          }
                        ]
                      };
                      setBrandBible(folkBible);
                    }}
                    className="flex items-center gap-2.5 bg-[#050505] hover:bg-zinc-900 text-zinc-300 border border-[#262626] hover:border-zinc-500 px-4 py-3 rounded-xl text-xs font-semibold text-left transition-all"
                  >
                    <Play className="w-3.5 h-3.5 text-[#00F5D4] shrink-0" />
                    <div>
                      <div className="text-white">Load Cozy Folk Template</div>
                      <div className="text-[10px] text-zinc-500 font-normal mt-0.5">Acoustic, mountains, warm clay</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      <footer className="border-t border-[#262626] bg-[#0F0F0F] py-8 px-6 mt-16 text-center text-[10px] font-mono text-zinc-500 tracking-wider">
        <div>© 2026 POMPOUS BRAND SYSTEM. ALL RIGHTS SECURED. DESIGNED WITH BENTO IDENTITIES.</div>
        <div className="mt-2 text-[9px] text-zinc-650 opacity-60">FULL-STACK MATRIX • REFERRER-SAFE CANVAS • PERSISTENT CONTEXTS</div>
      </footer>

    </div>
  );
}

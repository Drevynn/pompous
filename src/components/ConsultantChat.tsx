import { useState, useRef, useEffect } from "react";
import { ChatMessage, ConsultantProfile, ConsultantRole } from "../types";
import { MessageSquare, Send, User, Bot, HelpCircle, Loader, RefreshCw, Sparkles, LogOut } from "lucide-react";

interface ConsultantChatProps {
  bandName?: string;
  musicStyle?: string;
  aesthetic?: string;
  ideas?: string;
}

const CONSULTANT_PROFILES: ConsultantProfile[] = [
  {
    id: "visual_designer",
    name: "Sven",
    title: "Visual Brand Director",
    description: "Swedish design minimalist. Translates your sonic energy into custom t-shirt graphics, album covers, and poster layouts.",
    avatar: "🇸🇪 🎨",
    suggestedPrompts: [
      "Critique my current band aesthetic",
      "Brainstorm some creative t-shirt designs",
      "What are some unique symbols or icons for our style?",
      "Suggest a custom visual prompt for a logo generator"
    ]
  },
  {
    id: "music_coach",
    name: "Coach Roxy",
    title: "DIY Release Strategist",
    description: "Indie release expert. Specializes in building Spotify streams, writing engaging artist bios, and planning rollout timelines.",
    avatar: "🎸 🚀",
    suggestedPrompts: [
      "Write a compelling 100-word artist bio",
      "Outline a 6-week release timeline for an EP",
      "Suggest 3 catchy social media teaser video concepts",
      "How do I submit my music to Spotify editorial playlists?"
    ]
  },
  {
    id: "industry_strategist",
    name: "Vince",
    title: "Veteran Booking Agent",
    description: "Grit and gig manager. Focuses on booking local club shows, pricing tour merch, split guarantees, and crowdfunding budgets.",
    avatar: "😎 💼",
    suggestedPrompts: [
      "How do I pitch my band to local club bookers?",
      "What retail price and profit margins should I set for t-shirts?",
      "Explain the deal structure for a local band split cover show",
      "How many songs should we include in our local headliner set?"
    ]
  }
];

export default function ConsultantChat({ bandName, musicStyle, aesthetic, ideas }: ConsultantChatProps) {
  const [activeRoleId, setActiveRoleId] = useState<ConsultantRole>("visual_designer");
  // Maintain independent chats for each consultant
  const [chats, setChats] = useState<Record<ConsultantRole, ChatMessage[]>>({
    visual_designer: [],
    music_coach: [],
    industry_strategist: []
  });

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeProfile = CONSULTANT_PROFILES.find(p => p.id === activeRoleId)!;
  const currentMessages = chats[activeRoleId];

  // Auto-scroll to bottom of thread when message array changes or loading toggles
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, loading]);

  // Initial greeting if chat is empty
  useEffect(() => {
    if (chats[activeRoleId].length === 0) {
      const greetings: Record<ConsultantRole, string> = {
        visual_designer: `Hej! I am Sven, your virtual Brand Director. I've been reviewing your artist DNA. Whether you are looking to tweak your color palette, construct high-impact t-shirt guidelines, or write surgical prompts for our logo generator, I am ready. What visual puzzle are we solving today?`,
        music_coach: `Hey there, I'm Coach Roxy! I specialize in DIY releases. You've got the music, now let's get people to hear it. Ask me to structure your upcoming single release campaign, draft an engaging bio, or brainstorm social teasers. Let's make some noise!`,
        industry_strategist: `Hey, Vince here. Let's get straight to business. Gigs, touring, booking, merch margins, crowdfunding. Let me know what you need help negotiating or organizing. I keep it real so you can make rent.`
      };

      setChats(prev => ({
        ...prev,
        [activeRoleId]: [
          {
            id: "greeting",
            role: "model",
            content: greetings[activeRoleId],
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]
      }));
    }
  }, [activeRoleId]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    // Optimistically update chat
    const updatedMessages = [...currentMessages, userMsg];
    setChats(prev => ({
      ...prev,
      [activeRoleId]: updatedMessages
    }));
    setInputValue("");
    setLoading(true);

    try {
      // Package messages for server, strip IDs and timestamps
      const payloadMessages = updatedMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/consultant-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payloadMessages,
          roleType: activeRoleId,
          bandProfile: { bandName, musicStyle, aesthetic, ideas }
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate AI consultant response.");
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "model",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setChats(prev => ({
        ...prev,
        [activeRoleId]: [...prev[activeRoleId], aiMsg]
      }));
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-err`,
        role: "model",
        content: `Sorry, I've run into a slight technical snag connecting to the booking agency. Error: ${err.message || "Failed request"}. Please verify your API keys and try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChats(prev => ({
        ...prev,
        [activeRoleId]: [...prev[activeRoleId], errorMsg]
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setChats(prev => ({
      ...prev,
      [activeRoleId]: []
    }));
  };

  return (
    <div id="consultant-chat-card" className="flex flex-col h-[550px] bg-[#0F0F0F] border border-[#262626] rounded-3xl shadow-xl overflow-hidden">
      {/* Tab Selectors for Consultants */}
      <div className="grid grid-cols-3 bg-[#050505] p-2 gap-1 border-b border-[#262626] shrink-0">
        {CONSULTANT_PROFILES.map(p => {
          const isSelected = activeRoleId === p.id;
          return (
            <button
              key={p.id}
              id={`chat-tab-${p.id}`}
              onClick={() => setActiveRoleId(p.id)}
              className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? "bg-[#0F0F0F] border border-[#262626] text-white"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-[#0F0F0F]/40"
              }`}
            >
              <span className="text-lg">{p.avatar}</span>
              <span className="text-[10px] font-bold mt-1 font-mono uppercase tracking-wider">{p.name}</span>
              <span className="text-[8px] opacity-70 truncate max-w-full font-sans">{p.title}</span>
            </button>
          );
        })}
      </div>

      {/* Consultant Descriptor Banner */}
      <div className="bg-[#050505]/40 p-3 px-4 border-b border-[#262626] flex items-center justify-between gap-4 shrink-0">
        <div className="min-w-0">
          <h3 className="text-xs font-bold text-[#00F5D4] font-mono tracking-wider">
            {activeProfile.name} • <span className="text-zinc-400 font-normal">{activeProfile.title}</span>
          </h3>
          <p className="text-[10px] text-zinc-500 truncate mt-0.5">{activeProfile.description}</p>
        </div>
        <button
          id="clear-chat-btn"
          onClick={handleClearChat}
          className="text-[9px] font-mono text-zinc-500 hover:text-[#00F5D4] flex items-center gap-1 shrink-0 p-1 rounded-lg hover:bg-[#050505]/50 transition-all uppercase tracking-widest"
          title="Reset conversation"
        >
          <RefreshCw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Scrollable chat body */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-[#050505]/20">
        {currentMessages.map(msg => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 border ${
                  isUser
                    ? "bg-[#00F5D4]/10 border-[#00F5D4]/30 text-[#00F5D4]"
                    : "bg-[#050505] border-[#262626] text-zinc-400"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap shadow-inner ${
                  isUser
                    ? "bg-white text-black font-bold rounded-tr-none"
                    : "bg-[#050505] text-zinc-300 border border-[#262626] rounded-tl-none"
                }`}
              >
                {msg.content}
                <div
                  className={`text-[8px] mt-1.5 font-mono text-right opacity-50 ${
                    isUser ? "text-zinc-500" : "text-zinc-500"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-2.5 max-w-[85%] mr-auto items-center">
            <div className="w-7 h-7 rounded-full bg-[#050505] border border-[#262626] flex items-center justify-center text-xs shrink-0 text-zinc-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#050505] text-zinc-500 border border-[#262626] rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-2">
              <Loader className="w-3.5 h-3.5 animate-spin text-[#00F5D4]" />
              <span>{activeProfile.name} is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Grid */}
      {currentMessages.length <= 1 && (
        <div className="px-4 py-2 border-t border-[#262626] bg-[#050505]/60 shrink-0">
          <label className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest block mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-[#00F5D4]" />
            Consultant Suggestions
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {activeProfile.suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                id={`suggested-prompt-${activeRoleId}-${i}`}
                onClick={() => handleSendMessage(prompt)}
                className="text-left text-[10px] text-zinc-400 hover:text-white bg-[#050505] hover:bg-zinc-900 p-2 rounded-xl border border-[#262626] hover:border-zinc-500 transition-all truncate"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message input tray */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="p-3 bg-[#050505] border-t border-[#262626] flex gap-2 shrink-0"
      >
        <input
          type="text"
          id="chat-input-field"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Chat with ${activeProfile.name}...`}
          className="flex-grow bg-[#0F0F0F] text-zinc-200 text-xs rounded-xl border border-[#262626] px-4 focus:outline-none focus:border-[#00F5D4] placeholder-zinc-750"
          disabled={loading}
        />
        <button
          type="submit"
          id="send-chat-btn"
          disabled={!inputValue.trim() || loading}
          className="bg-white hover:bg-zinc-200 text-black rounded-xl p-2.5 transition-all disabled:opacity-45 disabled:cursor-not-allowed shrink-0"
        >
          <Send className="w-4 h-4 text-black font-bold" />
        </button>
      </form>
    </div>
  );
}

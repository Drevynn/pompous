import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));

const PORT = 3000;

// Lazy initialization of Gemini client to prevent startup crash if API key is missing
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    throw new Error("GEMINI_API_KEY is not configured in the environment variables. Please add it via Settings > Secrets.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// 1. Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. Generate Brand Bible structured text endpoint
app.post("/api/generate-brand", async (req, res) => {
  try {
    const { bandName, musicStyle, aesthetic, ideas } = req.body;
    
    if (!bandName || !musicStyle) {
      return res.status(400).json({ error: "Band Name and Music Style are required." });
    }

    const ai = getGeminiClient();

    const prompt = `You are an elite, award-winning music industry brand strategist, creative director, and visual designer. 
Analyze the following band/musician attributes and generate a comprehensive "Brand Bible" in structured JSON format.

Band Profile:
- Name: "${bandName}"
- Music Style / Key Influences: "${musicStyle}"
- Desired Visual Aesthetic: "${aesthetic || "Modern Indie Slate"}"
- Brand Ideas / Directives: "${ideas || "None"}"

Produce a brilliant visual and conceptual identity:
1. Ensure the 5 color palette is absolutely stunning and cohesive (e.g. including dark theme background colors, vivid accent colors, readable high-contrast text color). 
2. Ensure the primary and secondary logo ideas have clear, extremely descriptive text-to-image prompts optimized to produce beautiful isolated marks. 
3. Provide Google Fonts suggestions that are universally available and match the band's spirit.
4. Generate a highly professional, captivating artist biography (approx. 200 words) suitable for press kits and online profiles, plus a concise 1-sentence press kit blurb.
5. Create exactly 10 highly creative, vibe-fitting lyric lines/ideas, and 3 overarching thematic concepts (with descriptive titles) suitable for albums or single narratives.
6. Design exactly 5 versatile social media post templates (e.g., across Instagram, Facebook, and Twitter) featuring custom captions aligned with the brand and specific visual suggestions that would match the logo/palette.`;

    const brandSchema = {
      type: Type.OBJECT,
      properties: {
        bandName: { type: Type.STRING },
        slogan: { type: Type.STRING, description: "A creative, memorable visual tagline or campaign motto." },
        aestheticSummary: { type: Type.STRING, description: "A 2-3 sentence evocative description of the brand design theme." },
        colors: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              hex: { type: Type.STRING, description: "Hex code starting with #, e.g. #0E1118 or #FF3366" },
              name: { type: Type.STRING, description: "Poetic, customized color name, e.g. Retro Neon Crimson, Stage Void" },
              role: { type: Type.STRING, description: "Role, e.g. Primary Background, Text, Accent, Midtone" },
              usage: { type: Type.STRING, description: "Specific instruction of where to apply this color (e.g., 'Use for body text to ensure 4.5:1 contrast ratio')." }
            },
            required: ["hex", "name", "role", "usage"]
          },
          description: "A gorgeous 5-color hex palette curated for this genre."
        },
        typography: {
          type: Type.OBJECT,
          properties: {
            headerFont: { type: Type.STRING, description: "Google Font name for display headings (e.g., Space Grotesk, Syne, Montserrat, Cinzel, Uncial Antiqua, Metal Mania)" },
            headerFontWeight: { type: Type.STRING, description: "e.g. Bold 700 or Black 900" },
            bodyFont: { type: Type.STRING, description: "Google Font name for readable body text (e.g., Inter, Lora, JetBrains Mono, Roboto, DM Sans)" },
            bodyFontWeight: { type: Type.STRING, description: "e.g. Regular 400" },
            pairingExplanation: { type: Type.STRING, description: "Why this display and body pairing perfectly represents their music style." }
          },
          required: ["headerFont", "headerFontWeight", "bodyFont", "bodyFontWeight", "pairingExplanation"]
        },
        primaryLogoIdea: {
          type: Type.OBJECT,
          properties: {
            concept: { type: Type.STRING, description: "Concept summary of the primary visual symbol." },
            detailedPrompt: { type: Type.STRING, description: "A highly-detailed, expert prompt for generating this logo with gemini-3-pro-image-preview. It must specify a plain flat dark/black background, centering an isolated high-contrast symbol, vector, ultra clean graphic design, 8k." },
            visualElements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific shapes, lines, glyphs, or textures included." }
          },
          required: ["concept", "detailedPrompt", "visualElements"]
        },
        secondaryMarks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "e.g. Minimalist Icon, Typography Monogram, Album Spines Glyph" },
              description: { type: Type.STRING, description: "Description of where and when to use this mark." },
              detailedPrompt: { type: Type.STRING, description: "Text prompt to generate this secondary mark." }
            },
            required: ["name", "description", "detailedPrompt"]
          },
          description: "2 or 3 alternative layouts or sub-marks."
        },
        marketingAssets: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, description: "e.g. Vinyl/CD Album Cover, Tour Poster, Merch T-Shirt" },
              layoutDescription: { type: Type.STRING, description: "Detailed description of the final mock design combining colors and logo symbol." },
              prompt: { type: Type.STRING, description: "Prompt for generating a beautiful concept visual representation of this marketing asset." }
            },
            required: ["type", "layoutDescription", "prompt"]
          },
          description: "3 creative visual asset ideas (such as Album Cover, Tour Poster, Merch Shirt)."
        },
        artistBio: {
          type: Type.OBJECT,
          properties: {
            biography: { type: Type.STRING, description: "Engaging and professional 150-250 word biography for press kits and streaming bios, reflecting genre and influences." },
            pressKitBlurb: { type: Type.STRING, description: "A high-impact, single-sentence hook summarizing who the band is for festival bookings and press headers." }
          },
          required: ["biography", "pressKitBlurb"]
        },
        lyricConcepts: {
          type: Type.OBJECT,
          properties: {
            lyricIdeas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Exactly 10 poetic and distinctive lines or lyrics inspired by their genre." },
            thematicConcepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "The overarching album or narrative theme title." },
                  description: { type: Type.STRING, description: "Description of the theme narrative and emotional tone." }
                },
                required: ["title", "description"]
              },
              description: "Exactly 3 overarching thematic narratives."
            }
          },
          required: ["lyricIdeas", "thematicConcepts"]
        },
        socialMediaTemplates: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              platform: { type: Type.STRING, description: "e.g. Instagram, Twitter, Facebook" },
              purpose: { type: Type.STRING, description: "e.g. Single Release, Tour Announcement, Behind The Scenes" },
              caption: { type: Type.STRING, description: "Full engaging post caption with hashtags and placeholders." },
              imageSuggestion: { type: Type.STRING, description: "Visual and structural advice on what photo, graphic or video to pair with this post, utilizing their colors/logos." }
            },
            required: ["platform", "purpose", "caption", "imageSuggestion"]
          },
          description: "Exactly 5 ready-to-use social media templates."
        }
      },
      required: [
        "bandName", "slogan", "aestheticSummary", "colors", "typography", 
        "primaryLogoIdea", "secondaryMarks", "marketingAssets",
        "artistBio", "lyricConcepts", "socialMediaTemplates"
      ]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: brandSchema,
        temperature: 1.0,
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response received from Gemini.");
    }

    const parsedData = JSON.parse(resultText);
    res.json({ success: true, brandBible: parsedData });
  } catch (error: any) {
    console.error("Error generating brand bible:", error);
    res.status(500).json({ error: error.message || "An error occurred during brand generation." });
  }
});

// 3. Generate Logo endpoint using gemini-3-pro-image-preview
app.post("/api/generate-logo", async (req, res) => {
  try {
    const { prompt, size } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required for generating assets." });
    }

    const ai = getGeminiClient();

    // Map user selected size to acceptable imageSize values
    // available values: "1K", "2K", "4K"; default is "1K"
    const validSizes = ["1K", "2K", "4K"];
    const imageSize = validSizes.includes(size) ? size : "1K";

    console.log(`Generating logo using model gemini-3-pro-image-preview with size: ${imageSize}...`);

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [
        {
          text: prompt
        }
      ],
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: imageSize
        }
      }
    });

    let base64Image = null;
    let fallbackText = "";

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
        } else if (part.text) {
          fallbackText += part.text;
        }
      }
    }

    if (base64Image) {
      res.json({
        success: true,
        imageUrl: `data:image/png;base64,${base64Image}`,
        size: imageSize
      });
    } else {
      res.status(500).json({ 
        error: "Failed to generate image data. The model might have returned text instead.", 
        details: fallbackText 
      });
    }
  } catch (error: any) {
    console.error("Error generating logo:", error);
    res.status(500).json({ error: error.message || "An error occurred during image generation." });
  }
});

// 4. Consultant Chat endpoint with specific system instructions
app.post("/api/consultant-chat", async (req, res) => {
  try {
    const { messages, roleType, bandProfile } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGeminiClient();

    // Define role specific system instruction
    let systemInstruction = "";
    if (roleType === "visual_designer") {
      systemInstruction = `You are "Sven", a world-class visual brand director and band merchandise designer. 
You specialize in translates bands' feelings, styles, and energy into custom typography, merch mockups, color palettes, and logo symbology.
You help them brainstorm awesome logo adjustments, album art layouts, t-shirt ideas, and write incredible prompts for logo generators.
Adopt Swedish visual designer persona: modern, highly refined, minimal, supportive, yet bold. Use concise, structured layout formatting.`;
    } else if (roleType === "music_coach") {
      systemInstruction = `You are "Coach Roxy", an experienced independent music marketing strategist and career coach.
You help bands write catchy bios, plan Spotify/Bandcamp release campaigns, schedule social media rollouts, structure music videos, and tell their band story.
You are encouraging, high-energy, full of real-world tips, and emphasize DIY hustle. Give concise bullet points, direct actions, and real examples.`;
    } else { // industry_strategist
      systemInstruction = `You are "Vince", a sharp, veteran booking agent and music manager who has booked gigs at Glastonbury, SXSW, and local basement clubs.
You keep it extremely real about the business side: tour routing, booking local venues, setlist pacing, merchandising profit margins, and crowdfunding.
You are direct, pragmatic, a bit cynical but ultimately wanting them to succeed and make money from their art. Highlight pricing tables, deal points, and concrete contracts advice.`;
    }

    if (bandProfile && bandProfile.bandName) {
      systemInstruction += `\n\nContext on current artist/band:
- Name: "${bandProfile.bandName}"
- Music Style / Key Influences: "${bandProfile.musicStyle}"
- Desired Aesthetic: "${bandProfile.aesthetic || "Modern"}"
- Additional context: "${bandProfile.ideas || "None"}"`;
    }

    // Format previous messages for the Gemini API chat API
    // Gemini chat API expects history format: list of messages with role 'user' or 'model'
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    // Generate response using gemini-3.5-flash for chat interactions
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
      }
    });

    const reply = response.text || "I apologize, but I couldn't formulate a response right now. Let me know if we can try another direction!";
    res.json({ success: true, reply });
  } catch (error: any) {
    console.error("Error in consultant chat:", error);
    res.status(500).json({ error: error.message || "An error occurred in the consultant chat." });
  }
});

// Serve Vite dev server or static build assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production build from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();

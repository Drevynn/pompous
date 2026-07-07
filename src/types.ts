export interface ColorInfo {
  hex: string;
  name: string;
  role: string;
  usage: string;
}

export interface TypographyInfo {
  headerFont: string;
  headerFontWeight: string;
  bodyFont: string;
  bodyFontWeight: string;
  pairingExplanation: string;
}

export interface LogoIdea {
  concept: string;
  detailedPrompt: string;
  visualElements: string[];
}

export interface SecondaryMark {
  name: string;
  description: string;
  detailedPrompt: string;
}

export interface MarketingAsset {
  type: string;
  layoutDescription: string;
  prompt: string;
}

export interface ArtistBio {
  biography: string;
  pressKitBlurb: string;
}

export interface LyricThematicInfo {
  lyricIdeas: string[];
  thematicConcepts: { title: string; description: string }[];
}

export interface SocialMediaPost {
  platform: string;
  purpose: string;
  caption: string;
  imageSuggestion: string;
}

export interface BrandBible {
  bandName: string;
  slogan: string;
  aestheticSummary: string;
  colors: ColorInfo[];
  typography: TypographyInfo;
  primaryLogoIdea: LogoIdea;
  secondaryMarks: SecondaryMark[];
  marketingAssets: MarketingAsset[];
  artistBio?: ArtistBio;
  lyricConcepts?: LyricThematicInfo;
  socialMediaTemplates?: SocialMediaPost[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export type ConsultantRole = 'visual_designer' | 'music_coach' | 'industry_strategist';

export interface ConsultantProfile {
  id: ConsultantRole;
  name: string;
  title: string;
  description: string;
  avatar: string;
  suggestedPrompts: string[];
}

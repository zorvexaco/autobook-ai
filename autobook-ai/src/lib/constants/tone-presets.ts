export type ToneKey = "friendly" | "luxury" | "professional" | "concise" | "casual";

export interface TonePreset {
  greeting_style: string;
  formality: string;
  opener: string;
}

export const TONE_PRESETS: Record<ToneKey, TonePreset> = {
  friendly: {
    greeting_style: "warm",
    formality: "informal",
    opener: "Hey there! Thanks for reaching out.",
  },
  luxury: {
    greeting_style: "elegant",
    formality: "formal",
    opener: "Thank you for contacting us. We look forward to serving you.",
  },
  professional: {
    greeting_style: "courteous",
    formality: "semi-formal",
    opener: "Hello, thank you for getting in touch with us.",
  },
  concise: {
    greeting_style: "direct",
    formality: "neutral",
    opener: "Hi. Thanks for your message.",
  },
  casual: {
    greeting_style: "relaxed",
    formality: "very-informal",
    opener: "Hey! What can we do for you?",
  },
};

export const TONES: { value: ToneKey; label: string; description: string }[] = [
  {
    value: "friendly",
    label: "Friendly",
    description: "Warm and approachable, great for salons and local businesses",
  },
  {
    value: "luxury",
    label: "Luxury",
    description: "Elegant and refined, ideal for med spas and high-end services",
  },
  {
    value: "professional",
    label: "Professional",
    description: "Courteous and polished, suitable for consultants and agencies",
  },
  {
    value: "concise",
    label: "Concise",
    description: "Brief and to the point, perfect for high-volume businesses",
  },
  {
    value: "casual",
    label: "Casual",
    description: "Relaxed and conversational, fits gyms and creative studios",
  },
];

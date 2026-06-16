export interface Mood {
  id: string;
  name: string;        // e.g., "Serein", "Joyeux", "Focalisé"
  iconName: string;    // Name of Lucide icon to load dynamically
  colorClass: string;  // Color class for general styling (e.g. "amber-400")
  hexColor: string;    // HEX string for glow/canvas inline styles (e.g. "#fbbf24")
  phrase: string;      // Creative summary (e.g. "Dans ma bulle, ne pas déranger")
  emoji: string;       // Accent emoji (e.g. "🧘")
  description: string; // Long visual prompt describing the mood
  suggestedBrightness: number; // standard brightness scaling
  gradient?: string;   // Optional glowing CSS gradient (e.g., "linear-gradient(135deg, #38bdf8 0%, #f472b6 100%)")
}

export interface AodSettings {
  showClock: boolean;
  showSeconds: boolean;
  showDate: boolean;
  showStatusText: boolean;
  customStatusText: string;
  brightness: number;          // 0.1 to 1.0 for OLED screen simulation overlay
  burnInProtection: boolean;   // Enables active pixel shifting
  burnInOffsetFreq: number;    // seconds between shifts (so users can visualize it in real-time)
  glowIntensity: 'none' | 'slow' | 'pulsing';
  clockLayout: 'centered' | 'top' | 'minimalist';
  ambientParticles: boolean;   // particle-shifting effect that floats under the icon
  showIcons: boolean;          // toggles display of icons and emojis
  customEmojiTop?: string;     // custom emoji at the top
  customEmojiBottomLeft?: string; // custom emoji at the bottom left
  customEmojiBottomRight?: string; // custom emoji at the bottom right
  showCustomTriangleEmojis?: boolean; // toggles displaying the 3 custom emojis
}

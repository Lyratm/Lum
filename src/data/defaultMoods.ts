import { Mood } from '../types';

export const defaultMoods: Mood[] = [
  {
    id: 'masculin',
    name: 'Hétéro',
    iconName: 'User',
    colorClass: 'text-sky-400 border-sky-400/20 bg-sky-950/10',
    hexColor: '#38bdf8',
    phrase: 'Hétéro',
    emoji: '♂️',
    description: 'Couleur : Bleu',
    suggestedBrightness: 0.7
  },
  {
    id: 'feminin',
    name: 'Hétéro',
    iconName: 'User',
    colorClass: 'text-pink-400 border-pink-400/20 bg-pink-950/10',
    hexColor: '#f472b6',
    phrase: 'Rose',
    emoji: '♀️',
    description: 'Couleur : Rose',
    suggestedBrightness: 0.7
  },
  {
    id: 'non-binaire',
    name: 'Non-binaire',
    iconName: 'Sparkles',
    colorClass: 'text-purple-400 border-purple-400/20 bg-purple-950/10',
    hexColor: '#c084fc',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #f472b6 100%)',
    phrase: 'Dégradé bleu clair au rose clair',
    emoji: '💛',
    description: 'Couleur : Dégradé bleu clair au rose clair',
    suggestedBrightness: 0.75
  },
  {
    id: 'agenre',
    name: 'Agenre',
    iconName: 'Circle',
    colorClass: 'text-white border-white/20 bg-white/10',
    hexColor: '#ffffff',
    phrase: 'Blanc',
    emoji: '🤍',
    description: 'Couleur : Blanc',
    suggestedBrightness: 0.90
  },
  {
    id: 'genderfluid',
    name: 'Genderfluid',
    iconName: 'Waves',
    colorClass: 'text-green-400 border-green-400/20 bg-green-950/10',
    hexColor: '#4ade80',
    phrase: 'Vert',
    emoji: '💧',
    description: 'Couleur : Vert',
    suggestedBrightness: 0.75
  },
  {
    id: 'genderqueer',
    name: 'Genderqueer',
    iconName: 'Infinity',
    colorClass: 'text-orange-400 border-orange-400/20 bg-orange-950/10',
    hexColor: '#f97316',
    phrase: 'Orange',
    emoji: '🟣',
    description: 'Couleur : Orange',
    suggestedBrightness: 0.8
  },
  {
    id: 'transgenre',
    name: 'Transgenre',
    iconName: 'Flame',
    colorClass: 'text-rose-400 border-rose-400/20 bg-rose-950/10',
    hexColor: '#f43f5e',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #ffffff 50%, #f43f5e 100%)',
    phrase: 'Dégradé bleu au rose foncé',
    emoji: '⚧️',
    description: 'Couleur : Dégradé bleu au rose foncé',
    suggestedBrightness: 0.8
  },
  {
    id: 'bisexuel-le',
    name: 'Bisexuel·le',
    iconName: 'Heart',
    colorClass: 'text-purple-400 border-purple-400/20 bg-purple-950/10',
    hexColor: '#c084fc',
    phrase: 'Violet clair',
    emoji: '💖',
    description: 'Couleur : Violet clair',
    suggestedBrightness: 0.7
  },
  {
    id: 'pansexuel-le',
    name: 'Pansexuel·le',
    iconName: 'Smile',
    colorClass: 'text-yellow-400 border-yellow-400/20 bg-yellow-950/10',
    hexColor: '#fef08a',
    phrase: 'Jaune claire',
    emoji: '💛',
    description: 'Couleur : Jaune claire',
    suggestedBrightness: 0.85
  },
  {
    id: 'lesbienne',
    name: 'Lesbienne',
    iconName: 'Compass',
    colorClass: 'text-orange-500 border-orange-500/20 bg-orange-950/10',
    hexColor: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316 0%, #fdba74 50%, #f43f5e 100%)',
    phrase: 'Orange',
    emoji: '🧡',
    description: 'Couleur : Orange',
    suggestedBrightness: 0.75
  },
  {
    id: 'gay-homme',
    name: 'Gay',
    iconName: 'HeartHandshake',
    colorClass: 'text-blue-500 border-blue-500/20 bg-blue-950/10',
    hexColor: '#1d4ed8',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)',
    phrase: 'Bleu foncé',
    emoji: '💙',
    description: 'Couleur : Bleu foncé',
    suggestedBrightness: 0.65
  },
  {
    id: 'asexuel-le',
    name: 'Asexuel·le',
    iconName: 'Moon',
    colorClass: 'text-zinc-400 border-zinc-400/20 bg-zinc-950/10',
    hexColor: '#52525b',
    gradient: 'linear-gradient(135deg, #09090b 0%, #a1a1aa 50%, #a855f7 100%)',
    phrase: 'Noir',
    emoji: '🖤',
    description: 'Couleur : Noir',
    suggestedBrightness: 0.45
  },
  {
    id: 'demisexuel-le',
    name: 'Demisexuel·le',
    iconName: 'Zap',
    colorClass: 'text-slate-400 border-slate-400/20 bg-slate-950/10',
    hexColor: '#94a3b8',
    phrase: 'Gris',
    emoji: '🛡️',
    description: 'Couleur : Gris',
    suggestedBrightness: 0.55
  },
  {
    id: 'intersexe',
    name: 'Intersexe',
    iconName: 'Award',
    colorClass: 'text-amber-600 border-amber-600/20 bg-amber-950/10',
    hexColor: '#ca8a04',
    phrase: 'Jaune foncé',
    emoji: '🟣',
    description: 'Couleur : Jaune foncé',
    suggestedBrightness: 0.8
  },
  {
    id: 'queer-general',
    name: 'Queer',
    iconName: 'Rainbow',
    colorClass: 'text-fuchsia-400 border-fuchsia-400/20 bg-fuchsia-950/10',
    hexColor: '#ec4899',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 20%, #eab308 40%, #22c55e 60%, #3b82f6 80%, #a855f7 100%)',
    phrase: 'Arc-en-ciel',
    emoji: '🌈',
    description: 'Couleur : Arc-en-ciel',
    suggestedBrightness: 0.85
  }
];

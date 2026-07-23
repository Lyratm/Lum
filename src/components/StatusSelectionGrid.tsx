import React from 'react';
import { motion } from 'motion/react';
import { Mood } from '../types';
import { Check, Heart, User, Sparkles, MessageCircle, Flame, Users, Calendar } from 'lucide-react';
import { Language, CATEGORY_TRANSLATIONS, STATUS_TRANSLATIONS, TRANSLATIONS } from '../utils/i18n';

export interface StatusOption {
  id: string;
  emoji: string;
  label: string;
  description: string;
}

export interface StatusCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  options: StatusOption[];
}

interface StatusSelectionGridProps {
  selectedStatusIds: string[];
  onToggleStatusId: (statusId: string) => void;
  onClearAll: () => void;
  activeMood: Mood;
  language: Language;
}

export const STATUS_CATEGORIES: StatusCategory[] = [
  {
    id: 'romance',
    title: 'Envies romantiques',
    icon: <Heart className="w-4 h-4 text-pink-400" />,
    options: [
      { id: 'coup-de-foudre', emoji: '🍒', label: 'Coup de foudre', description: 'Relation sérieuse' },
      { id: 'flirter', emoji: '🍓', label: 'Flirter', description: 'Sans prise de tête' },
      { id: 'coup-dun-soir', emoji: '🍑', label: "Coup d'un soir", description: 'Juste ce soir' },
      { id: 'plan-regulier', emoji: '🍆', label: 'Plan régulier', description: 'On se revoit' },
      { id: 'voir-venir', emoji: '🍇', label: 'Voir venir', description: 'Prendre le temps' },
      { id: 'soiree', emoji: '🥂', label: 'Soirée', description: 'Partager une soirée' },
      { id: 'chill', emoji: '🍿', label: 'Chill', description: 'Un moment détendu' },
    ]
  },
  {
    id: 'relationship',
    title: 'Statut relationnel',
    icon: <User className="w-4 h-4 text-purple-400" />,
    options: [
      { id: 'celibataire', emoji: '🌸', label: 'Célibataire', description: 'Libre & dispo' },
      { id: 'amoureux-se', emoji: '🥰', label: 'Amoureux·se', description: 'Le cœur pris' },
      { id: 'en-couple', emoji: '🫶', label: 'En couple', description: 'Ensemble mais là' },
      { id: 'marie-e', emoji: '💍', label: 'Marié·e', description: 'Officiel' },
      { id: 'open', emoji: '🌈', label: 'Open', description: 'Relation ouverte' },
      { id: 'polyamour', emoji: '💞', label: 'Polyamour', description: 'Plusieurs liens' },
      { id: 'divorce-e', emoji: '🍂', label: 'Divorcé·e', description: 'Nouveau départ' },
      { id: 'complique', emoji: '🌀', label: 'Compliqué', description: "C'est la vie" },
    ]
  },
  {
    id: 'bond',
    title: 'Type de lien recherché',
    icon: <Users className="w-4 h-4 text-blue-450" />,
    options: [
      { id: 'ami-e', emoji: '🫂', label: 'Ami·e', description: 'Lien amical' },
      { id: 'amis-plus', emoji: '🍦', label: 'Amis+', description: 'Amitié & plus' },
      { id: 'ame-soeur', emoji: '🦋', label: 'Âme sœur', description: 'Connexion profonde' },
      { id: 'sugar', emoji: '🍭', label: 'Sugar', description: 'Arrangement doux' },
      { id: 'mentor-e', emoji: '🌿', label: 'Mentor·e', description: 'Guide & échange' },
    ]
  },
  {
    id: 'practices',
    title: 'Expérience & pratiques',
    icon: <Flame className="w-4 h-4 text-rose-400" />,
    options: [
      { id: 'vierge', emoji: '🕊️', label: 'Vierge', description: 'Première fois' },
      { id: 'debutant-e', emoji: '🌱', label: 'Débutant·e', description: "Peu d'expérience" },
      { id: 'experimente-e', emoji: '🌳', label: 'Expérimenté·e', description: 'Je sais ce que je veux' },
      { id: 'bdsm', emoji: '⛓️', label: 'BDSM', description: 'Dominant·e / soumis·e' },
      { id: 'dominante', emoji: '👑', label: 'Dominant·e', description: 'Je prends les rênes' },
      { id: 'soumise', emoji: '🎀', label: 'Soumis·e', description: 'Je me laisse guider' },
      { id: 'switch', emoji: '🔄', label: 'Switch', description: "Les deux selon l'humeur" },
      { id: 'curieux-se', emoji: '🔍', label: 'Curieux·se', description: "J'explore" },
    ]
  },
  {
    id: 'social',
    title: 'Envies sociales',
    icon: <Sparkles className="w-4 h-4 text-amber-400" />,
    options: [
      { id: 'faire-la-fete', emoji: '🍋', label: 'Faire la fête', description: 'Sortir ce soir' },
      { id: 'balade-cafe', emoji: '🥝', label: 'Balade & café', description: 'Moment sympa' },
      { id: 'voyage', emoji: '🥭', label: 'Voyage', description: 'Partir ensemble' },
      { id: 'sport', emoji: '🍏', label: 'Sport', description: 'Bouger !' },
      { id: 'gaming', emoji: '🫐', label: 'Gaming', description: 'Jouer ensemble' },
      { id: 'lecture', emoji: '📚', label: 'Lecture', description: 'Partager nos lectures' },
    ]
  },
  {
    id: 'personal',
    title: 'Envies perso',
    icon: <MessageCircle className="w-4 h-4 text-teal-400" />,
    options: [
      { id: 'calins-film', emoji: '🍊', label: 'Câlins & film', description: 'Cocooning' },
      { id: 'discussion-profonde', emoji: '🍐', label: 'Discussion profonde', description: 'Connexion réelle' },
      { id: 'aventure', emoji: '🌶️', label: 'Aventure', description: 'Du piment !' },
      { id: 'tranquillite', emoji: '🥥', label: 'Tranquillité', description: 'No drama' },
      { id: 'surprends-moi', emoji: '🍍', label: 'Surprends-moi', description: 'Ouvert à tout' },
    ]
  }
];

export const StatusSelectionGrid: React.FC<StatusSelectionGridProps> = ({
  selectedStatusIds,
  onToggleStatusId,
  onClearAll,
  activeMood,
  language
}) => {
  const t = (key: string) => TRANSLATIONS[language]?.[key] || key;

  return (
    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-6 relative overflow-hidden shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-lg font-semibold font-display tracking-tight text-slate-100 flex items-center gap-1.5 align-middle">
            {t('step2Title')}
          </h2>
          <p className="text-xs text-white/40 mt-1">
            {t('step2Sub')}
          </p>
        </div>
        {selectedStatusIds.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-[11px] self-start sm:self-center font-medium text-rose-450 hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-xl border border-rose-500/10 transition-all cursor-pointer select-none"
          >
            {t('resetBtn')} ({selectedStatusIds.length})
          </button>
        )}
      </div>

      <div className="space-y-8">
        {STATUS_CATEGORIES.map((category) => (
          <div key={category.id} className="space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/50 font-display">
              {category.icon}
              <span>{CATEGORY_TRANSLATIONS[language]?.[category.id] || category.title}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {category.options.map((option) => {
                const isSelected = selectedStatusIds.includes(option.id);
                // Translated label and description
                const optTranslation = STATUS_TRANSLATIONS[language]?.[option.id];
                const displayLabel = optTranslation?.label || option.label;
                const displayDesc = optTranslation?.description || option.description;

                return (
                  <motion.button
                    key={option.id}
                    id={`status-option-${option.id}`}
                    onClick={() => onToggleStatusId(option.id)}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    className={`relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/5'
                        : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.04] hover:border-white/10 text-white/60'
                    }`}
                    style={{
                      borderColor: isSelected ? activeMood.hexColor : 'rgba(255, 255, 255, 0.05)',
                      boxShadow: isSelected
                        ? `0 0 12px ${activeMood.hexColor}25, inset 0 0 4px ${activeMood.hexColor}10`
                        : 'none',
                    }}
                  >
                    {/* Emoji bubble */}
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-base shrink-0 border border-white/5">
                      {option.emoji}
                    </div>

                    {/* Information */}
                    <div className="flex-1 min-w-0 pr-4 leading-tight">
                      <span className="text-xs font-medium text-slate-205 block truncate">
                        {displayLabel}
                      </span>
                      <span className="text-[10px] text-white/35 block truncate mt-0.5 font-light">
                        {displayDesc}
                      </span>
                    </div>

                    {/* Small validation check indicator */}
                    {isSelected && (
                      <div 
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: activeMood.hexColor }}
                      >
                        <Check className="w-2.5 h-2.5 text-black stroke-[3px]" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

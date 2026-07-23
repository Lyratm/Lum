import React from 'react';
import { motion } from 'motion/react';
import { Mood } from '../types';
import { MoodIcon } from './MoodIcon';
import { Check } from 'lucide-react';
import { Language, MOOD_TRANSLATIONS, TRANSLATIONS } from '../utils/i18n';

interface MoodSelectorGridProps {
  moods: Mood[];
  selectedMoodId: string;
  onSelectMood: (moodId: string) => void;
  onUpdateMood: (updatedMood: Mood) => void;
  showIcons: boolean;
  language: Language;
}

export const MoodSelectorGrid: React.FC<MoodSelectorGridProps> = ({
  moods,
  selectedMoodId,
  onSelectMood,
  onUpdateMood,
  showIcons,
  language,
}) => {
  const activeMood = moods.find(m => m.id === selectedMoodId) || moods[0];
  const t = (key: string) => TRANSLATIONS[language]?.[key] || key;

  return (
    <div className="space-y-6">
      {/* Mood Selector Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold font-display tracking-tight text-slate-100 flex items-center gap-1.5">
            {t('step1Title')}
          </h2>
          <p className="text-xs text-white bg-[#202020] px-3 py-1.5 rounded-xl inline-block border border-white/5" id="gender-selection-guide-text">
            {t('step1Sub')}
          </p>
        </div>
      </div>

      {/* Grid of Moods with motion animations */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {moods.map((mood, idx) => {
          const isSelected = mood.id === selectedMoodId;
          const translatedMoodName = MOOD_TRANSLATIONS[language]?.[mood.id]?.name || mood.name;

          return (
            <motion.button
              key={mood.id}
              id={`mood-card-${mood.id}`}
              onClick={() => onSelectMood(mood.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.25 }}
              className={`relative flex flex-col items-center justify-between p-4 rounded-2xl border text-center transition-all cursor-pointer backdrop-blur-md ${
                isSelected
                  ? 'bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.02)]'
                  : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/10 text-white/65'
              }`}
              style={{
                borderColor: isSelected ? mood.hexColor : 'rgba(255, 255, 255, 0.05)',
                boxShadow: isSelected 
                  ? `0 0 20px ${mood.hexColor}33, inset 0 0 10px ${mood.hexColor}15` 
                  : 'none',
              }}
              type="button"
            >
              {/* Badge indicating active selection in top corner */}
              {isSelected && (
                <div 
                  className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px]"
                  style={{ backgroundColor: mood.hexColor }}
                >
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}

              {/* Emoji Badge on top left corner */}
              {showIcons && (
                <span className="absolute top-2.5 left-2.5 text-xs bg-slate-950/50 p-0.5 px-1 rounded-md border border-slate-800/40">
                  {mood.emoji}
                </span>
              )}

              {/* Mood main icon with colored glowing circle */}
              <div 
                className="my-3 w-16 h-16 rounded-full flex items-center justify-center bg-slate-950/50 border transition-all duration-300"
                style={{
                  borderColor: isSelected ? mood.hexColor : 'transparent',
                  background: mood.gradient 
                    ? `radial-gradient(circle, ${mood.hexColor}25 0%, transparent 100%)`
                    : `${mood.hexColor}10`,
                  boxShadow: isSelected 
                    ? `0 0 16px ${mood.hexColor}55, inset 0 0 10px ${mood.hexColor}33` 
                    : `0 0 8px ${mood.hexColor}08`,
                }}
              >
                {showIcons ? (
                  <MoodIcon
                    name={mood.iconName}
                    className="transition-colors duration-300"
                    size={24}
                    style={{ 
                      color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                      filter: isSelected ? `drop-shadow(0 0 6px ${mood.hexColor})` : undefined
                    }}
                  />
                ) : (
                  <div 
                    className="w-4.5 h-4.5 rounded-full transition-all duration-300"
                    style={{ 
                      background: mood.gradient || mood.hexColor,
                      boxShadow: isSelected ? `0 0 12px ${mood.hexColor}` : `0 0 4px ${mood.hexColor}30`
                    }}
                  />
                )}
              </div>

              {/* Text labels */}
              <div className="mt-2">
                <span 
                  className="text-sm font-semibold font-display block transition-all"
                  style={
                    isSelected && mood.gradient
                      ? {
                          background: mood.gradient,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }
                      : isSelected
                      ? { color: mood.hexColor }
                      : { color: 'rgba(255, 255, 255, 0.65)' }
                  }
                >
                  {translatedMoodName}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

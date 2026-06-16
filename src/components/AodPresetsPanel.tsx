import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mood } from '../types';
import { STATUS_CATEGORIES } from './StatusSelectionGrid';
import { Save, Edit3, Check, Sparkles, Trash2 } from 'lucide-react';
import { Language, TRANSLATIONS, MOOD_TRANSLATIONS, STATUS_TRANSLATIONS } from '../utils/i18n';

export interface PresetProfile {
  id: string;
  name: string;
  moodId: string;
  statusIds: string[];
  isConfigured: boolean;
  scheduledTime?: string; // "HH:MM" format
  isScheduleEnabled?: boolean;
}

interface AodPresetsPanelProps {
  moods: Mood[];
  selectedMoodId: string;
  selectedStatusIds: string[];
  onLoadPreset: (moodId: string, statusIds: string[]) => void;
  language: Language;
}

export const AodPresetsPanel: React.FC<AodPresetsPanelProps> = ({
  moods,
  selectedMoodId,
  selectedStatusIds,
  onLoadPreset,
  language,
}) => {
  // Load slots from localStorage or start empty (no pre-rendered blank boxes)
  const [presets, setPresets] = useState<PresetProfile[]>(() => {
    const saved = localStorage.getItem('lum_aod_presets_v5');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  const t = (key: string) => TRANSLATIONS[language]?.[key] || key;

  // Save the list of presets back to storage
  const savePresetsToStorage = (updatedPresets: PresetProfile[]) => {
    setPresets(updatedPresets);
    localStorage.setItem('lum_aod_presets_v5', JSON.stringify(updatedPresets));
  };

  // Live timer to auto-apply scheduled profiles when current hours & minutes match
  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;
      setCurrentTimeStr(timeStr);

      presets.forEach((preset) => {
        if (preset.isConfigured && preset.isScheduleEnabled && preset.scheduledTime === timeStr) {
          // Avoid repeatedly triggering in the same minute if already active
          if (activePresetId !== preset.id) {
            onLoadPreset(preset.moodId, preset.statusIds);
            setActivePresetId(preset.id);

            // Notify user with a gorgeous custom toast notification
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#9B23EA] to-[#3B82F6] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 z-50 transform translate-y-4 opacity-0 scale-95 flex items-center gap-2';
            const toastMsg = t('scheduleActiveToast').replace('{name}', preset.name);
            toast.innerHTML = `<span>⏰</span> <span>${toastMsg}</span>`;
            document.body.appendChild(toast);
            setTimeout(() => {
              toast.classList.remove('opacity-0', 'translate-y-4', 'scale-95');
            }, 10);
            setTimeout(() => {
              toast.classList.add('opacity-0', 'translate-y-4', 'scale-95');
              setTimeout(() => {
                document.body.removeChild(toast);
              }, 300);
            }, 5000);
          }
        }
      });
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [presets, activePresetId, onLoadPreset, language]);

  // Helper to find status option details
  const getStatusDetails = (id: string) => {
    for (const cat of STATUS_CATEGORIES) {
      const opt = cat.options.find(o => o.id === id);
      if (opt) return opt;
    }
    return null;
  };

  // Add current active setup as a new slot
  const handleAddCurrentConfig = () => {
    if (presets.length >= 3) {
      return;
    }

    const activeMood = moods.find(m => m.id === selectedMoodId) || moods[0];
    const translatedMoodName = MOOD_TRANSLATIONS[language]?.[activeMood.id]?.name || activeMood.name;
    const selectedOptions = selectedStatusIds
      .map(id => getStatusDetails(id))
      .filter((opt): opt is NonNullable<typeof opt> => !!opt);
    
    // We formulate name on save
    const emojisStr = selectedOptions.map(o => o.emoji).join(' ');
    const presetName = `${translatedMoodName} ${emojisStr}`.trim() || `${t('configSaved')} ${presets.length + 1}`;

    const newPreset: PresetProfile = {
      id: 'preset-' + Date.now(),
      name: presetName,
      moodId: selectedMoodId,
      statusIds: [...selectedStatusIds],
      isConfigured: true,
      scheduledTime: '20:00', // Default setting for user convenience
      isScheduleEnabled: false,
    };

    const updated = [...presets, newPreset];
    savePresetsToStorage(updated);
    setActivePresetId(newPreset.id);
    
    // Quick interactive feedback
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#9B23EA] to-[#8A1CDD] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 z-50 transform translate-y-4 opacity-0 scale-95';
    toast.innerText = t('configSavedToast');
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('opacity-0', 'translate-y-4', 'scale-95');
    }, 10);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4', 'scale-95');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 2000);
  };

  // Load slot setup into active state
  const handleLoadSlot = (preset: PresetProfile) => {
    onLoadPreset(preset.moodId, preset.statusIds);
    setActivePresetId(preset.id);
  };

  // Rename a profile slot
  const startEditing = (preset: PresetProfile) => {
    setEditingPresetId(preset.id);
    setEditNameValue(preset.name);
  };

  const handleApplyRename = (slotId: string) => {
    if (!editNameValue.trim()) return;
    const updated = presets.map((p) => {
      if (p.id === slotId) {
        return { ...p, name: editNameValue.trim() };
      }
      return p;
    });
    savePresetsToStorage(updated);
    setEditingPresetId(null);
  };

  // Switch or update schedule variables
  const handleUpdateScheduleTime = (presetId: string, time: string) => {
    const updated = presets.map((p) => {
      if (p.id === presetId) {
        return { ...p, scheduledTime: time };
      }
      return p;
    });
    savePresetsToStorage(updated);
  };

  const handleToggleSchedule = (presetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = presets.map((p) => {
      if (p.id === presetId) {
        return { ...p, isScheduleEnabled: !p.isScheduleEnabled };
      }
      return p;
    });
    savePresetsToStorage(updated);
  };

  // Clear slot back to default
  const handleClearSlot = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent loading on clear click
    const updated = presets.filter(p => p.id !== slotId);
    savePresetsToStorage(updated);
    if (activePresetId === slotId) {
      setActivePresetId(null);
    }
  };

  return (
    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-5 relative overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-semibold tracking-widest text-[#9B23EA] uppercase flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {t('presetsTabTitle')}
          </span>
          <h2 className="text-lg font-semibold font-display tracking-tight text-slate-100 mt-1">
            {t('presetsTitle')}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-white/45 font-light">
              {t('presetsSub')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {presets.map((preset, idx) => {
          const matchedMood = moods.find((m) => m.id === preset.moodId) || moods[0];
          const isSelected = activePresetId === preset.id;
          const translatedMoodName = MOOD_TRANSLATIONS[language]?.[matchedMood.id]?.name || matchedMood.name;
          
          return (
            <motion.div
              key={preset.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.3 }}
              onClick={() => handleLoadSlot(preset)}
              className={`relative p-4 rounded-xl border flex flex-col justify-between min-h-[175px] transition-all cursor-pointer backdrop-blur-md group ${
                isSelected
                  ? 'bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.02)] border-white/20'
                  : 'bg-white/[0.015] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
              }`}
              style={{
                borderColor: isSelected ? matchedMood.hexColor : 'rgba(255, 255, 255, 0.05)',
                boxShadow: isSelected 
                  ? `0 0 15px ${matchedMood.hexColor}20, inset 0 0 8px ${matchedMood.hexColor}10` 
                  : 'none',
              }}
            >
              {/* Header: Name and edit option */}
              <div className="space-y-1">
                {editingPresetId === preset.id ? (
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editNameValue}
                      onChange={(e) => setEditNameValue(e.target.value)}
                      maxLength={24}
                      className="bg-black/40 border border-white/20 rounded-md px-2 py-1 text-xs text-white outline-none w-full focus:border-[#9B23EA] transition-colors"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleApplyRename(preset.id);
                        if (e.key === 'Escape') setEditingPresetId(null);
                      }}
                    />
                    <button
                      onClick={() => handleApplyRename(preset.id)}
                      className="p-1 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded text-green-400 transition-colors cursor-pointer"
                      title={t('validate')}
                      type="button"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-1">
                    <span 
                      className="text-xs font-semibold font-display tracking-tight truncate max-w-[80%] text-slate-100"
                    >
                      {preset.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(preset);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-white/40 hover:text-white/80 transition-all cursor-pointer"
                      title={t('renameProfile')}
                      type="button"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Center Profile Visual Details Preset Preview */}
              <div className="my-2.5 flex items-center gap-3">
                {/* Small visual dot or mini glow color of saved mood */}
                <div 
                  className="w-4.5 h-4.5 rounded-full transition-all duration-300 select-none shrink-0"
                  style={{ 
                    background: matchedMood.gradient || matchedMood.hexColor,
                    boxShadow: `0 0 12px ${matchedMood.hexColor}`
                  }}
                />

                {/* Description labels: gender name + list of envies emojis */}
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-medium text-white/80 block truncate font-display">
                    {translatedMoodName}
                  </span>
                  <div className="flex items-center gap-1 mt-1 overflow-hidden" id={`preset-emojis-${preset.id}`}>
                    {preset.statusIds.length > 0 ? (
                      preset.statusIds.map((id) => {
                        const detail = getStatusDetails(id);
                        if (!detail) return null;
                        const translatedLabel = STATUS_TRANSLATIONS[language]?.[id]?.label || detail.label;
                        return (
                          <span 
                            key={id} 
                            className="text-[11px] bg-white/5 border border-white/5 rounded px-1"
                            title={translatedLabel}
                          >
                            {detail.emoji}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-[9px] text-white/35 italic">{t('noDesires')}</span>
                    )}
                  </div>
                </div>
              </div>



              {/* Bottom Slot Action Bar */}
              <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1.5" onClick={(e) => e.stopPropagation()}>
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${isSelected ? 'text-[#9B23EA]' : 'text-white/30'}`}>
                  {isSelected ? t('activeStatus') : t('configSaved')}
                </span>

                <div className="flex items-center gap-1">
                  {/* Empty slot only if configured */}
                  <button
                    onClick={(e) => handleClearSlot(preset.id, e)}
                    className="text-white/20 hover:text-rose-455 hover:bg-rose-500/10 p-1 rounded-md transition-all cursor-pointer"
                    title={t('deleteProfile')}
                    type="button"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Dash bordered plus button for empty slots up to 3 */}
        {presets.length < 3 && (
          <motion.button
            key="add-new-btn"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleAddCurrentConfig}
            className="border border-dashed border-white/10 hover:border-[#9637eb]/40 bg-white/[0.005] hover:bg-[#9B23EA]/5 rounded-xl flex flex-col items-center justify-center p-4 min-h-[175px] transition-all cursor-pointer select-none group text-white/40 hover:text-[#c48fff]"
          >
            <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 group-hover:bg-[#9B23EA]/15 group-hover:border-[#9B23EA]/35 transition-all text-white/60 group-hover:text-[#9B23EA] mb-2 shadow-inner">
              <span className="text-lg font-bold font-display">+</span>
            </div>
            <span className="text-xs font-semibold font-display tracking-tight text-white/70 group-hover:text-white">{t('saveProfileBtn')}</span>
            <span className="text-[9px] text-white/30 font-light mt-0.5">({presets.length}/3)</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import { defaultMoods } from './data/defaultMoods';
import { Mood, AodSettings } from './types';
import { LogoPrincipalAnimated } from './components/LogoPrincipalAnimated';
import { MoodSelectorGrid } from './components/MoodSelectorGrid';
import { AodSettingsPanel } from './components/AodSettingsPanel';
import { StatusSelectionGrid } from './components/StatusSelectionGrid';
import { AodPresetsPanel } from './components/AodPresetsPanel';
import { AodScreen } from './components/AodScreen';
import LoadingScreen from './components/LoadingScreen';
import { SocialSharePanel } from './components/SocialSharePanel';
import { getBrowserLanguage, Language, TRANSLATIONS, MOOD_TRANSLATIONS } from './utils/i18n';
import { 
  Sparkles, 
  Smartphone, 
  Play, 
  Info,
  Lightbulb,
  Maximize2,
  Settings2,
  Heart,
  Download,
  Share2,
  ChevronDown,
  Globe
} from 'lucide-react';

const DEFAULT_SETTINGS: AodSettings = {
  showClock: true,
  showSeconds: true,
  showDate: true,
  showStatusText: true,
  customStatusText: 'Ne pas déranger d\'ici ce soir',
  brightness: 0.7,
  burnInProtection: true,
  burnInOffsetFreq: 15, // 15 seconds to visualize active shifting
  glowIntensity: 'pulsing',
  clockLayout: 'centered',
  ambientParticles: true,
  showIcons: false,
  customEmojiTop: '✨',
  customEmojiBottomLeft: '🌈',
  customEmojiBottomRight: '🔥',
  showCustomTriangleEmojis: true,
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  // State for browser language and custom language selection
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('lum_selected_language');
    if (saved === 'fr' || saved === 'en' || saved === 'es' || saved === 'zh') {
      return saved as Language;
    }
    return getBrowserLanguage();
  });

  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // States with localStorage persistence
  const [moods, setMoods] = useState<Mood[]>(() => {
    const saved = localStorage.getItem('aod_stored_genders_v2');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved) as Mood[];
        return parsed.map(m => {
          if (m.id === 'masculin') {
            return { ...m, name: 'Masculin', phrase: 'Masculin', description: 'Couleur : Masculin' };
          }
          if (m.id === 'queer-general' && m.name === 'Queer (général)') {
            return { ...m, name: 'Queer' };
          }
          if (m.id === 'gay-homme' && m.name === 'Gay (homme)') {
            return { ...m, name: 'Gay' };
          }
          return m;
        });
      } catch (e) { console.error(e); }
    }
    return defaultMoods;
  });

  const [selectedMoodId, setSelectedMoodId] = useState<string>(() => {
    const saved = localStorage.getItem('aod_selected_gender_id_v2');
    return saved || 'masculin';
  });

  const [selectedStatusIds, setSelectedStatusIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('aod_selected_status_ids');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [settings, setSettings] = useState<AodSettings>(() => {
    const saved = localStorage.getItem('aod_stored_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_SETTINGS;
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const t = (key: string) => TRANSLATIONS[language]?.[key] || key;

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('lum_selected_language', language);
  }, [language]);

  // Loading sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3200); // 3.2s to allow animations to play
    return () => clearTimeout(timer);
  }, []);

  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const activeMood = moods.find((m) => m.id === selectedMoodId) || moods[0];

  const handleExportConfiguration = async () => {
    if (!previewRef.current || isExporting) return;
    
    setIsExporting(true);
    try {
      // Small delay to ensure any pending animations settle and fonts lead
      await new Promise(resolve => setTimeout(resolve, 500));

      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 3, 
        backgroundColor: '#000000', // AMOLED pure black background for live lockscreens
        style: {
          transform: 'none',
          borderRadius: '0px', // Export as a perfect rectangle lockscreen wallpaper
        }
      });
      
      const link = document.createElement('a');
      link.download = `lum-device-aod-${activeMood.id.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();

      const successMsg = language === 'fr' 
        ? 'Fond d\'écran enregistré avec succès ! 📲' 
        : language === 'es'
        ? '¡Fondo de pantalla guardado con éxito! 📲'
        : language === 'zh'
        ? '壁纸下载成功！📲'
        : 'Wallpaper exported successfully! 📲';
      showToast(successMsg);
    } catch (err) {
      console.error("Export failed:", err);
      showToast(language === 'fr' ? 'Erreur lors du téléchargement ❌' : 'Download error ❌');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (!previewRef.current || isSharing) return;
    setIsSharing(true);
    
    const activeMoodTranslatedName = MOOD_TRANSLATIONS[language]?.[activeMood.id]?.name || activeMood.name;

    // Fallback function to write to clipboard
    const copyToClipboardFallback = async () => {
      const shareText = t('shareMessageBody').replace('{name}', activeMoodTranslatedName) + ` - ${window.location.href}`;
      
      try {
        // Try to focus window first
        window.focus();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareText);
          showToast(t('shareAlertText'));
          return;
        }
      } catch (clipboardErr) {
        console.warn("Direct clipboard.writeText failed:", clipboardErr);
      }

      // Fallback 1: Textarea with execCommand copy
      try {
        const textarea = document.createElement("textarea");
        textarea.value = shareText;
        textarea.style.position = "fixed";
        textarea.style.top = "0";
        textarea.style.left = "0";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (successful) {
          showToast(t('shareAlertText'));
          return;
        }
      } catch (execErr) {
        console.warn("execCommand copy fallback failed:", execErr);
      }

      // Fallback 2: Interactive browser prompt allowing direct manual copying
      prompt(
        t('sharePromptText'),
        shareText
      );
    };

    try {
      // Small delay for rendering
      await new Promise(resolve => setTimeout(resolve, 300));

      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 3, 
        backgroundColor: '#000000', // AMOLED pure black background for live lockscreens
        style: {
          transform: 'none',
          borderRadius: '0px', // Export as a perfect rectangle lockscreen wallpaper
        }
      });

      // Convert dataUrl to blob then to File
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `lum-device-aod-${activeMood.id.toLowerCase()}.png`, { type: blob.type });

      // Check if navigator.share and canShare with files matches
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Lum - Mon Identité AOD',
          text: t('shareMessageBody').replace('{name}', activeMoodTranslatedName),
        });
        showToast(language === 'fr' ? 'Partagé avec succès ! ✨' : 'Shared successfully! ✨');
      } else if (navigator.share) {
        // Fallback to text/link sharing if files sharing not allowed
        await navigator.share({
          title: 'Lum - Mon Identité AOD',
          text: t('shareMessageBody').replace('{name}', activeMoodTranslatedName),
          url: window.location.href,
        });
        showToast(language === 'fr' ? 'Partagé avec succès ! ✨' : 'Shared successfully! ✨');
      } else {
        await copyToClipboardFallback();
      }
    } catch (err) {
      console.warn("Native share failed or was cancelled. Falling back to clipboard.", err);
      await copyToClipboardFallback();
    } finally {
      setIsSharing(false);
    }
  };

  // Sync state data to local storage
  useEffect(() => {
    localStorage.setItem('aod_stored_genders_v2', JSON.stringify(moods));
  }, [moods]);

  useEffect(() => {
    localStorage.setItem('aod_selected_gender_id_v2', selectedMoodId);
  }, [selectedMoodId]);

  useEffect(() => {
    localStorage.setItem('aod_selected_status_ids', JSON.stringify(selectedStatusIds));
  }, [selectedStatusIds]);

  useEffect(() => {
    localStorage.setItem('aod_stored_settings', JSON.stringify(settings));
  }, [settings]);

  // Key handler to exit fullscreen when hitting Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateMood = (updatedMood: Mood) => {
    setMoods((prev) => prev.map((m) => (m.id === updatedMood.id ? updatedMood : m)));
  };

  const handleLoadPreset = (moodId: string, statusIds: string[]) => {
    setSelectedMoodId(moodId);
    setSelectedStatusIds(statusIds);
  };

  const handleToggleStatusId = (statusId: string) => {
    setSelectedStatusIds((prev) => {
      if (prev.includes(statusId)) {
        return prev.filter((id) => id !== statusId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), statusId];
      }
      return [...prev, statusId];
    });
  };

  const handleClearAllStatuses = () => {
    setSelectedStatusIds([]);
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] flex flex-col selection:bg-[#9B23EA]/30 overflow-x-hidden relative font-sans">
      
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      {/* Immersive atmospheric glowing aura background blobs */}
      {!isFullscreen && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[10%] -left-[10%] w-[55%] h-[55%] rounded-full bg-[#9B23EA]/5 blur-[130px]" />
          <div className="absolute top-[35%] -right-[15%] w-[60%] h-[60%] rounded-full bg-purple-900/5 blur-[150px]" />
          <div className="absolute bottom-5 left-[20%] w-[45%] h-[40%] rounded-full bg-[#9B23EA]/3 blur-[125px]" />
        </div>
      )}

      {/* 1. Immersive Always On Display Viewport */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <AodScreen
              activeMood={activeMood}
              settings={settings}
              onExit={() => setIsFullscreen(false)}
              isPreview={false}
              selectedStatusIds={selectedStatusIds}
              language={language}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Standard Application Control Dashboard */}
      {!isFullscreen && (
        <>
          {/* Main Navigation Header */}
          <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-20 transition-all relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="h-[34px] min-w-[120px] flex items-center justify-start">
                      <LogoPrincipalAnimated 
                        className="h-full w-auto filter brightness-110"
                      />
                    </div>
                  </div>
                </div>

                {/* Premium tactile language selection dropdown */}
                <div 
                  ref={langMenuRef}
                  className="relative z-30"
                >
                  <button
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl text-[11px] font-semibold hover:bg-white/10 hover:border-white/20 active:scale-[0.98] select-none transition-all cursor-pointer text-white/95"
                    aria-expanded={isLangOpen}
                    aria-haspopup="true"
                    type="button"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>
                      {language === 'fr' 
                        ? 'Français 🇫🇷' 
                        : language === 'en' 
                        ? 'English 🇺🇸' 
                        : language === 'es' 
                        ? 'Español 🇪🇸' 
                        : '中文 🇨🇳'}
                    </span>
                    <ChevronDown className={`w-3 h-3 text-white/40 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isLangOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.12, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-44 bg-slate-950/95 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-30 divide-y divide-white/5 backdrop-blur-xl"
                      >
                        <div className="py-1">
                          {[
                            { code: 'fr', label: 'Français', flag: '🇫🇷' },
                            { code: 'en', label: 'English', flag: '🇺🇸' },
                            { code: 'es', label: 'Español', flag: '🇪🇸' },
                            { code: 'zh', label: '简体中文', flag: '🇨🇳' }
                          ].map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setLanguage(lang.code as Language);
                                setIsLangOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-[11px] text-left cursor-pointer transition-colors ${
                                language === lang.code
                                  ? 'bg-white/5 text-white font-semibold'
                                  : 'text-white/60 hover:bg-white/[0.03] hover:text-white'
                              }`}
                              type="button"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm select-none">{lang.flag}</span>
                                <span>{lang.label}</span>
                              </div>
                              {language === lang.code && (
                                <div className="w-1.5 h-1.5 bg-[#9B23EA] rounded-full" />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Elongated launcher button underneath the logo and language switcher */}
              <button
                id="btn-trigger-fullscreen-header"
                onClick={() => setIsFullscreen(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#9B23EA] to-[#3B82F6] text-white hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] text-xs font-semibold py-2.5 rounded-xl shadow-lg shadow-[#9B23EA]/15 transition-all cursor-pointer"
                type="button"
              >
                <Play className="w-3 h-3 fill-white text-white" />
                <span>{t('startAod')}</span>
              </button>
            </div>
          </header>

          {/* Interactive Layout Content of page */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
            
            {/* Quick Informational Hero Section */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
              <div className="max-w-3xl space-y-3">
                <span className="text-xs font-semibold tracking-widest text-[#9B23EA] uppercase flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-[#9B23EA] rounded-full animate-ping" />
                  {t('instructionLabel')}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white/95">
                  {t('instructionTitle')}
                </h2>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-3xl font-light whitespace-pre-line">
                  {t('instructionText')}
                </p>
                
                {/* Micro-Features Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-[11px] text-white/45">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-[#9B23EA] shrink-0" />
                    <span>{t('microTip1')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-[#9B23EA] shrink-0" />
                    <span>{t('microTip2')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Smartphone className="w-4 h-4 text-[#9B23EA] shrink-0" />
                    <span>{t('microTip3')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Application Bento Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Bento Segment: Mood grid and Settings Customize */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Profile presets panel */}
                <AodPresetsPanel
                  moods={moods}
                  selectedMoodId={selectedMoodId}
                  selectedStatusIds={selectedStatusIds}
                  onLoadPreset={handleLoadPreset}
                  language={language}
                />
                
                {/* Mood picker panel */}
                <MoodSelectorGrid
                  moods={moods}
                  selectedMoodId={selectedMoodId}
                  onSelectMood={setSelectedMoodId}
                  onUpdateMood={handleUpdateMood}
                  showIcons={settings.showIcons}
                  language={language}
                />

                {/* Romance, bonding, social desires selection panel */}
                <StatusSelectionGrid
                  selectedStatusIds={selectedStatusIds}
                  onToggleStatusId={handleToggleStatusId}
                  onClearAll={handleClearAllStatuses}
                  activeMood={activeMood}
                  language={language}
                />

                {/* Settings customized component */}
                <AodSettingsPanel
                  settings={settings}
                  onChange={setSettings}
                  onReset={handleResetSettings}
                  language={language}
                />
              </div>

              {/* Right Bento Segment: Beautiful Phone Mockup & Preview Status */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                
                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-5 space-y-5 shadow-2xl">
                  
                  {/* Phone Bezel Header Information */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Smartphone className="text-[#9B23EA] w-4.5 h-4.5" />
                      <h3 className="text-sm font-semibold text-white/90 font-display">{t('previewTitle')}</h3>
                    </div>
                    <span className="text-[10px] text-white/45 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full font-medium">
                      {t('previewSimulator')}
                    </span>
                  </div>

                  {/* SMARTPHONE DEVICE ENCLOSURE PORTRAIT */}
                  <div className="flex justify-center py-4 bg-white/[0.01] rounded-2xl border border-white/5 shadow-inner">
                    {/* Outer capsule container to display realistic phone body frame and button details */}
                    <div
                      className="p-6 bg-[#030303] rounded-[64px] flex items-center justify-center select-none shadow-[0_15px_30px_rgba(0,0,0,0.5)] border border-white/5"
                    >
                      <div 
                        className="relative w-[300px] h-[560px] bg-black rounded-[52px] p-3 border-[12px] border-[#18181a] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] transition-all hover:border-[#222225] z-10"
                      >
                        
                        {/* Realistic phone hardware traits */}
                        {/* Speaker Notch & Camera Pill merged beautifully */}
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-32 h-5 bg-[#18181a] rounded-b-2xl z-20 flex justify-center items-center gap-2">
                          <div className="w-10 h-1 bg-[#0a0a0b] rounded-full" />
                          <div className="w-2.5 h-2.5 bg-[#050505] rounded-full border border-white/5 shadow-inner" />
                        </div>

                        {/* Glass glare effect reflection overlay */}
                        <div className="absolute inset-0 rounded-[40px] pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent z-10" />

                        {/* Power/Volume button bumps on frames */}
                        <div className="absolute -left-[14px] top-24 w-1 h-12 bg-white/10 rounded-l-lg" />
                        <div className="absolute -left-[14px] top-40 w-1.5 h-16 bg-white/10 rounded-l-lg" />
                        <div className="absolute -right-[14px] top-32 w-1.5 h-20 bg-white/10 rounded-r-lg" />

                        {/* Embedded Screen Display component - exported as pure black lockscreen wallpaper */}
                        <div 
                          ref={previewRef}
                          className="w-full h-full rounded-[40px] bg-black overflow-hidden relative"
                        >
                        <AodScreen
                          activeMood={activeMood}
                          settings={settings}
                          onExit={() => {}}
                          isPreview={true}
                          selectedStatusIds={selectedStatusIds}
                          hideInteractiveElements={isExporting || isSharing}
                          language={language}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                  {/* Launch trigger full view container with statistics */}
                  <div className="space-y-3.5">
                    <button
                      id="btn-trigger-fullscreen-dashboard"
                      onClick={() => setIsFullscreen(true)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#9B23EA] to-[#8A1CDD] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#9B23EA]/25 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-sm font-display font-semibold"
                    >
                      <Maximize2 className="w-4.5 h-4.5 animate-pulse text-white" />
                      {t('lauchAodBtn')}
                    </button>

                    <SocialSharePanel
                      language={language}
                      activeMoodId={activeMood.id}
                      activeMoodName={MOOD_TRANSLATIONS[language]?.[activeMood.id]?.name || activeMood.name}
                      isExporting={isExporting}
                      isSharing={isSharing}
                      onDownload={handleExportConfiguration}
                      onShareNative={handleShare}
                      t={t}
                      showToast={showToast}
                    />
                    <p className="text-[11px] text-white/40 text-center leading-relaxed font-light">
                      {t('previewFooter')}
                    </p>
                  </div>
                </div>



              </div>

            </div>

          </main>

          {/* Clean footer attribution */}
          <footer className="mt-16 border-t border-white/5 bg-transparent py-10 text-center text-xs text-white/30">
            <div className="max-w-7xl mx-auto px-4 space-y-4">
              <div className="flex justify-center mb-4">
                <LogoPrincipalAnimated 
                  className="h-[27px] w-auto filter opacity-40 hover:opacity-100 transition-opacity"
                />
              </div>

            </div>
          </footer>
        </>
      )}

      {/* High-fidelity interactive ambient toast feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 bg-slate-950/90 border border-white/10 backdrop-blur-xl px-4.5 py-3 rounded-full shadow-[0_10px_35px_rgba(155,35,234,0.15)] text-white text-xs select-none"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#9B23EA] to-[#3B82F6] flex items-center justify-center text-[10px]">
              ✨
            </div>
            <span className="font-medium tracking-tight font-display">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

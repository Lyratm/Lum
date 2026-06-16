import React from 'react';
import { AodSettings } from '../types';
import { 
  Clock, 
  Sparkles, 
  ShieldAlert, 
  Sliders, 
  Type, 
  LayoutTemplate,
  RefreshCw
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/i18n';

interface AodSettingsPanelProps {
  settings: AodSettings;
  onChange: (settings: AodSettings) => void;
  onReset: () => void;
  language: Language;
}

export const AodSettingsPanel: React.FC<AodSettingsPanelProps> = ({
  settings,
  onChange,
  onReset,
  language,
}) => {
  const updateSetting = <K extends keyof AodSettings>(key: K, value: AodSettings[K]) => {
    onChange({
      ...settings,
      [key]: value
    });
  };

  const t = (key: string) => TRANSLATIONS[language]?.[key] || key;

  return (
    <div id="settings-panel" className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <Sliders id="icon-sliders" className="text-[#9B23EA] w-5 h-5" />
          <h2 id="settings-title" className="text-lg font-semibold font-display tracking-tight text-white/90">
            {t('step3Title')}
          </h2>
        </div>
        <button
          id="btn-reset-settings"
          onClick={onReset}
          className="text-xs text-white/60 hover:text-white flex items-center gap-1 transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/5"
          type="button"
        >
          <RefreshCw id="icon-reset" className="w-3 h-3 animate-pulse-on-hover" />
          {t('resetBtn')}
        </button>
      </div>

      {/* Grid of Sections */}
      <div className="space-y-6">
        {/* Row 1: Gadgets de l'AOD */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-white/30 uppercase tracking-widest block">
            {t('step3Sub')}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              id="toggle-show-clock"
              onClick={() => updateSetting('showClock', !settings.showClock)}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                settings.showClock
                  ? 'bg-gradient-to-r from-[#9B23EA]/20 to-[#9B23EA]/5 border-[#9B23EA]/40 text-white shadow-[0_0_12px_rgba(155,35,234,0.15)]'
                  : 'bg-white/[0.01] border-white/5 text-white/50 hover:bg-white/[0.03] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{t('clockLabel')}</span>
              </div>
              <div className={`w-8 h-4 rounded-full relative transition-all ${settings.showClock ? 'bg-[#9B23EA]' : 'bg-white/10'}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${settings.showClock ? 'right-0.5' : 'left-0.5'}`} />
              </div>
            </button>

            <button
              id="toggle-show-seconds"
              onClick={() => updateSetting('showSeconds', !settings.showSeconds)}
              disabled={!settings.showClock}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                !settings.showClock ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
              } ${
                settings.showSeconds && settings.showClock
                  ? 'bg-gradient-to-r from-[#9B23EA]/20 to-[#9B23EA]/5 border-[#9B23EA]/40 text-white shadow-[0_0_12px_rgba(155,35,234,0.15)]'
                  : 'bg-white/[0.01] border-white/5 text-white/50 hover:bg-white/[0.03] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 stroke-[1.5]" />
                <span className="text-sm font-medium">{t('secondsLabel')}</span>
              </div>
              <div className={`w-8 h-4 rounded-full relative transition-all ${settings.showSeconds && settings.showClock ? 'bg-[#9B23EA]' : 'bg-white/10'}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${settings.showSeconds && settings.showClock ? 'right-0.5' : 'left-0.5'}`} />
              </div>
            </button>

            <button
              id="toggle-show-date"
              onClick={() => updateSetting('showDate', !settings.showDate)}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                settings.showDate
                  ? 'bg-gradient-to-r from-[#9B23EA]/20 to-[#9B23EA]/5 border-[#9B23EA]/40 text-white shadow-[0_0_12px_rgba(155,35,234,0.15)]'
                  : 'bg-white/[0.01] border-white/5 text-white/50 hover:bg-white/[0.03] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{t('dateLabel')}</span>
              </div>
              <div className={`w-8 h-4 rounded-full relative transition-all ${settings.showDate ? 'bg-[#9B23EA]' : 'bg-white/10'}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${settings.showDate ? 'right-0.5' : 'left-0.5'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Ambient Settings */}
        <div id="ambient-settings" className="space-y-4">
          <span className="text-xs font-semibold text-white/30 uppercase tracking-widest block">
            {t('effectsLabel')}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ambient Glow mode */}
            <div className="space-y-2">
              <label id="label-glow-intensity" className="text-xs text-white/65 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#9B23EA]" />
                {t('haloLabel')}
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/5">
                {(['none', 'slow', 'pulsing'] as const).map((intensity) => {
                  const isActive = settings.glowIntensity === intensity;
                  let btnColorClass = "";
                  if (isActive) {
                    if (intensity === 'none') {
                      btnColorClass = "bg-slate-900/90 border border-slate-700/60 text-slate-400 font-semibold shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]";
                    } else if (intensity === 'slow') {
                      btnColorClass = "bg-blue-950/40 border border-blue-500/40 text-blue-300 font-bold shadow-[0_0_12px_rgba(59,130,246,0.2)]";
                    } else {
                      btnColorClass = "bg-gradient-to-r from-[#9B23EA] to-[#3B82F6] text-white font-black shadow-[0_0_16px_rgba(155,35,234,0.4)] border border-transparent";
                    }
                  } else {
                    btnColorClass = "text-white/45 border border-transparent hover:text-white/80 hover:bg-white/[0.02]";
                  }

                  return (
                    <button
                      key={intensity}
                      id={`btn-glow-${intensity}`}
                      onClick={() => updateSetting('glowIntensity', intensity)}
                      className={`text-[10px] sm:text-xs py-2 px-1 rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${btnColorClass}`}
                      type="button"
                    >
                      {/* Visual indicator icon/bullet above description */}
                      <span className="flex items-center gap-1">
                        {intensity === 'none' && (
                          <span className={`w-1.5 h-1.5 rounded-full border border-slate-500 ${isActive ? 'bg-transparent' : 'bg-transparent'}`} />
                        )}
                        {intensity === 'slow' && (
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#3B82F6] shadow-[0_0_6px_#3B82F6]' : 'bg-white/20'}`} />
                        )}
                        {intensity === 'pulsing' && (
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#d8b4fe] shadow-[0_0_8px_#a855f7] animate-ping absolute' : ''}`} />
                        )}
                        {intensity === 'pulsing' && (
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#9B23EA] shadow-[0_0_8px_#9B23EA]' : 'bg-white/20'}`} />
                        )}
                        <span>{t(`glow_${intensity}`)}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clock layout design */}
            <div className="space-y-2">
              <label id="label-clock-layout" className="text-xs text-white/65 flex items-center gap-1.5 font-medium">
                <LayoutTemplate className="w-3.5 h-3.5 text-[#9B23EA]" />
                {t('clockPosLabel')}
              </label>
              <div className="grid grid-cols-3 gap-1 bg-white/[0.01] p-1 rounded-xl border border-white/5">
                {(['centered', 'top', 'minimalist'] as const).map((layout) => (
                  <button
                    key={layout}
                    id={`btn-layout-${layout}`}
                    onClick={() => updateSetting('clockLayout', layout)}
                    className={`text-xs py-2 px-1 rounded-lg font-medium transition-all cursor-pointer ${
                      settings.clockLayout === layout
                        ? 'bg-white/10 text-white shadow-sm'
                        : 'text-white/40 hover:text-white/80'
                    }`}
                  >
                    {t(`clock_${layout}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Toggle Ambient Particles  */}
          <button
            id="toggle-ambient-particles"
            onClick={() => updateSetting('ambientParticles', !settings.ambientParticles)}
            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              settings.ambientParticles
                ? 'bg-gradient-to-r from-[#9B23EA]/15 to-[#3B82F6]/5 border-[#9B23EA]/35 text-white shadow-[0_0_12px_rgba(155,35,234,0.12)]'
                : 'bg-white/[0.01] border-white/5 text-white/50 hover:bg-white/[0.03] hover:border-white/10'
            }`}
            type="button"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 animate-pulse text-[#3B82F6]" />
              <div>
                <span className="text-sm font-semibold block text-slate-100">{t('particlesLabel')}</span>
                <span className="text-xs text-white/40 leading-snug block mt-0.5">{t('particlesSub')}</span>
              </div>
            </div>
            <div 
              className="w-8 h-4 rounded-full relative transition-all" 
              style={{
                backgroundColor: settings.ambientParticles ? '#9B23EA' : 'rgba(255,255,255,0.1)'
              }}
            >
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${settings.ambientParticles ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </button>
        </div>

        {/* Sliders Section (Burn-in protection) */}
        <div className="space-y-4 pt-2 border-t border-slate-800/50">
          {/* Burn-in protection section */}
          <button
            id="toggle-burn-in"
            onClick={() => updateSetting('burnInProtection', !settings.burnInProtection)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
              settings.burnInProtection
                ? 'bg-gradient-to-r from-[#9B23EA]/20 to-[#9B23EA]/5 border-[#9B23EA]/40 text-white shadow-[0_0_12px_rgba(155,35,234,0.15)]'
                : 'bg-white/[0.01] border-white/5 text-white/50 hover:bg-white/[0.03] hover:border-white/10'
            }`}
            type="button"
          >
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0 shadow-sm" style={{ color: '#9B23EA' }} />
              <div>
                <h4 className="text-sm font-semibold block">{t('burninLabel')}</h4>
                <p className="text-xs text-white/45">{t('burninSub')}</p>
              </div>
            </div>
            <div 
              className="w-8 h-4 rounded-full relative transition-all shrink-0 ml-4"
              style={{
                backgroundColor: settings.burnInProtection ? '#9B23EA' : 'rgba(255,255,255,0.1)'
              }}
            >
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${settings.burnInProtection ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </button>
        </div>

        {/* Row 4: Custom status message */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              id="toggle-status-text"
              onClick={() => updateSetting('showStatusText', !settings.showStatusText)}
              className={`flex items-center justify-between w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                settings.showStatusText
                  ? 'bg-gradient-to-r from-[#9B23EA]/20 to-[#9B23EA]/5 border-[#9B23EA]/40 text-white shadow-[0_0_12px_rgba(155,35,234,0.15)]'
                  : 'bg-white/[0.01] border-white/5 text-white/50 hover:bg-white/[0.03] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Type className="w-4 h-4" />
                <div>
                  <span className="text-sm font-semibold block">{t('customStatusLabel')}</span>
                  <span className="text-xs text-white/40">{t('customStatusSub')}</span>
                </div>
              </div>
              <div className={`w-8 h-4 rounded-full relative transition-all ${settings.showStatusText ? 'bg-[#9B23EA]' : 'bg-white/10'}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${settings.showStatusText ? 'right-0.5' : 'left-0.5'}`} />
              </div>
            </button>
          </div>

          {settings.showStatusText && (
            <div className="space-y-1.5">
              <input
                id="input-status-text"
                type="text"
                maxLength={45}
                placeholder={t('placeholderStatus')}
                value={settings.customStatusText}
                onChange={(e) => updateSetting('customStatusText', e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 focus:border-[#9B23EA]/50 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-white/20 focus:outline-none transition-colors"
              />
              <p className="text-[10px] text-white/40 text-right">
                {t('maxCharacters').replace('{count}', String(settings.customStatusText.length))}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

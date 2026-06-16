import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mood, AodSettings } from '../types';
import { MoodIcon } from './MoodIcon';
import { Shield, Sparkles, X } from 'lucide-react';
import { STATUS_CATEGORIES } from './StatusSelectionGrid';
import { LogoPrincipalAnimated } from './LogoPrincipalAnimated';
import { LogoPrincipalV2 } from './LogoPrincipalV2';
import { Language, LOCALIZED_DAYS, LOCALIZED_MONTHS, TRANSLATIONS } from '../utils/i18n';

interface AodScreenProps {
  activeMood: Mood;
  settings: AodSettings;
  onExit: () => void;
  isPreview?: boolean;
  selectedStatusIds?: string[];
  hideInteractiveElements?: boolean;
  language: Language;
}

export const AodScreen: React.FC<AodScreenProps> = ({
  activeMood,
  settings,
  onExit,
  isPreview = false,
  selectedStatusIds = [],
  hideInteractiveElements = false,
  language,
}) => {
  const [time, setTime] = useState(new Date());
  const [pixelOffset, setPixelOffset] = useState({ x: 0, y: 0 });
  const [shiftCount, setShiftCount] = useState(0);
  const [showExitHint, setShowExitHint] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    isInteractive?: boolean;
    life?: number;
    pulseSpeed: number;
    pulsePhase: number;
  }>>([]);
  const hintTimeoutRef = useRef<any>(null);

  const selectedOptions = React.useMemo(() => {
    if (!selectedStatusIds || selectedStatusIds.length === 0) return [];
    const flatOptions = STATUS_CATEGORIES.flatMap((cat) => cat.options);
    return selectedStatusIds
      .map((id) => flatOptions.find((opt) => opt.id === id))
      .filter((opt): opt is typeof flatOptions[0] => !!opt);
  }, [selectedStatusIds]);

  // Time updater
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Float hint timeout
  useEffect(() => {
    if (!isPreview) {
      const hintTimer = setTimeout(() => {
        setShowExitHint(false);
      }, 5000);
      return () => clearTimeout(hintTimer);
    }
  }, [isPreview]);

  // Pixel shifting (OLED Burn-in Protection) simulation
  useEffect(() => {
    if (!settings.burnInProtection) {
      setPixelOffset({ x: 0, y: 0 });
      return;
    }

    const triggerShift = () => {
      // Small randomized shift of max 5 pixels in any direction
      const dx = Math.floor(Math.random() * 9) - 4; // -4px to +4px
      const dy = Math.floor(Math.random() * 9) - 4; // -4px to +4px
      setPixelOffset({ x: dx, y: dy });
      setShiftCount((prev) => prev + 1);
    };

    // Trigger initially
    triggerShift();

    const interval = setInterval(triggerShift, settings.burnInOffsetFreq * 1000);
    return () => clearInterval(interval);
  }, [settings.burnInProtection, settings.burnInOffsetFreq]);

  // Active loop for stardust constellation
  useEffect(() => {
    if (!settings.ambientParticles) {
      starsRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    // Resize function
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Initialize stars if empty
      if (starsRef.current.length === 0) {
        const baseCount = 35;
        const initialStars = [];
        for (let i = 0; i < baseCount; i++) {
          const typeRand = Math.random();
          let color = activeMood.hexColor;
          if (typeRand < 0.35) {
            color = '#ffffff'; // beautiful white star
          } else if (typeRand < 0.55) {
            color = '#fde047'; // celestial yellow/gold
          } else if (typeRand < 0.7) {
            color = '#c084fc'; // purple aura
          }
          
          initialStars.push({
            x: Math.random() * rect.width,
            y: Math.random() * rect.height,
            vx: (Math.random() * 0.4 - 0.2), // slow drift
            vy: (Math.random() * 0.4 - 0.2), // slow drift
            size: Math.random() * 1.5 + 1.2, // slightly larger, well visible
            color,
            pulseSpeed: Math.random() * 0.03 + 0.015,
            pulsePhase: Math.random() * Math.PI * 2
          });
        }
        starsRef.current = initialStars;
      }
    };

    // Run resize immediately
    handleResize();
    window.addEventListener('resize', handleResize);

    const hexToRgb = (hex: string): string => {
      if (!hex || typeof hex !== 'string') return '155, 35, 234';
      let cleanHex = hex.replace('#', '');
      if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(char => char + char).join('');
      }
      if (cleanHex.length !== 6) return '155, 35, 234';
      const num = parseInt(cleanHex, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return `${r}, ${g}, ${b}`;
    };

    // Highlight active color
    const moodRgb = hexToRgb(activeMood.hexColor);

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines (constellation grid)
      ctx.lineWidth = 0.9;
      const maxDistance = 140; // slightly longer distance threshold so connections are clearly seen!
      
      const starsArr = starsRef.current;
      for (let i = 0; i < starsArr.length; i++) {
        const s1 = starsArr[i];
        for (let j = i + 1; j < starsArr.length; j++) {
          const s2 = starsArr[j];
          const dx = s1.x - s2.x;
          const dy = s1.y - s2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < maxDistance) {
            // Factor interactive stars fade or base opacities
            let factor = 1.0;
            if (s1.isInteractive && s1.life !== undefined) factor *= s1.life;
            if (s2.isInteractive && s2.life !== undefined) factor *= s2.life;

            const lineOpacity = (1 - dist / maxDistance) * 0.32 * factor;
            ctx.strokeStyle = `rgba(${moodRgb}, ${lineOpacity})`;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
          }
        }
      }

      // Update and draw star cores
      starsRef.current = starsArr
        .map((s) => {
          // Update raw positions coordinate-wise
          s.x += s.vx;
          s.y += s.vy;

          let stillAlive = true;
          let lifeMultiplier = 1.0;

          // If interactive, diminish life over duration
          if (s.isInteractive) {
            if (s.life !== undefined) {
              s.life -= 0.008; // smooth fade duration (~2-3 sec)
              lifeMultiplier = Math.max(0, s.life);
              if (s.life <= 0) {
                stillAlive = false;
              }
            }
          } else {
            // Static stars wrap/bounce nicely
            if (s.x < 0 || s.x > width) s.vx *= -1;
            if (s.y < 0 || s.y > height) s.vy *= -1;
            
            // Boundary safety clamping
            if (s.x < -10) s.x = width + 10;
            if (s.x > width + 10) s.x = -10;
            if (s.y < -10) s.y = height + 10;
            if (s.y > height + 10) s.y = -10;
          }

          if (!stillAlive) return null;

          // Breathing scale calculations
          s.pulsePhase += s.pulseSpeed;
          const sizeScale = 1 + 0.35 * Math.sin(s.pulsePhase);
          const drawSize = s.size * sizeScale * lifeMultiplier;

          // Draw stellar star core
          ctx.beginPath();
          ctx.arc(s.x, s.y, drawSize, 0, Math.PI * 2);

          // Build colors matching life fades
          if (s.isInteractive && s.life !== undefined) {
            ctx.fillStyle = s.color === '#ffffff' 
              ? `rgba(255, 255, 255, ${s.life})`
              : s.color === '#fde047'
              ? `rgba(253, 224, 71, ${s.life})`
              : `rgba(${moodRgb}, ${s.life})`;
          } else {
            ctx.fillStyle = s.color;
          }

          // Dynamic radial star glow (highly premium)
          ctx.shadowColor = s.color;
          ctx.shadowBlur = drawSize * 4.0; // glowing nebula aura
          ctx.fill();
          ctx.shadowBlur = 0; // reset for next passes

          return s;
        })
        .filter((s): s is typeof starsArr[0] => s !== null);

      animationFrameId = requestAnimationFrame(animate);
    };

    // Run active loop
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [settings.ambientParticles, activeMood.hexColor]);

  // Clean up exit hint timeout on unmount
  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, []);

  const spawnStarsAt = (cx: number, cy: number) => {
    if (!settings.ambientParticles) return;
    const count = 9;
    const newInteractiveStars = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.5 + 0.5;
      const rand = Math.random();
      let color = activeMood.hexColor;
      if (rand < 0.33) {
        color = '#ffffff';
      } else if (rand < 0.6) {
        color = '#fde047'; // celestial yellow/gold
      }
      
      newInteractiveStars.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.0 + 2.2, // distinctly visible
        color,
        isInteractive: true,
        life: 1.0,
        pulseSpeed: Math.random() * 0.08 + 0.04,
        pulsePhase: Math.random() * Math.PI
      });
    }
    starsRef.current = [...starsRef.current, ...newInteractiveStars];
  };

  // Clock format strings
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const daysOfLayout = LOCALIZED_DAYS[language] || LOCALIZED_DAYS.fr;
  const monthsOfLayout = LOCALIZED_MONTHS[language] || LOCALIZED_MONTHS.fr;

  const fullDateString = `${daysOfLayout[time.getDay()]} ${time.getDate()} ${monthsOfLayout[time.getMonth()]}`;

  // Dynamic visual parameters matching AOD glow levels visually (éteint, moyen, fort)
  const clockTextClass = settings.glowIntensity === 'none'
    ? 'text-slate-600 font-extralight'
    : settings.glowIntensity === 'slow'
    ? 'text-slate-200 font-light'
    : 'text-white font-extralight';

  const clockTextGlowStyle = settings.glowIntensity === 'pulsing'
    ? { textShadow: `0 0 14px ${activeMood.hexColor}60` }
    : {};

  const dateTextClass = settings.glowIntensity === 'none'
    ? 'text-slate-750 font-extralight opacity-40'
    : settings.glowIntensity === 'slow'
    ? 'text-slate-500 font-light'
    : 'text-slate-200 font-medium tracking-[0.16em]';

  // Exit trigger with safety click-count (if fullscreen, single click opens reminder, double click exits)
  const handleScreenClick = (e: React.MouseEvent) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    if (settings.ambientParticles) {
      spawnStarsAt(clickX, clickY);
    }

    if (isPreview) return; // interactive inside mockup does not need double click trigger
    
    // If they double click or click hard, exit. Let's make double-click the primary way
    if (e.detail === 2) {
      onExit();
    } else {
      // Show hint again on single click split-second
      setShowExitHint(true);
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
      }
      hintTimeoutRef.current = setTimeout(() => {
        setShowExitHint(false);
      }, 3000);
    }
  };

  // Styles for OLED simulation brightness
  const screenBrightnessStyle = {
    opacity: isPreview ? 1.0 : settings.brightness,
  };

  return (
    <div
      id={isPreview ? 'aod-preview-viewport' : 'aod-fullscreen-viewport'}
      onClick={handleScreenClick}
      className={`no-select relative bg-black font-mono select-none overflow-hidden flex flex-col transition-all duration-300 ${
        isPreview 
          ? 'w-full h-full rounded-[36px] p-6 pb-7 justify-between items-center gap-4' 
          : 'fixed inset-0 z-50 p-[env(safe-area-inset-top)_env(safe-area-inset-right)_env(safe-area-inset-bottom)_env(safe-area-inset-left)] justify-center items-center gap-16 cursor-none'
      }`}
      style={{
        backgroundColor: '#000000',
        color: '#ffffff',
        height: isPreview ? '100%' : '100dvh',
      }}
    >
      {/* Simulation Screen Brightness Overlay Filter */}
      {!isPreview && (
        <div 
          className="absolute inset-0 pointer-events-none bg-black transition-opacity duration-300"
          style={{ opacity: 1 - settings.brightness }}
        />
      )}

      {/* Embedded Ambient Glow background (Radial Aura behind the text/icon) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* level 1 (éteint): settings.glowIntensity === 'none' - renders absolutely nothing to protect AMOLED / conserve energy */}
        {settings.glowIntensity !== 'none' && (
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000 ${
              settings.glowIntensity === 'pulsing' 
                ? 'animate-pulse-slow' 
                : 'opacity-[0.14]'
            }`}
            style={{
              // level 3 (Fort / Pulsing) is much wider (540px) vs level 2 (Moyen / Slow) is smaller (300px)
              width: settings.glowIntensity === 'pulsing'
                ? (isPreview ? '280px' : '540px')
                : (isPreview ? '160px' : '300px'),
              height: settings.glowIntensity === 'pulsing'
                ? (isPreview ? '280px' : '540px')
                : (isPreview ? '160px' : '300px'),
              background: activeMood.gradient
                ? activeMood.gradient
                : `radial-gradient(circle, ${activeMood.hexColor}33 0%, transparent 70%)`,
              left: `calc(50% + ${pixelOffset.x}px)`,
              top: `calc(50% + ${pixelOffset.y}px)`,
              // level 3 uses the CSS animation keyframe opacity (pulse is 0.15 to 0.35) while level 2 stays strictly at a very dim 0.12
              opacity: settings.glowIntensity === 'pulsing' ? undefined : 0.12,
              filter: settings.glowIntensity === 'pulsing' ? 'blur-[115px]' : 'blur-[65px]',
            }}
          />
        )}

        {/* Dynamic HTML5 Canvas Constellation Grid (Micro-particles & threads floating under the elements) */}
        {settings.ambientParticles && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ width: '100%', height: '100%' }}
          />
        )}

        {/* Realistic colored glass glare reflections (reflets de couleur du genre) */}
        {/* This glass border is deactivated under 'none' to maintain pitch-black slate, and gets stronger on 'pulsing' */}
        {settings.glowIntensity !== 'none' && (
          <div 
            className="absolute inset-[3px] rounded-[33px] border pointer-events-none transition-all duration-1000"
            style={{
              borderColor: settings.glowIntensity === 'pulsing' 
                ? `${activeMood.hexColor}2b` 
                : `${activeMood.hexColor}0f`,
              boxShadow: settings.glowIntensity === 'pulsing'
                ? `inset 0 0 35px ${activeMood.hexColor}22`
                : `inset 0 0 15px ${activeMood.hexColor}0c`,
              opacity: settings.glowIntensity === 'pulsing' ? 0.65 : 0.25,
            }}
          />
        )}

        {/* Diagonal glass glare reflections - also fully disabled under 'none' and highly visible under 'pulsing' */}
        {settings.glowIntensity !== 'none' && (
          <>
            <div 
              className="absolute -top-[30%] -left-[30%] w-[160%] h-[75%] rotate-[28deg] pointer-events-none transition-all duration-1000"
              style={{
                background: `linear-gradient(135deg, ${activeMood.hexColor}15 0%, ${activeMood.hexColor}05 40%, transparent 80%)`,
                opacity: settings.glowIntensity === 'pulsing' ? 0.6 : 0.2
              }}
            />
            <div 
              className="absolute -top-[10%] left-[15%] w-[110%] h-[20%] rotate-[28deg] pointer-events-none transition-all duration-1000"
              style={{
                background: `linear-gradient(to right, transparent, ${activeMood.hexColor}0d, transparent)`,
                opacity: settings.glowIntensity === 'pulsing' ? 0.5 : 0.15
              }}
            />
          </>
        )}

        {/* Top-left corner soft ambient glow reflection - fully disabled under 'none', dim under 'slow', vibrant under 'pulsing' */}
        {settings.glowIntensity !== 'none' && (
          <div 
            className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-2xl pointer-events-none transition-all duration-1000"
            style={{
              background: activeMood.gradient || `radial-gradient(circle, ${activeMood.hexColor}35 0%, transparent 75%)`,
              opacity: settings.glowIntensity === 'pulsing' ? 0.38 : 0.12
            }}
          />
        )}

        {/* Bottom-right corner soft ambient glow reflection */}
        {settings.glowIntensity !== 'none' && (
          <div 
            className="absolute -bottom-16 -right-16 w-52 h-52 rounded-full blur-2xl pointer-events-none transition-all duration-1000"
            style={{
              background: activeMood.gradient || `radial-gradient(circle, ${activeMood.hexColor}30 0%, transparent 75%)`,
              opacity: settings.glowIntensity === 'pulsing' ? 0.42 : 0.14
            }}
          />
        )}
      </div>

      {/* HEADER SECTION (Status information / Burn-In debug monitoring) */}
      <div 
        id="aod-header"
        className="flex items-center justify-center z-10 text-[9px] text-slate-600 transition-all font-mono tracking-tight"
        style={{
          transform: `translate(${pixelOffset.x}px, ${pixelOffset.y}px)`,
        }}
      />

      {/* Animated Logo Display */}
      <div 
        className="z-10 flex items-center justify-center transition-transform duration-300 opacity-100 max-w-full px-4 overflow-visible"
        style={{
          transform: `translate(${pixelOffset.x}px, ${pixelOffset.y}px)`,
        }}
      >
        <LogoPrincipalV2 
          className={`${isPreview ? 'h-[24px]' : 'h-[38px]'} w-auto max-w-full filter brightness-125`}
        />
      </div>

      {/* CENTER / PRIMARY AOD VISUAL ENGINE */}
      <div 
        id="aod-body"
        className="flex flex-col items-center justify-center z-10 transition-transform duration-300"
        style={{
          transform: `translate(${pixelOffset.x}px, ${pixelOffset.y}px)`,
        }}
      >
        <div className="text-center w-full max-w-sm space-y-7">
          
          {/* Top Clock Layout Option */}
          {settings.showClock && settings.clockLayout === 'top' && (
            <div className="space-y-1 mb-2">
              <div 
                className={`text-4xl xs:text-5xl font-extralight tracking-tight flex justify-center items-center font-mono select-none transition-all duration-1000 ${clockTextClass}`}
                style={clockTextGlowStyle}
              >
                <span>{hours}</span>
                <span className={`mx-0.5 ${settings.showSeconds && time.getSeconds() % 2 === 0 ? 'opacity-20' : 'opacity-100'}`}>:</span>
                <span>{minutes}</span>
                {settings.showSeconds && (
                  <span className="text-lg text-slate-500 font-light ml-1.5">.{seconds}</span>
                )}
              </div>
              {settings.showDate && (
                <div className={`text-[10px] uppercase tracking-widest font-sans transition-all duration-1000 ${dateTextClass}`}>
                  {fullDateString}
                </div>
              )}
            </div>
          )}

          {/* THE MOOD GLOW CONTAINER AND ICON */}
          <div className="relative inline-flex items-center justify-center p-6 mx-auto">
            {/* Soft background halo rings around the icon */}
            {settings.glowIntensity !== 'none' && (
              <motion.div 
                animate={settings.glowIntensity === 'pulsing' ? {
                  scale: [1.2, 1.42, 1.2],
                  opacity: [0.18, 0.40, 0.18],
                } : {
                  scale: 1.25,
                  opacity: 0.12,
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-full blur-xl border transition-all duration-1000"
                style={{
                  borderColor: activeMood.gradient ? 'transparent' : activeMood.hexColor,
                  background: activeMood.gradient ? activeMood.gradient : 'transparent',
                  boxShadow: settings.glowIntensity === 'pulsing' 
                    ? `0 0 35px ${activeMood.hexColor}55`
                    : `0 0 12px ${activeMood.hexColor}22`,
                }}
              />
            )}

            <motion.div
              animate={
                settings.glowIntensity === 'pulsing' 
                  ? { scale: [1, 1.06, 1], opacity: [0.95, 1, 0.95] } 
                  : settings.glowIntensity === 'slow' 
                  ? { scale: [1, 1.02, 1], opacity: 0.9 }
                  : { scale: 1, opacity: 0.75 }
              }
              transition={{
                duration: settings.glowIntensity === 'pulsing' ? 3.0 : 6.0,
                repeat: settings.glowIntensity !== 'none' ? Infinity : 0,
                ease: "easeInOut"
              }}
              className="relative rounded-full border bg-slate-950/40 flex items-center justify-center transition-all duration-1000"
              style={{
                padding: settings.showIcons ? '1.75rem' : '1.25rem',
                borderColor: settings.glowIntensity === 'pulsing'
                  ? `${activeMood.hexColor}60`
                  : settings.glowIntensity === 'slow'
                  ? `${activeMood.hexColor}25`
                  : 'rgba(255, 255, 255, 0.05)',
                boxShadow: settings.glowIntensity === 'pulsing'
                  ? `0 0 45px ${activeMood.hexColor}55, inset 0 0 20px ${activeMood.hexColor}30`
                  : settings.glowIntensity === 'slow'
                  ? `0 0 15px ${activeMood.hexColor}18, inset 0 0 8px ${activeMood.hexColor}10`
                  : 'none'
              }}
            >
              {settings.showIcons ? (
                <MoodIcon 
                  name={activeMood.iconName} 
                  className="w-16 h-16 transition-colors duration-500 animate-[pulse-glow_4s_infinite]" 
                  size={64}
                  style={{ 
                    color: settings.glowIntensity === 'pulsing'
                      ? activeMood.hexColor
                      : settings.glowIntensity === 'slow'
                      ? `${activeMood.hexColor}cc`
                      : 'rgba(255,255,255,0.45)',
                    filter: settings.glowIntensity === 'pulsing'
                      ? `drop-shadow(0 0 12px ${activeMood.hexColor}dd)`
                      : settings.glowIntensity === 'slow'
                      ? `drop-shadow(0 0 4px ${activeMood.hexColor}66)`
                      : 'none'
                  }} 
                />
              ) : (
                /* Purely abstract glowing core representing the gender color elegantly */
                <div 
                  className="w-8 h-8 rounded-full transition-all duration-500" 
                  style={{ 
                    background: settings.glowIntensity !== 'none'
                      ? (activeMood.gradient || activeMood.hexColor)
                      : 'rgba(255,255,255,0.2)',
                    boxShadow: settings.glowIntensity === 'pulsing'
                      ? `0 0 28px ${activeMood.hexColor}, inset 0 0 8px rgba(255,255,255,0.8)`
                      : settings.glowIntensity === 'slow'
                      ? `0 0 12px ${activeMood.hexColor}aa`
                      : 'none'
                  }} 
                />
              )}
            </motion.div>



            {/* Circular positioning of dynamic statuses or fallback custom emojis */}
            {selectedOptions.length > 0 ? (
              <>
                {/* Top Emoji */}
                {selectedOptions[0] && (
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-2xl z-20 select-none pointer-events-none drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                  >
                    {selectedOptions[0].emoji}
                  </motion.div>
                )}

                {/* Bottom Left Emoji */}
                {selectedOptions[1] && (
                  <motion.div
                    animate={{ y: [0, 3, 0], x: [0, -2, 0] }}
                    transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-1 left-1.5 text-2xl z-20 select-none pointer-events-none drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                  >
                    {selectedOptions[1].emoji}
                  </motion.div>
                )}

                {/* Bottom Right Emoji */}
                {selectedOptions[2] && (
                  <motion.div
                    animate={{ y: [0, 3, 0], x: [0, 2, 0] }}
                    transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-1 right-1.5 text-2xl z-20 select-none pointer-events-none drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                  >
                    {selectedOptions[2].emoji}
                  </motion.div>
                )}
              </>
            ) : (
              settings.showCustomTriangleEmojis && (
                <>
                  {/* Top Emoji */}
                  {settings.customEmojiTop && (
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-2xl z-20 select-none pointer-events-none drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                    >
                      {settings.customEmojiTop}
                    </motion.div>
                  )}

                  {/* Bottom Left Emoji */}
                  {settings.customEmojiBottomLeft && (
                    <motion.div
                      animate={{ y: [0, 3, 0], x: [0, -2, 0] }}
                      transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -bottom-1 left-1.5 text-2xl z-20 select-none pointer-events-none drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                    >
                      {settings.customEmojiBottomLeft}
                    </motion.div>
                  )}

                  {/* Bottom Right Emoji */}
                  {settings.customEmojiBottomRight && (
                    <motion.div
                      animate={{ y: [0, 3, 0], x: [0, 2, 0] }}
                      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -bottom-1 right-1.5 text-2xl z-20 select-none pointer-events-none drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                    >
                      {settings.customEmojiBottomRight}
                    </motion.div>
                  )}
                </>
              )
            )}
          </div>

          {/* Centered Clock Layout Option */}
          {settings.showClock && settings.clockLayout === 'centered' && (
            <div className="space-y-1 mt-6">
              <div 
                className={`text-5xl font-thin tracking-tighter flex justify-center items-center font-mono transition-all duration-1000 ${clockTextClass}`}
                style={clockTextGlowStyle}
              >
                <span>{hours}</span>
                <span className={`mx-0.5 ${settings.showSeconds && time.getSeconds() % 2 === 0 ? 'opacity-20' : 'opacity-100'}`}>:</span>
                <span>{minutes}</span>
                {settings.showSeconds && (
                  <span className="text-xl text-slate-500 font-light ml-1.5">.{seconds}</span>
                )}
              </div>
              {settings.showDate && (
                <div className={`text-[11px] uppercase tracking-widest font-sans transition-all duration-1000 ${dateTextClass}`}>
                  {fullDateString}
                </div>
              )}
            </div>
          )}

          {/* Minimalist Clock Layout Option */}
          {settings.showClock && settings.clockLayout === 'minimalist' && (
            <div className={`text-xs font-mono tracking-widest mt-4 transition-all duration-1000 ${settings.glowIntensity === 'none' ? 'text-slate-650' : 'text-slate-500'}`}>
              <span className={`transition-all duration-1000 ${clockTextClass}`} style={clockTextGlowStyle}>{hours}</span>
              <span className="mx-1 animate-pulse opacity-55">:</span>
              <span className={`transition-all duration-1000 ${clockTextClass}`} style={clockTextGlowStyle}>{minutes}</span>
              {settings.showDate && <span className="mx-2 opacity-30">|</span>}
              {settings.showDate && <span className={`transition-all duration-1000 ${dateTextClass}`}>{fullDateString}</span>}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER SECTION (Custom statement text / Prompt reminder / Exit) */}
      <div 
        id="aod-footer"
        className="flex flex-col items-center justify-end z-10 gap-3 pb-2"
        style={{
          transform: `translate(${pixelOffset.x}px, ${pixelOffset.y}px)`,
        }}
      >
        {/* Custom status text line (e.g. customized DND label) */}
        {settings.showStatusText && settings.customStatusText && (
          <div className="text-[10px] text-slate-400 capitalize px-4 py-1.5 bg-slate-950/60 rounded-full border border-slate-900 text-center max-w-[280px] truncate rotate-180">
            {settings.customStatusText}
          </div>
        )}

        {/* Exit guide message for fullscreen */}
        {!isPreview ? (
          <AnimatePresence>
            {showExitHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="bg-slate-950/90 border border-slate-800 px-4 py-2 rounded-xl text-[10px] text-slate-400 font-sans tracking-wide text-center flex items-center gap-2 pointer-events-auto"
              >
                <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping" />
                {TRANSLATIONS[language]?.doubleClickExit || TRANSLATIONS.fr.doubleClickExit}
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          !hideInteractiveElements && (
            <button
              id="btn-trigger-fullscreen"
              onClick={onExit}
              className="text-[10px] text-slate-500 hover:text-slate-300 font-sans tracking-wide flex items-center gap-1.5 pointer-events-auto bg-slate-950/80 border border-slate-900 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              {TRANSLATIONS[language]?.exitPreview || TRANSLATIONS.fr.exitPreview}
            </button>
          )
        )}
      </div>

      {/* Floating Immediate Manual Close standard icon for users who might struggle with double tap */}
      {!isPreview && (
        <button
          id="btn-close-fullscreen-immediate"
          onClick={onExit}
          className="absolute top-4 right-4 text-slate-800 hover:text-slate-450 p-2 hover:bg-slate-950/20 rounded-full transition-colors pointer-events-auto z-20 cursor-pointer"
          title={TRANSLATIONS[language]?.exitAod || "Fermer l'AOD"}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
